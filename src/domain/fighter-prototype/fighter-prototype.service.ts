import { FighterPrototypeModel } from "./fighter-prototype.model";
import {
  FighterPrototype,
  fighterPrototypeSchema,
  FighterPrototypeInbound,
} from "./fighter-prototype.type";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import { pipe, flow } from "fp-ts/lib/function";
import { ZodError } from "zod";
import { UnexpectedDatabaseError } from "../../common/exceptions/unexpectedDatabaseError";

async function impureFindAllFighterPrototypes() {
  try {
    const fs = await FighterPrototypeModel.find().populate("faction");
    return fs.map((doc) => doc.toObject());
  } catch (reason) {
    return Promise.reject(reason);
  }
}

async function impureFindFighterPrototypesByFactionId(factionId: string) {
  try {
    console.log("faction id is ", factionId);
    const allFighterPrototypes = await FighterPrototypeModel.find().populate(
      "faction"
    );
    return allFighterPrototypes
      .map((doc) => doc.toObject())
      .filter((f) => f.faction._id === factionId);
  } catch (reason) {
    return Promise.reject(reason);
  }
}

export function findAllFighterPrototypes(): TE.TaskEither<
  UnexpectedDatabaseError | ZodError,
  FighterPrototype[]
> {
  return pipe(
    TE.tryCatch(
      () => impureFindAllFighterPrototypes(),
      (reason) => UnexpectedDatabaseError.of(reason)
    ),
    TE.chainW(flow(parseFighterPrototypeArray, TE.fromEither))
  );
}

export function findByFactionId(
  factionId: string
): TE.TaskEither<UnexpectedDatabaseError | ZodError, FighterPrototype[]> {
  return pipe(
    TE.tryCatch(
      () => impureFindFighterPrototypesByFactionId(factionId),
      (reason) => UnexpectedDatabaseError.of(reason)
    ),
    TE.chainW(flow(parseFighterPrototypeArray, TE.fromEither))
  );
}

async function impureCreateFighterPrototype(
  fighterPrototype: FighterPrototypeInbound
) {
  try {
    const newFaction = new FighterPrototypeModel(fighterPrototype);
    await newFaction.save();
    return (await newFaction.populate("faction").execPopulate()).toObject();
  } catch (reason) {
    return Promise.reject(reason);
  }
}

export function createFighterPrototype(
  fighterPrototype: FighterPrototypeInbound
): TE.TaskEither<UnexpectedDatabaseError | ZodError, FighterPrototype> {
  return pipe(
    TE.tryCatch(
      () => impureCreateFighterPrototype(fighterPrototype),
      (reason) => UnexpectedDatabaseError.of(reason)
    ),
    TE.chainW(flow(parseFighterPrototype, TE.fromEither))
  );
}

function parseFighterPrototype(
  fighterPrototype: unknown
): E.Either<ZodError, FighterPrototype> {
  const result = fighterPrototypeSchema.safeParse(fighterPrototype);
  return result.success ? E.right(result.data) : E.left(result.error);
}

function parseFighterPrototypeArray(
  fighterPrototypes: unknown
): E.Either<ZodError, FighterPrototype[]> {
  const result = fighterPrototypeSchema.array().safeParse(fighterPrototypes);
  return result.success ? E.right(result.data) : E.left(result.error);
}
