import { Router } from "express";
import user from "./routes/user";
import faction from "../domain/faction/faction.routes";
import gang from "../domain/gang/gang.routes";
import fighterPrototype from "../domain/fighter-prototype/fighter-prototype.routes";
import purchase from "../domain/purchase/purchase.routes";
import { validateJwt } from "../common/middleware/jwtValidator";

const routes = () => {
  const app = Router();
  app.use(validateJwt);
  user(app);
  faction(app);
  gang(app);
  fighterPrototype(app);
  purchase(app);

  return app;
};

export default routes;
