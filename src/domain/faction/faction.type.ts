import * as z from "zod";

export const factionSchema = z.object({
  name: z.string(),
  _id: z.string(),
});

export type Faction = z.infer<typeof factionSchema>;
export const factionInboundSchema = factionSchema.omit({ _id: true });
export type FactionInbound = z.infer<typeof factionInboundSchema>;
