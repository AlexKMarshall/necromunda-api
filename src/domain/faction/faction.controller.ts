import { NextFunction, Request, Response } from "express";
import { factionInboundSchema } from "./faction.type";
import * as factionService from "./faction.service";

export async function getFactions(res: Response) {
  const factions = await factionService.findAllFactions();
  res.json({ factions }).status(200);
}

export async function postFaction(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const parsedResult = parseFaction(req.body);
  if (!parsedResult.success) {
    next(parsedResult.error);
  } else {
    const { data: faction } = parsedResult;

    try {
      const newFaction = await factionService.createFaction(faction);
      res.json(newFaction).status(201);
    } catch (error) {
      next(error);
    }
  }
}

function parseFaction(possibleFaction: unknown) {
  return factionInboundSchema.safeParse(possibleFaction);
}
