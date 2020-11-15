import { Request, Response, Router } from "express";
import { RequestWithBody } from "../../types/request";
import { FactionModel } from "./faction.model";
import { factionValidationSchema, FactionInboundDTO } from "./faction.type";
import { validateBody } from "../../middleware/bodyValidator.middleware";

const route = Router();

export default (app: Router) => {
  app.use("/factions", route);

  route.get("/", getFactions);
  route.post("/", validateBody(factionValidationSchema), postFaction);
};

async function getFactions(req: Request, res: Response) {
  const factions = await FactionModel.find();
  res.json({ factions }).status(200);
}

async function postFaction(
  req: RequestWithBody<FactionInboundDTO>,
  res: Response
) {
  const factionDTO = req.body;
  const newFaction = new FactionModel(factionDTO);
  await newFaction.save();
  res.json(newFaction).status(201);
}
