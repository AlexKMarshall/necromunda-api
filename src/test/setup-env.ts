import { databaseUrl } from "../config";

const testDBUrl = `${databaseUrl}-${process.env.JEST_WORKER_ID}`;

process.env.DATABASE_URI = testDBUrl;
