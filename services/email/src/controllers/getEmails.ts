import { Request, Response } from "express";
import catchAsync from "../shared/catchAsync";
import prisma from "../shared/prisma";
import sendResponse from "../shared/sendResponse";

const getEmail = catchAsync(async (req: Request, res: Response) => {
  const result = await prisma.email.findMany({});
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Email fetched successfully",
    data: result,
  });
});
export default getEmail
