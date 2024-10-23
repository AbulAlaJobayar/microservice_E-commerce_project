import { ActionType } from "@prisma/client";
import { z } from "zod";

const InventoryCreateDTOSchema = z.object({
  productId: z.string(),
  sku: z.string(),
  quantity: z.number().int().optional().default(0),
});

const InventoryUpdateDTOSchema = z.object({
  quantity: z.number().int(),
  actionType: z.nativeEnum(ActionType),
});
export const InventorySchema = {
  InventoryCreateDTOSchema,
  InventoryUpdateDTOSchema,
};
