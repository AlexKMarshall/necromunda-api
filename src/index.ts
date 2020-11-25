import { buildApp } from "./app";
import { startServer } from "./start";

async function start() {
  const server = await buildApp();
  await startServer(server);
}

start();
