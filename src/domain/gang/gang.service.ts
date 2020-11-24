import { GangModel } from "./gang.model";
import { Gang, GangInbound } from "./gang.type";
import * as TE from "fp-ts/lib/TaskEither";
import { UnexpectedDatabaseError } from "../faction/faction.service";

export async function inpureFindGangsByUser(userId: string) {
  try {
    return await GangModel.find({ userId }).populate("faction").exec();
  } catch (reason) {
    return Promise.reject(reason);
  }
}

export function findGangsByUser(
  userId: string
): TE.TaskEither<UnexpectedDatabaseError, Gang[]> {
  return TE.tryCatch(
    () => inpureFindGangsByUser(userId),
    (reason) => UnexpectedDatabaseError.of(reason)
  );
}

export function findGangById(id: string) {
  return GangModel.findById(id).populate("faction").exec();
}

export async function impureCreateGang(gangDTO: GangInbound) {
  try {
    const newGang = new GangModel(gangDTO);
    await newGang.save();
    return newGang.populate("faction").execPopulate();
  } catch (reason) {
    return Promise.reject(reason);
  }
}

export function createGang(
  gang: GangInbound
): TE.TaskEither<UnexpectedDatabaseError, Gang> {
  return TE.tryCatch(
    () => impureCreateGang(gang),
    (reason) => UnexpectedDatabaseError.of(reason)
  );
}
