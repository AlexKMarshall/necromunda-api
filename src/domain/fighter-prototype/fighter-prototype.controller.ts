import { NextFunction, Request, Response } from "express";
import {
  FighterPrototypeInbound,
  fighterPrototypeInboundSchema,
} from "./fighter-prototype.type";
import * as fighterPrototypeService from "./fighter-prototype.service";
import * as O from "fp-ts/lib/Option";
import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import * as z from "zod";
import { flow, pipe } from "fp-ts/lib/function";
import logger from "../../loaders/logger";

export async function handleGetFighterPrototypes(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(req.query);

  const trigger = getFighterPrototypes(req.query);

  const result = await trigger();

  if (E.isLeft(result)) {
    logger.error(result.left);
    return next(result.left);
  } else {
    res.status(200);
    res.json(result.right);
  }
}

export const getAllFighterPrototypes =
  fighterPrototypeService.findAllFighterPrototypes;

export async function handlePostFighterPrototype(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trigger = postFighterPrototype(req.body);

  const result = await trigger();

  if (E.isLeft(result)) {
    logger.error(result.left);
    return next(result.left);
  } else {
    res.status(201);
    res.json(result.right);
  }
}

export const postFighterPrototype = flow(
  parseFighterPrototype,
  TE.fromEither,
  TE.chainW(fighterPrototypeService.createFighterPrototype)
);

function parseFighterPrototype(
  fighterPrototype: unknown
): E.Either<z.ZodError, FighterPrototypeInbound> {
  const result = fighterPrototypeInboundSchema.safeParse(fighterPrototype);
  return result.success ? E.right(result.data) : E.left(result.error);
}

const querySchema = z.object({
  faction: z.string(),
});

type QueryType = z.infer<typeof querySchema>;

function parseQueryParams(query: unknown): E.Either<z.ZodError, QueryType> {
  const result = querySchema.safeParse(query);
  return result.success ? E.right(result.data) : E.left(result.error);
}

const getFighterPrototypesByFaction = flow(
  parseQueryParams,
  TE.fromEither,
  TE.chainW(({ faction }) => fighterPrototypeService.findByFactionId(faction))
);

function objectWithProps<T extends {}>(object: T): O.Option<T> {
  return Object.keys(object).length > 0 ? O.some(object) : O.none;
}

const getFighterPrototypes = flow(
  objectWithProps,
  O.fold(getAllFighterPrototypes, getFighterPrototypesByFaction)
);
