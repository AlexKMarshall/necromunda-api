import { Router, Request, Response } from "express";
import { RequestWithBody } from "../../types/request";
import * as gangService from "./gang.service";
import { GangInboundDTO, gangValidationSchema } from "./gang.type";
import { validateBody } from "../../middleware/bodyValidator.middleware";

const route = Router();

export default (app: Router) => {
  app.use("/gangs", route);

  route.get("/", getAllGangs);
  route.post("/", validateBody(gangValidationSchema), postGang);
};

async function getAllGangs(req: Request, res: Response) {
  const gangs = await gangService.findAllGangs();
  res.json({ gangs }).status(200);
}

async function postGang(req: RequestWithBody<GangInboundDTO>, res: Response) {
  const gangDTO = req.body;

  const newGang = await gangService.createGang(gangDTO);

  res.json(newGang).status(201);
}
