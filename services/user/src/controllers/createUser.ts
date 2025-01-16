import { Request, Response } from "express";
import catchAsync from "../shared/catchAsync";
import { userSchema } from "../schema";
import AppError from "../shared/AppError";
import prisma from "../shared/prisma";
import sendResponse from "../shared/sendResponse";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const parseBody = userSchema.createUserSchema.safeParse(req.body);
  if (!parseBody.success) {
    throw new AppError(400, "something went wrong");
  }
  //   check user already exist
  await prisma.user.findUniqueOrThrow({
    where: {
      authUserId: req.body.authUserId,
    },
  });
  //   create user
  const user = await prisma.user.create({
    data: parseBody.data,
  });
  sendResponse(res, {
    status: 201,
    success: true,
    message: "User created successfully",
    data: user,
  });
});
