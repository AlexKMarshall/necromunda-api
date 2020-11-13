import { Router } from "express";
import { Faction } from "../../models/faction";

const route = Router();

export default (app: Router) => {
  app.use("/factions", route);

  route.get("/", async (req, res) => {
    const factions = await Faction.find();
    res.json({ factions }).status(200);
  });

  route.post("/", async (req, res) => {
    const factionDTO = req.body;
    if (!factionDTO.name) {
      res.json({ message: "Faction data missing" }).status(400);
    } else {
      const newFaction = new Faction(factionDTO);
      await newFaction.save();
      res.json(newFaction).status(201);
    }
  });
};
