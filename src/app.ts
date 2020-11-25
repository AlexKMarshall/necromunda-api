import express from "express";
import loaders from "./loaders";

export async function buildApp() {
  const app = express();

  await loaders({ expressApp: app });

  return app;
}
