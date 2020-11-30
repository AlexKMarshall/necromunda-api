import { Request, Response, NextFunction } from "express";
import * as gangService from "./gang.service";
import { gangInboundSchema } from "./gang.type";
import { userSchema } from "../../common/types/user";
import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import { flow, pipe } from "fp-ts/lib/function";
import logger from "../../loaders/logger";
import { parseObject } from "../../common/utils/validation";

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

function getGangById(id: string) {
  return gangService.findGangByID(id);
}

export function postGang<T extends {}>(user: unknown, partialGang: T) {
  return pipe(
    user,
    parseUser,
    E.chain(({ sub: userId }) => parseGangInbound({ ...partialGang, userId })),
    TE.fromEither,
    TE.chainW(gangService.createGang)
  );
}
const parseGangInbound = parseObject(gangInboundSchema);
const parseUser = parseObject(userSchema);

export const getGangs = flow(
  parseUser,
  TE.fromEither,
  TE.chainW(({ sub: userId }) => gangService.findGangsByUser(userId))
);
