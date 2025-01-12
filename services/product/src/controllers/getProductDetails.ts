import { Request, Response } from "express";
import catchAsync from "../shared/catchAsync";
import prisma from "../shared/prisma";
import AppError from "../shared/AppError";
import axios from "axios";
import { INVENTORY_URL } from "../config";
import sendResponse from "../shared/sendResponse";

const getProductDetailsFromDB = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    //find product
    const product = await prisma.product.findUnique({
      where: { id },
    });
    if (!product) {
      throw new AppError(404, "Product not found");
    }
    if (product.inventoryId === null) {
      const { data: inventory } = await axios.post(
        `${INVENTORY_URL}/inventory`,
        {
          productId: product.id,
          sku: product.sku,
        }
      );
      //update inventory
      const updateProduct = await prisma.product.update({
        where: { id: product.id },
        data: { inventoryId: product.id },
      });
    }
    const { data: inventory } = await axios.get(
      `${INVENTORY_URL}/inventory/${product.inventoryId}`
    );
    sendResponse(res, {
      status: 200,
      success: true,
      message: "single product retrieved successfully",
      data: {
        ...product,
        stock: inventory.quantity || 0,
        stockStatus: inventory.quantity > 0 ? "In Stock" : "Out Of Stock",
      },
    });
  }
);
export default getProductDetailsFromDB;
