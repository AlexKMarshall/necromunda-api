import express from "express";
import cors from "cors";
import * as config from "../config";
import routes from "../api";

const loader = async ({ app }: { app: express.Application }) => {
  app.use(cors());

  app.use(express.json());

  app.use(config.api.prefix, routes());

  return app;
};

export default loader;
