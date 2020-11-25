import supertest from "supertest";
import { buildApp } from "../../app";
import { clearDatabase } from "../../test/db-utils";
import { buildFactionInbound } from "../../test/generate";

let request: supertest.SuperTest<supertest.Test>;

beforeAll(async () => {
  const app = await buildApp();

  request = supertest(app);
});

beforeEach(async () => {
  await clearDatabase();
});

test("Create and read faction through api", async () => {
  const faction = buildFactionInbound();

  const postResponse = await request.post("/api/factions").send(faction);

  expect(postResponse.status).toBe(201);
  expect(postResponse.body).toEqual(expect.objectContaining(faction));

  const getResponse = await request.get("/api/factions");

  expect(getResponse.status).toBe(200);
  expect(getResponse.body).toContainEqual(expect.objectContaining(faction));
  expect(getResponse.body).toHaveLength(1);
});
