import { FactionModel } from "./faction.model";
import { FactionInbound, Faction } from "./faction.type";
import * as TE from "fp-ts/lib/TaskEither";
import { UnexpectedDatabaseError } from "../../common/exceptions/unexpectedDatabaseError";

async function impureFindAllFactions() {
  try {
    return await FactionModel.find().lean();
  } catch (reason) {
    return Promise.reject(reason);
  }
}

export function findAllFactions(): TE.TaskEither<
  UnexpectedDatabaseError,
  Faction[]
> {
  return TE.tryCatch(
    () => impureFindAllFactions(),
    (reason) => UnexpectedDatabaseError.of(reason)
  );
}

async function impureCreateFaction(
  factionDTO: FactionInbound
): Promise<Faction> {
  try {
    const newFaction = new FactionModel(factionDTO);
    await newFaction.save();
    return newFaction;
  } catch (reason) {
    return Promise.reject(reason);
  }
}

export function createFaction(
  factionDTO: FactionInbound
): TE.TaskEither<UnexpectedDatabaseError, Faction> {
  return TE.tryCatch(
    () => impureCreateFaction(factionDTO),
    (reason) => UnexpectedDatabaseError.of(reason)
  );
}
