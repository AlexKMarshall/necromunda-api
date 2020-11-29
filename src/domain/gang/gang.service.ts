import { GangModel } from "./gang.model";
import { Gang, GangInbound, gangSchema } from "./gang.type";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { ZodError } from "zod";
import { UnexpectedDatabaseError } from "../../common/exceptions/unexpectedDatabaseError";

async function inpureFindGangsByUser(userId: string) {
  try {
    const gangs = await GangModel.find({ userId }).populate("faction").exec();
    return gangs.map((doc) => doc.toObject());
  } catch (reason) {
    return Promise.reject(reason);
  }
}

export function findGangsByUser(
  userId: string
): TE.TaskEither<UnexpectedDatabaseError | ZodError, Gang[]> {
  return pipe(
    TE.tryCatch(
      () => inpureFindGangsByUser(userId),
      (reason) => UnexpectedDatabaseError.of(reason)
    ),
    TE.chainEitherKW(parseGangArray)
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
): TE.TaskEither<UnexpectedDatabaseError | ZodError, Gang> {
  return pipe(
    TE.tryCatch(
      () => impureCreateGang(gang),
      (reason) => UnexpectedDatabaseError.of(reason)
    ),
    TE.chainEitherKW(parseGang)
  );
}

function parseGang(gang: unknown): E.Either<ZodError, Gang> {
  const result = gangSchema.safeParse(gang);
  return result.success ? E.right(result.data) : E.left(result.error);
}

function parseGangArray(gangs: unknown): E.Either<ZodError, Gang[]> {
  const result = gangSchema.array().safeParse(gangs);
  return result.success ? E.right(result.data) : E.left(result.error);
}
