import Joi from "joi";
import * as z from "zod";

export const factionSchema = z.object({
  name: z.string(),
  _id: z.string().uuid(),
});

export type Faction = z.infer<typeof factionSchema>;
export const noIdFactionSchema = factionSchema.omit({ _id: true });
export type NoIdFaction = z.infer<typeof noIdFactionSchema>;

export const factionValidationSchema = Joi.object({
  name: Joi.string().required(),
});
