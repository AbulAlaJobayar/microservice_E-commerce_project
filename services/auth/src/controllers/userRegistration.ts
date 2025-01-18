import { Request, Response } from "express";
import catchAsync from "../shared/catchAsync";
import { createUserSchema } from "../schema";
import AppError from "../shared/AppError";
import prisma from "../shared/prisma";
import bcrypt from "bcrypt";
import axios from "axios";
import sendResponse from "../shared/sendResponse";

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
  // todo: generate verification code
  //todo: send verification email
  sendResponse(res, {
    status: 201,
    success: true,
    message: "user created successfully",
    data: user,
  });
});
