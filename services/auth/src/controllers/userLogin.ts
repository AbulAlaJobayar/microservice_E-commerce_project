import bcrypt from "bcrypt";
import { Request, Response } from "express";
import catchAsync from "../shared/catchAsync";
import { userLoginSchema } from "../schema";
import AppError from "../shared/AppError";
import prisma from "../shared/prisma";
import jwt from "jsonwebtoken";
import sendResponse from "../shared/sendResponse";
import { loginAttempt } from "@prisma/client";

type LoginHistory = {
  userId: string;
  ipAddress: string | undefined;
  userAgent: string | undefined;
  attempt: loginAttempt;
};

const createLoginHistory = async (payload: LoginHistory) => {
  await prisma.loginHistory.create({
    data: {
      userId: payload.userId,
      ipAddress: payload.ipAddress,
      userAgent: payload.userAgent,
      attempt: payload.attempt,
    },
  });
};

const userLogin = catchAsync(async (req: Request, res: Response) => {
  const ipAddress = req.headers["x-forwarded-for"] as string || req.ip || "";
  const userAgent = req.headers["user-agent"] || " ";

  const parseBody = userLoginSchema.safeParse(req.body);
  if (!parseBody.success) {

    throw new AppError(400, "invalid field please try again");
  }
  //check user is existed
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });
  if (!user) {
    await createLoginHistory({
      userId: '',
      ipAddress,
      userAgent,
      attempt: "FAILED"
    })
    throw new AppError(400, "invalid Credential");
  }
  //check password is valid
  const isMatch = await bcrypt.compare(req.body.password, user.password);
  if (!isMatch) {
    await createLoginHistory({
      userId:user.id,
      ipAddress,
      userAgent,
      attempt: "FAILED"
    })
    throw new AppError(400, "invalid Credential");
  }
  if (!user.verified) {
    throw new AppError(400, "Account is not verified");
  }
  if (user.status !== "ACTIVE") {
    await createLoginHistory({
      userId:user.id,
      ipAddress,
      userAgent,
      attempt: "FAILED"
    })
    throw new AppError(400, `Account is ${user.status.toLocaleLowerCase()}`);
  }
  const payload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  const accessToken = jwt.sign(
    {
      payload,
    },
    process.env.JWT_ACCESS_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRE_IN }
  );
  await createLoginHistory({
    userId:user.id,
    ipAddress,
    userAgent,
    attempt: "SUCCESS"
  })

  sendResponse(res, {
    status: 200,
    success: true,
    message: "Login successful",
    data: accessToken,
  });
});
export default userLogin