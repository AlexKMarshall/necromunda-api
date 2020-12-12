import { Request, Response } from "express";
import * as gangService from "./gang.service";
import { gangInboundSchema } from "./gang.type";
import { userSchema } from "../../common/types/user";
import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import * as T from "fp-ts/lib/Task";
import { flow, pipe } from "fp-ts/lib/function";
import { parseObject } from "../../common/utils/validation";
import {
  HttpCreated,
  HttpError,
  HttpOk,
  HttpResponse,
} from "../../common/types/httpResponse";
import { UnexpectedDatabaseError } from "src/common/exceptions/unexpectedDatabaseError";
import {
  isValidationError,
  ValidationError,
} from "../../common/exceptions/validationError";

export async function handleGetGangs(req: Request, res: Response) {
  const trigger = getGangs(req.user);
  const result = await trigger();

  res.status(result.code);
  res.json(result.body);
}

export async function handleGetGangById(req: Request, res: Response) {
  const { gangId } = req.params;
  const trigger = getGangById(gangId);
  const result = await trigger();

  res.status(result.code);
  res.json(result.body);
}

export async function handlePostGang(req: Request, res: Response) {
  const trigger = postGang(req.user, req.body);
  const result = await trigger();

  res.status(result.code);
  res.json(result.body);
}

const getGangById = flow(
  gangService.findGangByID,
  TE.fold(
    (left) => T.of(toHttpError(left)),
    (right) => T.of(HttpOk.of(right))
  )
);

export function postGang<T extends {}>(user: unknown, partialGang: T) {
  return pipe(
    user,
    parseUser,
    E.chain(({ sub: userId }) => parseGangInbound({ ...partialGang, userId })),
    TE.fromEither,
    TE.chainW(gangService.createGang),
    TE.fold(
      (left) => T.of(toHttpError(left)),
      (right) => T.of(HttpCreated.of(right))
    )
  );
}
const parseGangInbound = parseObject(gangInboundSchema);
const parseUser = parseObject(userSchema);

export const getGangs = flow(
  parseUser,
  TE.fromEither,
  TE.chainW(({ sub: userId }) => gangService.findGangsByUser(userId)),
  TE.fold(
    (left) => T.of(toHttpError(left)),
    (right) => T.of(HttpOk.of(right))
  )
);

function toHttpError(
  e: ValidationError | UnexpectedDatabaseError
): HttpResponse {
  return isValidationError(e)
    ? HttpError.of(400, e.message)
    : HttpError.of(500, e.message);
}
