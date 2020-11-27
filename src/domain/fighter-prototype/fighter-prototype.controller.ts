import { NextFunction, Request, Response } from "express";
import {
  FighterPrototypeInbound,
  fighterPrototypeInboundSchema,
} from "./fighter-prototype.type";
import * as fighterPrototypeService from "./fighter-prototype.service";
import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import { ZodError } from "zod";
import { flow } from "fp-ts/lib/function";
import logger from "../../loaders/logger";

export async function handleGetFighterPrototypes(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trigger = getFactions();

  const result = await trigger();

  if (E.isLeft(result)) {
    logger.error(result.left);
    return next(result.left);
  } else {
    res.status(200);
    res.json(result.right);
  }
}

export const getFactions = fighterPrototypeService.findAllFighterPrototypes;

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
): E.Either<ZodError, FighterPrototypeInbound> {
  const result = fighterPrototypeInboundSchema.safeParse(fighterPrototype);
  return result.success ? E.right(result.data) : E.left(result.error);
}
