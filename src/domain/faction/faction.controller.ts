import { Request, Response } from "express";
import { factionInboundSchema } from "./faction.type";
import * as factionService from "./faction.service";
import * as TE from "fp-ts/lib/TaskEither";
import * as T from "fp-ts/lib/Task";
import { flow } from "fp-ts/lib/function";
import { parseObject } from "../../common/utils/validation";
import {
  isValidationError,
  ValidationError,
} from "../../common/exceptions/validationError";
import {
  HttpCreated,
  HttpError,
  HttpOk,
  HttpResponse,
} from "../../common/types/httpResponse";
import { UnexpectedDatabaseError } from "src/common/exceptions/unexpectedDatabaseError";

export async function handleGetFactions(res: Response) {
  const trigger = getFactions();

  const result = await trigger();

  res.status(result.code);
  res.json(result.body);
}

export const getFactions = flow(
  factionService.findAllFactions,
  TE.fold(
    (left) => T.of(toHttpError(left)),
    (right) => T.of(toHttpOk(right))
  )
);

export async function handlePostFaction(req: Request, res: Response) {
  const trigger = postFaction(req.body);

  const result = await trigger();

  res.status(result.code);
  res.json(result.body);
}

function toHttpError(
  e: ValidationError | UnexpectedDatabaseError
): HttpResponse {
  return isValidationError(e)
    ? HttpError.of(400, e.message)
    : HttpError.of(500, e.message);
}

function toHttpOk(body: any): HttpResponse {
  return HttpOk.of(body);
}

function toHttpCreate(body: any): HttpResponse {
  return HttpCreated.of(body);
}

export const postFaction = flow(
  parseObject(factionInboundSchema),
  TE.fromEither,
  TE.chainW(factionService.createFaction),
  TE.fold(
    (left) => T.of(toHttpError(left)),
    (right) => T.of(toHttpCreate(right))
  )
);
