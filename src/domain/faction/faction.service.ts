import { FactionModel } from "./faction.model";
import { FactionInboundDTO } from "./faction.type";

export async function findAllFactions() {
  return await FactionModel.find();
}

export async function createFaction(factionDTO: FactionInboundDTO) {
  const newFaction = new FactionModel(factionDTO);
  await newFaction.save();
  return newFaction;
}
