import { Request, Response } from "express";
import catchAsync from "../shared/catchAsync";
import prisma from "../shared/prisma";
import sendResponse from "../shared/sendResponse";

const getAllProductsFromDB = catchAsync(async (req: Request, res: Response) => {
  const result =await prisma.product.findMany({
    select: {
      id: true,
      sku: true,
      name: true,
      price: true,
      inventoryId: true,
    },
  });
  //todo:add pagination
  //todo:add filtering
  sendResponse(res, {
    status: 200,
    success: true,
    message: "product retrieved successfully",
    data: result,
  });
});
export default getAllProductsFromDB
