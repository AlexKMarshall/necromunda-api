import { Router, Request, Response } from "express";

const route = Router();

export default (app: Router) => {
  app.use("/users", route);

  route.get("/me", (req: Request, res: Response) => {
    res.json({ user: "The user" }).status(200);
  });
};
