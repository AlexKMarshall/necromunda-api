import { Request, Response, NextFunction } from "express";
import * as gangService from "./gang.service";
import { GangInbound, gangInboundSchema } from "./gang.type";
import { User, userSchema } from "../../common/types/user";
import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import { ZodError } from "zod";
import { flow, pipe } from "fp-ts/lib/function";
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
    res.status(200).json(result.right);
  }
}

export async function handleGetGangById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { gangId } = req.params;
  const trigger = getGangById(gangId);
  const result = await trigger();

  if (E.isLeft(result)) {
    logger.error(result.left);
    return next(result.left);
  } else {
    res.status(200).json(result.right);
  }
}

export async function handlePostGang(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const trigger = postGang(req.user, req.body);
  const result = await trigger();

  if (E.isLeft(result)) {
    logger.error(result.left);
    return next(result.left);
  } else {
    res.status(201).json(result.right);
  }
}
export const getGangs = flow(
  parseUser,
  TE.fromEither,
  TE.chainW(({ sub: userId }) => gangService.findGangsByUser(userId))
);

function getGangById(id: string) {
  return gangService.findGangByID(id);
}

export function postGang<T extends {}>(user: unknown, partialGang: T) {
  return pipe(
    user,
    parseUser,
    E.chain(({ sub: userId }) => parseGang({ ...partialGang, userId })),
    TE.fromEither,
    TE.chainW(gangService.createGang)
  );
}

function parseGang(gang: unknown): E.Either<ZodError, GangInbound> {
  const result = gangInboundSchema.safeParse(gang);
  return result.success ? E.right(result.data) : E.left(result.error);
}

function parseUser(possibleUser: unknown): E.Either<ZodError, User> {
  const result = userSchema.safeParse(possibleUser);
  return result.success ? E.right(result.data) : E.left(result.error);
}
