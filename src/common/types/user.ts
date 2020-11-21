import * as z from "zod";

export const userSchema = z.object({
  sub: z.string(),
});

export type User = z.infer<typeof userSchema>;
