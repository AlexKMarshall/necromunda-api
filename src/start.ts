import { Server } from "http";
import { Express } from "express";
import logger from "./loaders/logger";

export async function startServer(
  app: Express,
  { port = process.env.PORT } = {}
): Promise<Server> {
  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      logger.info(`Listening on http://localhost:${port}`);
      resolve(server);
    });
  });
}

export function stopServer(server: Server): Promise<string> {
  return new Promise((resolve, reject) => {
    server.close((err) => reject(err));
    resolve("Server closed");
  });
}
