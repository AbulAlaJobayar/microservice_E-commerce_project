import { Request, Response } from "express";
import catchAsync from "../shared/catchAsync";
import { InventorySchema } from "../schema";
import AppError from "../shared/AppError";
import prisma from "../shared/prisma";
import sendResponse from "../shared/sendResponse";

const createInventory = catchAsync(async (req: Request, res: Response) => {
  //   validate Request
  const parseBody = InventorySchema.InventoryCreateDTOSchema.safeParse(
    req.body
  );
  if (!parseBody.success) {
    throw new AppError(400, `${parseBody.error.errors}`);
  }
  // Create new inventory item
  const inventory = await prisma.inventory.create({
    data: {
      ...parseBody.data,
      histories: {
        create: {
          actionType: "IN",
          quantityChanged: parseBody.data.quantity,
          lastQuantity: 0,
          newQuantity: parseBody.data.quantity,
        },
      },
    },
    select: {
      id: true,
      quantity: true,
    },
  });
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Inventory item created successfully",
    data: inventory,
  });
});
export default createInventory;
