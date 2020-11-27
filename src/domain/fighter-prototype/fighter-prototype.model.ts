import mongoose, { Document, Schema } from "mongoose";
import { FighterPrototype as FighterPrototypeType } from "./fighter-prototype.type";

const fighterPrototypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  class: { type: String, required: true },
  faction: { ref: "Faction", type: Schema.Types.ObjectId, required: true },
});

const FighterPrototypeModel = mongoose.model<FighterPrototypeType & Document>(
  "FighterPrototype",
  fighterPrototypeSchema
);

export { FighterPrototypeModel };
