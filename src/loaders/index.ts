import express from "express";
import mongooseLoader from "./mongoose";
import expressLoader from "./express";
import logger from "./logger";
import * as config from "../config";

const loaders = async ({ expressApp }: { expressApp: express.Application }) => {
  await mongooseLoader(config);
  logger.info("MongoDB loaded and connected");
  await expressLoader({ app: expressApp });
  logger.info(`Server loaded`);
};

export default loaders;
