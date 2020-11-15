import { Request, Response, Router } from "express";
import { RequestWithBody } from "../../common/types/request";
import { factionValidationSchema, FactionInboundDTO } from "./faction.type";
import { validateBody } from "../../common/middleware/bodyValidator";
import * as factionService from "./faction.service";
import { validateJwt } from "../../common/middleware/jwtValidator";

const route = Router();

export default (app: Router) => {
  app.use("/factions", validateJwt, route);

  route.get("/", getFactions);
  route.post("/", validateBody(factionValidationSchema), postFaction);
};

async function getFactions(req: Request, res: Response) {
  const factions = await factionService.findAllFactions();
  res.json({ factions }).status(200);
}

async function postFaction(
  req: RequestWithBody<FactionInboundDTO>,
  res: Response
) {
  const factionDTO = req.body;
  const newFaction = await factionService.createFaction(factionDTO);
  res.json(newFaction).status(201);
}
