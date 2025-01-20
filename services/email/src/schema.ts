import { z } from "zod";

export const createEmailSchema=z.object({
  recipient: z.string().email(),
  subject: z.string(),
  body: z.string(),
  source:z.string(),
  sender:z.string().email().optional()
})