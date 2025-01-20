import { Request, Response } from "express";
import catchAsync from "../shared/catchAsync";
import { createUserSchema } from "../schema";
import AppError from "../shared/AppError";
import prisma from "../shared/prisma";
import bcrypt from "bcrypt";
import axios from "axios";
import sendResponse from "../shared/sendResponse";

const generateVerificationCode = () => {
  const timeStamp = new Date().getTime().toString() as any;
  const random = Math.floor(10 + Math.random() * 90);
  const code = (timeStamp - random).toString().slice(-5);

  return code;
};

const userRegistration = catchAsync(async (req: Request, res: Response) => {
  const parseBody = createUserSchema.safeParse(req.body);
  if (!parseBody.success) {
    throw new AppError(400, "please provide valid field");
  }

  const isUserExisted = await prisma.user.findUnique({
    where: { email: parseBody.data.email },
  });
  if (isUserExisted) {
    throw new AppError(400, "user already existed");
  }
  // hashedPassword
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(parseBody.data.password, salt);
  // create user
  const user = await prisma.user.create({
    data: {
      ...parseBody.data,
      password: hashedPassword,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      verified: true,
    },
  });
  // create profile
  const userProfile = process.env.USER_PROFILE || "http://localhost:4004";
  await axios.post(`${userProfile}/users`, {
    authUserId: user.id,
    name: user.name,
    email: user.email,
  });
  // generate verification code
  const code = generateVerificationCode();
  await prisma.verificationCode.create({
    data: {
      userId: user.id,
      code: code,
      expireAt: new Date(Date.now() + 24 * 60 * 1000), //10 minutes expiration time
      verifiedAt: '',
    },
  });

  //todo: send verification email
  await axios.post(`${process.env.EMAIL_PROFILE}/emails/send`, {
    recipient: user.email,
    subject: "Email Verification",
    body: `Your verification code is ${code}`,
    source: "user-registration",
  });
  sendResponse(res, {
    status: 201,
    success: true,
    message: "user created successfully check your email",
    data: user,
  });
});
export default userRegistration;
