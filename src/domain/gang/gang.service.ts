import { GangModel } from "./gang.model";
import { Gang, GangInbound, gangSchema } from "./gang.type";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { UnexpectedDatabaseError } from "../../common/exceptions/unexpectedDatabaseError";
import { Fighter } from "../fighter/fighter.type";
import { parseObject } from "../../common/utils/validation";
import {
  ValidationError,
  isValidationError,
} from "../../common/exceptions/validationError";

async function impureFindGangsByUser(userId: string) {
  try {
    const gangs = await GangModel.find({ userId }).populate("faction").exec();
    return gangs.map((doc) => doc.toObject());
  } catch (reason) {
    return Promise.reject(reason);
  }
}

export function findGangsByUser(
  userId: string
): TE.TaskEither<UnexpectedDatabaseError | ValidationError, Gang[]> {
  return pipe(
    TE.tryCatch(
      () => impureFindGangsByUser(userId),
      (reason) => UnexpectedDatabaseError.of(reason)
    ),
    TE.chainEitherKW(parseGangArray)
  );
}

async function impureFindGangById(gangId: string) {
  try {
    const gang = await GangModel.findById(gangId);
    if (!gang) return Promise.reject(`Can't find gang with id: ${gangId}`);
    const populatedGang = await gang.populate("faction").execPopulate();
    return populatedGang.toObject();
  } catch (reason) {
    return Promise.reject(reason);
  }
}

export function findGangByID(gangId: string) {
  return pipe(
    TE.tryCatch(
      () => {
        return impureFindGangById(gangId);
      },
      (reason) => UnexpectedDatabaseError.of(reason)
    ),
    // `TO`DO is this a problem?
    TE.chainEitherK((maybeGang) =>
      maybeGang
        ? E.right(maybeGang)
        : E.left(UnexpectedDatabaseError.of(`No gang found with id ${gangId}`))
    ),
    TE.chainEitherKW(parseGang),
    parsingErrorHandler
  );
}

async function impureCreateGang(gangDTO: GangInbound) {
  try {
    const newGang = new GangModel(gangDTO);
    await newGang.save();
    return (await newGang.populate("faction").execPopulate()).toObject();
  } catch (reason) {
    return Promise.reject(reason);
  }
}

export function createGang(
  gang: GangInbound
): TE.TaskEither<UnexpectedDatabaseError, Gang> {
  return pipe(
    TE.tryCatch(
      () => impureCreateGang(gang),
      (reason) => UnexpectedDatabaseError.of(reason)
    ),
    TE.chainEitherKW(parseGang),
    parsingErrorHandler
  );
}

async function impureAddFighters(gangId: string, fighters: Fighter[]) {
  try {
    const gang = await GangModel.findById(gangId);
    if (!gang) return Promise.reject(`Cannot find gang with id: ${gangId}`);
    gang.fighters.push(...fighters);
    await gang.save();
    const populatedGang = await gang.populate("faction").execPopulate();
    return populatedGang.toObject();
  } catch (reason) {
    return Promise.reject(reason);
  }
}

export function addFighters(gangId: string, fighters: Fighter[]) {
  return pipe(
    TE.tryCatch(
      () => impureAddFighters(gangId, fighters),
      (reason) => UnexpectedDatabaseError.of(reason)
    ),
    TE.chainEitherKW(parseGang)
  );
}

const parseGang = parseObject(gangSchema);
const parseGangArray = parseObject(gangSchema.array());

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
