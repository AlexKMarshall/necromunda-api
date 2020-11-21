import { Request, Response, NextFunction } from "express";
import * as gangService from "./gang.service";
import { gangInboundSchema } from "./gang.type";
import { userSchema } from "../../common/types/user";

export async function getAllGangsForUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const parseUserResult = parseUser(req.user);
  if (!parseUserResult.success) {
    next(parseUserResult.error);
    return;
  }
  const {
    data: { sub: userId },
  } = parseUserResult;
  const gangs = await gangService.findGangsByUser(userId);
  res.json({ gangs }).status(200);
}

export async function postGang(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const parseUserResult = parseUser(req.user);
  if (!parseUserResult.success) {
    return next(parseUserResult.error);
  }
  const {
    data: { sub: userId },
  } = parseUserResult;
  const parseGangResult = parseGang({ ...req.body, userId });
  if (!parseGangResult.success) {
    return next(parseGangResult.error);
  }
  const { data: gang } = parseGangResult;

  try {
    const newGang = await gangService.createGang({ ...gang });

    res.json(newGang).status(201);
  } catch (e) {
    next(e);
  }
}

function parseGang(possibleGang: unknown) {
  return gangInboundSchema.safeParse(possibleGang);
}

function parseUser(possibleUser: unknown) {
  return userSchema.safeParse(possibleUser);
}
