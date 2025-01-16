import { z } from "zod";
const createUserSchema = z.object({
  authUserId: z.string(),
  name: z.string(),
  email: z.string().email(),
  address: z.string().optional(),
  phone: z.string().optional(),
});
const updateUserSchema = createUserSchema.omit({ authUserId: true }).partial();
export const userSchema = {
  createUserSchema,
  updateUserSchema,
};
