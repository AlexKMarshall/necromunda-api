import { FactionModel } from "./faction.model";
import { FactionInbound, Faction, factionSchema } from "./faction.type";
import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/function";
import { isValidationError } from "../../common/exceptions/validationError";
import { parseObject } from "../../common/utils/validation";
import { UnexpectedDatabaseError } from "../../common/exceptions/unexpectedDatabaseError";
import { ValidationError } from "../../common/exceptions/validationError";

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
): TE.TaskEither<UnexpectedDatabaseError, Faction> {
  return pipe(
    TE.tryCatch(
      () => impureCreateFaction(factionDTO),
      (reason) => UnexpectedDatabaseError.of(reason)
    ),
    TE.chainEitherKW(parseFaction),
    parsingErrorHandler
  );
}

const parseFaction = parseObject(factionSchema);
const parseFactionArray = parseObject(factionSchema.array());

function parsingErrorHandler<A>(
  x: TE.TaskEither<ValidationError | UnexpectedDatabaseError, A>
) {
  return pipe(
    x,
    TE.swap,
    TE.map((e) =>
      isValidationError(e)
        ? UnexpectedDatabaseError.of(
            `Database object failed parsing ${e.message}`
          )
        : e
    ),
    TE.swap
  );
}
