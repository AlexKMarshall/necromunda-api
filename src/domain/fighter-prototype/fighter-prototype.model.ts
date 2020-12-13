import mongoose, { Schema, Document } from "mongoose";
import { FighterPrototype } from "./fighter-prototype.type";

const fighterPrototypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    fighterClass: { type: String, required: true },
    faction: { ref: "Faction", type: Schema.Types.ObjectId, required: true },
  },
  {
    toObject: {
      versionKey: false,
      transform: (doc, ret) => ({ ...ret, _id: doc._id.toString() }),
    },
  }
);

const FighterPrototypeModel = mongoose.model<FighterPrototype & Document>(
  "FighterPrototype",
  fighterPrototypeSchema
);

export { FighterPrototypeModel };
