import * as z from "zod";

export const userSchema = z.object({
  sub: z.string(),
  iss: z.string().optional(),
  aud: z.unknown().optional(),
  iat: z.number().optional(),
  exp: z.number().optional(),
  azp: z.string().optional(),
  gty: z.string().optional(),
  scope: z.unknown().optional(),
});

export type User = z.infer<typeof userSchema>;
