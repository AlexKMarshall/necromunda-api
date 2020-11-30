import { NextFunction, Request, Response } from "express";
import { factionInboundSchema } from "./faction.type";
import * as factionService from "./faction.service";
import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import { flow } from "fp-ts/lib/function";
import logger from "../../loaders/logger";
import { parseObject } from "../../common/utils/validation";

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
    res.status(200);
    res.json(result.right);
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
    res.status(201);
    res.json(result.right);
  }
}

export const postFaction = flow(
  parseObject(factionInboundSchema),
  TE.fromEither,
  TE.chainW(factionService.createFaction)
);
