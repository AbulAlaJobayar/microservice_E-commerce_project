import { Inventory } from "./../../node_modules/.prisma/client/index.d";
import { Request, Response } from "express";
import catchAsync from "../shared/catchAsync";
import prisma from "../shared/prisma";
import AppError from "../shared/AppError";
import sendResponse from "../shared/sendResponse";

const getInventoryDetailsFromDB = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const inventoryDetails = await prisma.inventory.findUnique({
      where: { id },
      include: {
        histories: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    if (!inventoryDetails) {
      throw new AppError(404, "inventory details not found");
    }
    sendResponse(res, {
      status: 200,
      success: true,
      message: "get inventory details successfully",
      data: inventoryDetails,
    });
  }
);
export default getInventoryDetailsFromDB