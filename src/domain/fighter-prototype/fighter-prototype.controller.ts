import { Request, Response } from "express";
import { fighterPrototypeInboundSchema } from "./fighter-prototype.type";
import * as fighterPrototypeService from "./fighter-prototype.service";
import * as O from "fp-ts/lib/Option";
import * as TE from "fp-ts/lib/TaskEither";
import * as T from "fp-ts/lib/Task";
import * as z from "zod";
import { UnexpectedDatabaseError } from "../../common/exceptions/unexpectedDatabaseError";
import {
  HttpCreated,
  HttpError,
  HttpOk,
  HttpResponse,
} from "../../common/types/httpResponse";
import { flow } from "fp-ts/lib/function";
import { parseObject } from "../../common/utils/validation";
import {
  isValidationError,
  ValidationError,
} from "../../common/exceptions/validationError";

export async function handleGetFighterPrototypes(req: Request, res: Response) {
  const trigger = getFighterPrototypes(req.query);

  const result = await trigger();

  res.status(result.code);
  res.json(result.body);
}

export const getAllFighterPrototypes = flow(
  fighterPrototypeService.findAllFighterPrototypes,
  TE.fold(
    (left) => T.of(toHttpError(left)),
    (right) => T.of(HttpOk.of(right))
  )
);

export async function handlePostFighterPrototype(req: Request, res: Response) {
  const trigger = postFighterPrototype(req.body);

  const result = await trigger();

  res.status(result.code);
  res.status(result.body);
}

const parseFighterPrototype = parseObject(fighterPrototypeInboundSchema);

export const postFighterPrototype = flow(
  parseFighterPrototype,
  TE.fromEither,
  TE.chainW(fighterPrototypeService.createFighterPrototype),
  TE.fold(
    (left) => T.of(toHttpError(left)),
    (right) => T.of(HttpCreated.of(right))
  )
);

const querySchema = z.object({
  faction: z.string(),
});

const parseQueryParams = parseObject(querySchema);

const getFighterPrototypesByFaction = flow(
  parseQueryParams,
  TE.fromEither,
  TE.chainW(({ faction }) => fighterPrototypeService.findByFactionId(faction)),
  TE.fold(
    (left) => T.of(toHttpError(left)),
    (right) => T.of(HttpOk.of(right))
  )
);

function objectWithProps<T extends {}>(object: T): O.Option<T> {
  return Object.keys(object).length > 0 ? O.some(object) : O.none;
}

const getFighterPrototypes = flow(
  objectWithProps,
  O.fold(getAllFighterPrototypes, getFighterPrototypesByFaction)
);

function toHttpError(
  e: ValidationError | UnexpectedDatabaseError
): HttpResponse {
  return isValidationError(e)
    ? HttpError.of(400, e.message)
    : HttpError.of(500, e.message);
}
