import { Router } from "express";
import * as purchaseController from "./purchase.controller";

const route = Router();

export default (app: Router) => {
  app.use("/purchase", route);
  route.post("/", purchaseController.handlePostPurchase);
};
