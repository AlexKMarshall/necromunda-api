import mongoose, { Document } from "mongoose";

type IFaction = { name: string } & Document;

const factionSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const Faction = mongoose.model<IFaction>("Faction", factionSchema);

export { Faction, IFaction };
