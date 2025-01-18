import { z } from "zod";

 export const createUserSchema=z.object({
    email:z.string().email(),
    password:z.string().min(6).max(255),
    name:z.string().min(3).max(255)
})