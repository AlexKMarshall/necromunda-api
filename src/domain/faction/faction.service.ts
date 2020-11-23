import { FactionModel } from "./faction.model";
import { FactionInbound, Faction } from "./faction.type";
import * as TE from "fp-ts/lib/TaskEither";

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

export function createEitherFaction(
  factionDTO: FactionInbound
): TE.TaskEither<UnexpectedDatabaseError, Faction> {
  return TE.tryCatch(
    () => impureCreateFaction(factionDTO),
    (reason) => UnexpectedDatabaseError.of(reason)
  );
}

export class UnexpectedDatabaseError extends Error {
  public _tag: "UnexpectedDatabaseError";

  private constructor(reason: unknown) {
    super(`${reason}`);
    this._tag = "UnexpectedDatabaseError";
  }

  public static of(reason: unknown): UnexpectedDatabaseError {
    return new UnexpectedDatabaseError(reason);
  }
}
