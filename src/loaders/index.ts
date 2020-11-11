import mongooseLoader from "./mongoose";
import expressLoader from "./express";
import * as config from "../config";
import express from "express";

const loaders = async ({ expressApp }: { expressApp: express.Application }) => {
  await mongooseLoader(config);
  console.log("MongoDB Initialized");
  await expressLoader({ app: expressApp });
  console.log(`Server Initialized`);
};

export default loaders;
