import mongoose, { Document, Schema } from "mongoose";
import { IFaction } from "./faction";

type IGang = {
  name: string;
  faction: IFaction["_id"];
} & Document;

const gangSchema = new mongoose.Schema({
  name: { type: String, required: true },
  faction: { ref: "Faction", type: Schema.Types.ObjectId, required: true },
});

const Gang = mongoose.model<IGang>("Gang", gangSchema);

export { Gang, IGang };
