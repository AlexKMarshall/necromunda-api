import { Router } from "express";
import user from "./routes/user";
import faction from "./routes/faction";

const routes = () => {
  const app = Router();
  user(app);
  faction(app);

  return app;
};

export default routes;
