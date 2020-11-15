import Joi from "joi";
import { Faction } from "../faction/faction.type";

export type Gang = {
  _id?: string;
  name: string;
  faction: Faction;
};

export type GangInboundDTO = Omit<Gang, "_id" | "faction"> & {
  factionId: string;
};

export const gangValidationSchema = Joi.object({
  name: Joi.string().required(),
  factionId: Joi.string().required(),
});
