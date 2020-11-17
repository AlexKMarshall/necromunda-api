import { Router, Express, Response, NextFunction } from "express";
import { RequestWithBody } from "../../common/types/request";
import * as gangService from "./gang.service";
import { GangInboundDTO, gangValidationSchema } from "./gang.type";
import { validateBody } from "../../common/middleware/bodyValidator";
import { UnauthorizedException } from "../../common/exceptions/httpException";

const route = Router();

export default (app: Router) => {
  app.use("/gangs", route);

  route.get("/", getAllGangsForUser);
  route.post("/", validateBody(gangValidationSchema), postGang);
};

async function getAllGangsForUser(
  req: Express.Request,
  res: Response,
  next: NextFunction
) {
  const userId = req.user?.sub;
  if (!userId) {
    // Shouldn't hit this as auth0 should always give us a userID
    next(new UnauthorizedException("User ID missing"));
    return;
  }
  const gangs = await gangService.findGangsByUser(userId);
  res.json({ gangs }).status(200);
}

async function postGang(req: RequestWithBody<GangInboundDTO>, res: Response) {
  const gangDTO = req.body;

  const newGang = await gangService.createGang(gangDTO);

  res.json(newGang).status(201);
}
