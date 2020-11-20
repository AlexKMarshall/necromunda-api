import mongoose, { Document } from "mongoose";
import { Faction as FactionType } from "./faction.type";

mongoose.ObjectId.get(v => v.toString());

const factionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

const FactionModel = mongoose.model<FactionType & Document>(
  "Faction",
  factionSchema
);

export { FactionModel };
