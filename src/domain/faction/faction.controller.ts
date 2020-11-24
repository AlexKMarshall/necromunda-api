import { NextFunction, Request, Response } from "express";
import { FactionInbound, factionInboundSchema } from "./faction.type";
import * as factionService from "./faction.service";
import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import { ZodError } from "zod";
import { flow } from "fp-ts/lib/function";
import logger from "../../loaders/logger";

export async function handleGetFactions(
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
    res.json(result.right).status(200);
  }
}

export const getFactions = factionService.findAllFactions;

export async function handlePostFaction(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trigger = postFaction(req.body);

  const result = await trigger();

  if (E.isLeft(result)) {
    logger.error(result.left);
    return next(result.left);
  } else {
    res.json(result.right).status(201);
  }
}

export const postFaction = flow(
  parseFaction,
  TE.fromEither,
  TE.chainW(factionService.createFaction)
);

function parseFaction(faction: unknown): E.Either<ZodError, FactionInbound> {
  const result = factionInboundSchema.safeParse(faction);
  return result.success ? E.right(result.data) : E.left(result.error);
}
