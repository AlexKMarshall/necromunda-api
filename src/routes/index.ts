import express from "express";
const router = express.Router();

router.use("/", (req, res) => {
  res.json({ message: "hello from router" });
});

export { router };
