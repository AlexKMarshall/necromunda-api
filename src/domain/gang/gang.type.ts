import Joi from "joi";
import * as z from "zod";
import { factionSchema } from "../faction/faction.type";

export const gangSchema = z.object({
  name: z.string(),
  userId: z.string(),
  faction: factionSchema,
  _id: z.string().uuid(),
});

export type Gang = z.infer<typeof gangSchema>;
export const gangInboundSchema = gangSchema
  .omit({ _id: true })
  .extend({ faction: factionSchema.pick({ _id: true }) });
export type GangInboundDTO = z.infer<typeof gangInboundSchema>;

export const gangValidationSchema = Joi.object({
  name: Joi.string().required(),
  faction: Joi.string().required(),
});
