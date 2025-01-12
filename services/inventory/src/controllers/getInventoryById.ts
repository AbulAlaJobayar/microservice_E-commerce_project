import { Request, Response } from "express";
import catchAsync from "../shared/catchAsync";
import AppError from "../shared/AppError";
import prisma from "../shared/prisma";
import sendResponse from "../shared/sendResponse";

const getInventoryFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const inventory = await prisma.inventory.findUnique({
    where: { id },
    select: { quantity: true },
  });
  if (!inventory) {
    throw new AppError(404, "product not found");
  }
  sendResponse(res, {
    status: 200,
    success: true,
    message: "inventory find success",
    data: inventory,
  });
});
export default getInventoryFromDB
