import { Router } from "express";
import * as factionController from "./faction.controller";

const route = Router();

export default (app: Router) => {
  app.use("/factions", route);

  route.get("/", factionController.handleGetFactions);
  route.post("/", factionController.handlePostFaction);
};
