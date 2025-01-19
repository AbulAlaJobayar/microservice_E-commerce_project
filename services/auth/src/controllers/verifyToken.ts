import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import catchAsync from "../shared/catchAsync";
import { accessTokenSchema } from "../schema";
import AppError from "../shared/AppError";
import prisma from "../shared/prisma";
import sendResponse from "../shared/sendResponse";

const verifyToken = catchAsync(async (req: Request, res: Response) => {
  const parseBody = accessTokenSchema.safeParse(req.body);
  if (!parseBody.success) {
    throw new AppError(400, "please provide valid input");
  }
  const { accessToken } = parseBody.data;
  const decoded = jwt.verify(
    accessToken,
    process.env.JWT_ACCESS_SECRET as string
  );
  const user = prisma.user.findUnique({
    where: { id: (decoded as any).id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
  if (!user) {
    throw new AppError(401, "unauthorized");
  }
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Authorized",
    data: "",
  });
});
export default verifyToken 