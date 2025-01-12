import { z } from "zod";
import { Status } from "@prisma/client";

export const createdProductDTOSchema = z.object({
  sku: z.string().min(3).max(10),
  name: z.string().min(3).max(255),
  description: z.string().max(1000).optional(),
  price: z.number().optional().default(0),
  status: z.nativeEnum(Status).optional().default(Status.DRAFT),
});
