import * as z from "zod";
import { factionSchema } from "../faction/faction.type";

export const gangSchema = z.object({
  name: z.string(),
  userId: z.string(),
  faction: factionSchema,
  _id: z.string(),
});

export type Gang = z.infer<typeof gangSchema>;
export const gangInboundSchema = gangSchema
  .omit({ _id: true })
  .extend({ faction: z.string() });
export type GangInboundDTO = z.infer<typeof gangInboundSchema>;
