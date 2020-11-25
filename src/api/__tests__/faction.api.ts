import supertest from "supertest";
import { buildApp } from "../../app";
import { clearDatabase } from "../../test/db-utils";

let request: supertest.SuperTest<supertest.Test>;

beforeAll(async () => {
  const app = await buildApp();

  request = supertest(app);
});

beforeEach(async () => {
  await clearDatabase();
});

test("it should make a request of the endpoint", async () => {
  const response = await request.get("/api/factions");

  expect(response.status).toBe(200);
});
