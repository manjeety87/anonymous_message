import { z } from "zod";

export const messageSchema = z.object({
  message: z
    .string()
    .min(10, { message: "Message must be atleast 10 characters" })
    .max(500, "Message must be no more than 500 characters"),
});
