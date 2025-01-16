import { Request, Response } from "express";
import catchAsync from "../shared/catchAsync";
import prisma from "../shared/prisma";
import AppError from "../shared/AppError";
import sendResponse from "../shared/sendResponse";
import { User } from "@prisma/client";

// /users/:id?field=id|authUserId
const getUserById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const field = req.query.field as string;

  let user: User | null = null;

  if (field === "authUserId") {
    user = await prisma.user.findUnique({ where: { authUserId: id } });
  } else {
    user = await prisma.user.findUnique({
      where: { id },
    });
  }

  user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user) {
    throw new AppError(404, "user Not Found");
  }
  sendResponse(res, {
    status: 200,
    success: true,
    message: "User retrieved successfully",
    data: user,
  });
});
export default getUserById
