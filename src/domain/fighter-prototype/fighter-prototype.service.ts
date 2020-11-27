import { FighterPrototypeModel } from "./fighter-prototype.model";
import {
  FighterPrototypeInbound,
  FighterPrototype,
} from "./fighter-prototype.type";
import * as TE from "fp-ts/lib/TaskEither";
import { UnexpectedDatabaseError } from "../../common/exceptions/unexpectedDatabaseError";

async function impureFindAllFighterPrototypes() {
  try {
    return await FighterPrototypeModel.find().lean();
  } catch (reason) {
    return Promise.reject(reason);
  }
}

export function findAllFighterPrototypes(): TE.TaskEither<
  UnexpectedDatabaseError,
  FighterPrototype[]
> {
  return TE.tryCatch(
    () => impureFindAllFighterPrototypes(),
    (reason) => UnexpectedDatabaseError.of(reason)
  );
}

async function impureCreateFighterPrototype(
  fighterPrototype: FighterPrototypeInbound
): Promise<FighterPrototype> {
  try {
    const newFaction = new FighterPrototypeModel(fighterPrototype);
    await newFaction.save();
    return newFaction;
  } catch (reason) {
    return Promise.reject(reason);
  }
}

export function createFighterPrototype(
  fighterPrototype: FighterPrototypeInbound
): TE.TaskEither<UnexpectedDatabaseError, FighterPrototype> {
  return TE.tryCatch(
    () => impureCreateFighterPrototype(fighterPrototype),
    (reason) => UnexpectedDatabaseError.of(reason)
  );
}
