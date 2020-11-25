import { Router } from "express";
import user from "./routes/user";
import faction from "../domain/faction/faction.routes";
import gang from "../domain/gang/gang.routes";
import { validateJwt } from "../common/middleware/jwtValidator";

const routes = () => {
  const app = Router();
  // app.use(validateJwt);
  user(app);
  faction(app);
  gang(app);

  return app;
};

export default routes;
