import express from "express";
import mongooseLoader from "./mongoose";
import expressLoader from "./express";
import logger from "./logger";

const loaders = async ({ expressApp }: { expressApp: express.Application }) => {
  await mongooseLoader();
  logger.info("MongoDB loaded and connected");
  await expressLoader({ app: expressApp });
  logger.info(`Server loaded`);
};

export default loaders;
