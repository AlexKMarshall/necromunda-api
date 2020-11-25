import { databaseUrl } from "../config";

const workerId = process.env.JEST_WORKER_ID;
const port = `800${workerId}`;
process.env.PORT = port;
process.env.DATABASE_URI = `${databaseUrl}-${workerId}`;
