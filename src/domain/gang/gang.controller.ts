import { Request, Response, NextFunction } from "express";
import * as gangService from "./gang.service";
import { GangInbound, gangInboundSchema } from "./gang.type";
import { User, userSchema } from "../../common/types/user";
import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import { ZodError } from "zod";
import { flow } from "fp-ts/lib/function";
import logger from "../../loaders/logger";

export async function handleGetGangs(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trigger = getGangs(req.user);
  const result = await trigger();

  if (E.isLeft(result)) {
    logger.error(result.left);
    return next(result.left);
  } else {
    res.json(result.right).status(200);
  }
}

export async function postGang(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const parseUserResult = parseUser(req.user);
  if (E.isLeft(parseUserResult)) {
    return next(parseUserResult.left);
  }
  const {
    data: { sub: userId },
  } = parseUserResult.right;
  const parseGangResult = parseGang({ ...req.body, userId });
  if (E.isLeft(parseGangResult)) {
    return next(parseGangResult.left);
  }
  const { right: gang } = parseGangResult;

  try {
    const newGang = await gangService.createGang({ ...gang });

    res.json(newGang).status(201);
  } catch (e) {
    next(e);
  }
}

export const getGangs = flow(
  parseUser,
  TE.fromEither,
  TE.chainW(({ sub: userId }) => gangService.findGangsByUser(userId))
);

function parseGang(gang: unknown): E.Either<ZodError, GangInbound> {
  const result = gangInboundSchema.safeParse(gang);
  return result.success ? E.right(result.data) : E.left(result.error);
}

function parseUser(possibleUser: unknown): E.Either<ZodError, User> {
  const result = userSchema.safeParse(possibleUser);
  return result.success ? E.right(result.data) : E.left(result.error);
}
