import { GangModel } from "./gang.model";
import { GangInboundDTO } from "./gang.type";

export async function findGangsByUser(userId: string) {
  return await GangModel.find({ userId }).populate("faction").exec();
}

export function findGangById(id: string) {
  return GangModel.findById(id).populate("faction").exec();
}

export async function createGang(gangDTO: GangInboundDTO) {
  const newGang = new GangModel(gangDTO);
  await newGang.save();
  return newGang.populate("faction").execPopulate();
}
