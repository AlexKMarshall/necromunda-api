import * as z from "zod";
import { factionSchema } from "../faction/faction.type";

export const fighterPrototypeSchema = z.object({
  name: z.string(),
  fighterClass: z.enum(["Ganger", "Juve", "Leader", "Champion", "Prospect"]),
  faction: factionSchema,
  _id: z.string(),
});

export type FighterPrototype = z.infer<typeof fighterPrototypeSchema>;
export const fighterPrototypeInboundSchema = fighterPrototypeSchema
  .omit({ _id: true })
  .extend({ faction: z.string() });
export type FighterPrototypeInbound = z.infer<
  typeof fighterPrototypeInboundSchema
>;
