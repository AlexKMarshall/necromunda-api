import { Router } from "express";
import user from "./routes/user";
import faction from "./routes/faction";
import gang from "./routes/gang";

const routes = () => {
  const app = Router();
  user(app);
  faction(app);
  gang(app);

  return app;
};

export default routes;
