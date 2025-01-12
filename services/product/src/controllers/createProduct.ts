import { createdProductDTOSchema} from "./../schema";
import { Request, Response } from "express";
import catchAsync from "../shared/catchAsync";
import sendResponse from "../shared/sendResponse";
import AppError from "../shared/AppError";
import prisma from "../shared/prisma";
import axios from "axios";
import { INVENTORY_URL } from "../config";

const createProduct = catchAsync(async (req: Request, res: Response) => {
  //parse body
  console.log(req.body)
  const parseBody = createdProductDTOSchema.safeParse(req.body);
  console.log("parse error")
  console.log(parseBody)
  if (!parseBody.success) {
    throw new AppError(400, `${parseBody.error.errors}`);
  }
  //check if are exist product
console.log("after parse")
  const existingProduct = await prisma.product.findFirst({
    where: {
      sku: parseBody.data.sku,
    },
  });
  if (existingProduct) {
    throw new AppError(409, "Product already stored in your store");
  }
  //create product
  const product = await prisma.product.create({
    data: {
      ...parseBody.data,
    },
  });
 
  //create inventory
  const { data: inventory } = await axios.post(`${INVENTORY_URL}/inventory`, {
    productId: product.id,
    sku: product.sku,
  });
  //update product and store inventory ID

  const updateProduct= await prisma.product.update({
    where: {
      id: product.id,
    },
    data: {
      inventoryId: inventory.data.id,
    },
  });
  console.log('update product',updateProduct)
  sendResponse(res, {
    status: 201,
    success: true,
    message: "product created Successfully",
    data:updateProduct
  });
});
export default createProduct
