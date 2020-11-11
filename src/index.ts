import express from "express";
import loaders from "./loaders";
import logger from "./loaders/logger";
import { port } from "./config";

const app = express();

const startServer = async () => {
  const app = express();

  await loaders({ expressApp: app });

  app.listen(port, () => {
    logger.info(`server listening on http://localhost:${port} 🚀`);
  });
};

startServer();
