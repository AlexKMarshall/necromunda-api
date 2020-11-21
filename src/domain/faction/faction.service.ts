import { ConflictException } from "../../common/exceptions/httpException";
import { FactionModel } from "./faction.model";
import { FactionInbound } from "./faction.type";

export async function findAllFactions() {
  return await FactionModel.find();
}

export async function createFaction(factionDTO: FactionInbound) {
  const existingFaction = await FactionModel.findOne({ name: factionDTO.name });
  if (existingFaction) {
    throw new ConflictException(`Name "${factionDTO.name}" already exists`);
  }
  const newFaction = new FactionModel(factionDTO);
  await newFaction.save();
  return newFaction;
}
