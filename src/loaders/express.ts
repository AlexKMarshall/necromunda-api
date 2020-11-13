import express from "express";
import cors from "cors";
import * as config from "../config";
import routes from "../api";
import {
  notFoundHandler,
  errorMiddleware,
} from "../middleware/error.middleware";

const loader = async ({ app }: { app: express.Application }) => {
  app.use(cors());

  app.use(express.json());

  app.use(config.api.prefix, routes());

  app.use(notFoundHandler, errorMiddleware);

  return app;
};

export default loader;
