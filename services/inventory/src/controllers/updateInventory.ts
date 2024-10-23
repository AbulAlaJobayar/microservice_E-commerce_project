import { ActionType } from "./../../node_modules/.prisma/client/index.d";
import { Request, Response } from "express";
import catchAsync from "../shared/catchAsync";
import { InventorySchema } from "../schema";
import prisma from "../shared/prisma";
import AppError from "../shared/AppError";
import sendResponse from "../shared/sendResponse";

const InventoryUpdate = catchAsync(async (req: Request, res: Response) => {
  // if inventory is exists
  const { id } = req.params;
  const inventory = await prisma.inventory.findUnique({
    where: { id },
  });
  if (!inventory) {
    throw new AppError(404, "This product is not available");
  }

  //Validate Request
  const parseBody = InventorySchema.InventoryUpdateDTOSchema.safeParse(
    req.body
  );
  if (!parseBody.success) {
    throw new AppError(400, `${parseBody.error.errors}`);
  }
  // last History
  const lastHistory = await prisma.history.findFirst({
    where: { inventoryId: id },
    orderBy: { createdAt: "desc" },
  });
  //  calculateHistory
  let newQuantity = inventory.quantity;
  if (parseBody.data.actionType === "IN") {
    newQuantity += parseBody.data.quantity;
  } else if (parseBody.data.actionType === "OUT") {
    newQuantity -= parseBody.data.quantity;
  } else {
    throw new AppError(400, "invalid action type");
  }

  // Update inventory item
  const updateInventory = await prisma.inventory.update({
    where: {
      id,
    },
    data: {
      quantity: newQuantity,
      histories: {
        create: {
          actionType: parseBody.data.actionType,
          quantityChanged: parseBody.data.quantity,
          lastQuantity: lastHistory?.newQuantity || 0,
          newQuantity,
        },
      },
    },
    select: {
      id: true,
      quantity: true,
    },
  });
  sendResponse(res,{
    status: 200,
    success: true,
    message: "Inventory item updated successfully",
    data: updateInventory,
  })
});
export default InventoryUpdate