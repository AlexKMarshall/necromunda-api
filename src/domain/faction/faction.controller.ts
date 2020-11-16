import { Request, Response } from "express";
import { RequestWithBody } from "../../common/types/request";
import { FactionInboundDTO } from "./faction.type";
import * as factionService from "./faction.service";

export async function getFactions(req: Request, res: Response) {
  const factions = await factionService.findAllFactions();
  res.json({ factions }).status(200);
}

export async function postFaction(
  req: RequestWithBody<FactionInboundDTO>,
  res: Response
) {
  const factionDTO = req.body;
  const newFaction = await factionService.createFaction(factionDTO);
  res.json(newFaction).status(201);
}
