import mongoose, { Document } from "mongoose";
import { Faction as FactionType } from "./faction.type";

const factionSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const FactionModel = mongoose.model<FactionType & Document>(
  "Faction",
  factionSchema
);

export { FactionModel };
