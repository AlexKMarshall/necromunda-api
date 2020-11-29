import mongoose, { Document, Schema } from "mongoose";
import { FighterPrototype as FighterPrototypeType } from "./fighter-prototype.type";

const fighterPrototypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    class: { type: String, required: true },
    faction: { ref: "Faction", type: Schema.Types.ObjectId, required: true },
  },
  {
    toObject: {
      versionKey: false,
      transform: (doc, ret) => ({ ...ret, _id: doc._id.toString() }),
    },
  }
);

const FighterPrototypeModel = mongoose.model(
  "FighterPrototype",
  fighterPrototypeSchema
);

export { FighterPrototypeModel };
