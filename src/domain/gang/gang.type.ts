import * as z from "zod";
import { factionSchema } from "../faction/faction.type";
import { fighterSchema } from "../fighter/fighter.type";

export const gangSchema = z.object({
  name: z.string(),
  userId: z.string(),
  faction: factionSchema,
  _id: z.string(),
  fighters: z.array(fighterSchema),
});

export type Gang = z.infer<typeof gangSchema>;
export const gangInboundSchema = gangSchema
  .omit({ _id: true, fighters: true })
  .extend({ faction: z.string() });
export type GangInbound = z.infer<typeof gangInboundSchema>;
