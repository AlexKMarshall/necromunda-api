import Joi from "joi";
import { Document } from "mongoose";

export type Faction = {
  _id: string;
  name: string;
};

export type FactionInboundDTO = Omit<Faction, "_id">;

export type FactionDocument = Faction & Document;

export const factionValidationSchema = Joi.object({
  name: Joi.string().required(),
});
