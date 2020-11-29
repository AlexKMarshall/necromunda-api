import mongoose, { Document, Schema } from "mongoose";
import { Gang as GangType } from "./gang.type";

const gangSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    faction: { ref: "Faction", type: Schema.Types.ObjectId, required: true },
    userId: { type: String, required: true },
  },
  {
    toObject: {
      versionKey: false,
      transform: (doc, ret) => ({ ...ret, _id: doc._id.toString() }),
    },
  }
);

const GangModel = mongoose.model<GangType & Document>("Gang", gangSchema);

export { GangModel };
