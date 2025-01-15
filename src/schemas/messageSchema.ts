import { z } from "zod";

export const storySchema = z.object({
  story: z
    .string()
    .min(10, { message: "Message must be atleast 10 characters" })
    .max(500, "Message must be no more than 500 characters"),
});
