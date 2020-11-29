import { FactionModel } from "./faction.model";
import { FactionInbound, Faction, factionSchema } from "./faction.type";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { ZodError } from "zod";
import { UnexpectedDatabaseError } from "../../common/exceptions/unexpectedDatabaseError";

async function impureFindAllFactions() {
  try {
    const factionsDocs = await FactionModel.find();
    return factionsDocs.map((doc) => doc.toObject());
  } catch (reason) {
    return Promise.reject(reason);
  }
}

export function findAllFactions() {
  return pipe(
    TE.tryCatch(
      () => impureFindAllFactions(),
      (reason) => UnexpectedDatabaseError.of(reason)
    ),
    TE.chainEitherKW(parseFactionArray)
  );
}

async function impureCreateFaction(
  factionDTO: FactionInbound
): Promise<Faction> {
  try {
    const newFaction = new FactionModel(factionDTO);
    await newFaction.save();
    return newFaction.toObject();
  } catch (reason) {
    return Promise.reject(reason);
  }
}

export function createFaction(
  factionDTO: FactionInbound
): TE.TaskEither<UnexpectedDatabaseError | ZodError, Faction> {
  return pipe(
    TE.tryCatch(
      () => impureCreateFaction(factionDTO),
      (reason) => UnexpectedDatabaseError.of(reason)
    ),
    TE.chainEitherKW(parseFaction)
  );
}

function parseFactionArray(faction: unknown): E.Either<ZodError, Faction[]> {
  const result = factionSchema.array().safeParse(faction);
  return result.success ? E.right(result.data) : E.left(result.error);
}

function parseFaction(faction: unknown): E.Either<ZodError, Faction> {
  const result = factionSchema.safeParse(faction);
  return result.success ? E.right(result.data) : E.left(result.error);
}
