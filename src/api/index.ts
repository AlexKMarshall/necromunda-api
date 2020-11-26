import { Router } from "express";
import user from "./routes/user";
import faction from "../domain/faction/faction.routes";
import gang from "../domain/gang/gang.routes";
import { validateJwt } from "../common/middleware/jwtValidator";
import { Request, Response } from "express";

const routes = () => {
  const app = Router();
  app.use(validateJwt);
  app.get("/hello", (req: Request, res: Response) => {
    res.status(200);
    res.json(req.user);
  });
  user(app);
  faction(app);
  gang(app);

  return app;
};

export default routes;
