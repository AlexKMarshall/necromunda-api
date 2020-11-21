import * as z from "zod";

export const userSchema = z
  .object({
    sub: z.string(),
  })
  .nonstrict();

export type User = z.infer<typeof userSchema>;
