import mongoose, { Document } from "mongoose";
import { Faction as FactionType } from "./faction.type";

const factionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  {
    toObject: {
      versionKey: false,
      transform: (doc, ret) => ({ ...ret, _id: doc._id.toString() }),
    },
  }
);

const FactionModel = mongoose.model<FactionType & Document>(
  "Faction",
  factionSchema
);

export { FactionModel };
