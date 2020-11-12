import mongoose from "mongoose";

const factionSchema = new mongoose.Schema({
  name: String,
});

const Faction = mongoose.model("Faction", factionSchema);

export { Faction };
