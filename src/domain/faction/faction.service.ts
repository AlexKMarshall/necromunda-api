import { ConflictException } from "../../common/exceptions/httpException";
import { FactionModel } from "./faction.model";
import { FactionInbound, Faction } from "./faction.type";
import * as TE from "fp-ts/lib/TaskEither";

export async function unsafeFindAllFactions() {
  try {
    return await FactionModel.find();
  } catch (reason) {
    return Promise.reject(reason);
  }
}

export function findAllFactions(): TE.TaskEither<
  UnexpectedDatabaseError,
  Faction[]
> {
  return TE.tryCatch(
    () => unsafeFindAllFactions(),
    (reason) => UnexpectedDatabaseError.of(reason)
  );
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

async function unsafeCreateFaction(
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
    () => unsafeCreateFaction(factionDTO),
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
