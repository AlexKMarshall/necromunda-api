import { Router } from "express";
import * as gangController from "./gang.controller";

const route = Router();

export default (app: Router) => {
  app.use("/gangs", route);

  route.get("/", gangController.handleGetGangs);
  route.post("/", gangController.postGang);
};
