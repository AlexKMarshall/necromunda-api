import { Router } from "express";
import { Gang } from "../../models/gang";

const route = Router();

export default (app: Router) => {
  app.use("/gangs", route);

  route.get("/", async (req, res) => {
    const gangs = await Gang.find();
    res.json({ gangs }).status(200);
  });

  route.post("/", async (req, res) => {
    const gangDTO = req.body;

    const newGang = new Gang(gangDTO);
    await newGang.save();
    res.json(newGang).status(201);
  });
};
