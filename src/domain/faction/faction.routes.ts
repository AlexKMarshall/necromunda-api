import { Router } from "express";
import { factionValidationSchema } from "./faction.type";
import { validateBody } from "../../common/middleware/bodyValidator";
import * as factionController from "./faction.controller";

const route = Router();

export default (app: Router) => {
  app.use("/factions", route);

  route.get("/", factionController.getFactions);
  route.post(
    "/",
    validateBody(factionValidationSchema),
    factionController.postFaction
  );
};
