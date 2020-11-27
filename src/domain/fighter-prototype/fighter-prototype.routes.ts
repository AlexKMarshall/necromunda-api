import { Router } from "express";
import * as fighterPrototypeController from "./fighter-prototype.controller";

const route = Router();

export default (app: Router) => {
  app.use("/fighter-prototypes", route);

  route.get("/", fighterPrototypeController.handleGetFighterPrototypes);
  route.post("/", fighterPrototypeController.handlePostFighterPrototype);
};
