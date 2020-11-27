import supertest from "supertest";
import { buildApp } from "../../app";
import { clearDatabase } from "../../test/db-utils";
import {
  buildFactionInbound,
  insertFactions,
  buildFighterPrototypeInbound,
  buildUser,
} from "../../test/generate";
import { Request, Response, NextFunction } from "express";
import { validateJwt } from "../../common/middleware/jwtValidator";
import { mocked } from "ts-jest/utils";

jest.mock("../../common/middleware/jwtValidator");

const mockValidateJwt = mocked(validateJwt, true);

let request: supertest.SuperTest<supertest.Test>;

beforeAll(async () => {
  const app = await buildApp();
  const user = buildUser();

  mockValidateJwt.mockImplementation(
    (req: Request, res: Response, next: NextFunction) => {
      req.user = user;
      next();
    }
  );

  request = supertest(app);
});

beforeEach(async () => {
  await clearDatabase();
});

test("Create and read fighter prototype through api", async () => {
  const [faction] = await insertFactions([buildFactionInbound()]);
  // const faction = buildFactionInbound();
  const fighterPrototype = buildFighterPrototypeInbound({
    faction: faction._id,
  });

  // need to include credentials
  const postResponse = await request
    .post("/api/fighter-prototypes")
    .send(fighterPrototype);

  expect(postResponse.status).toBe(201);
  expect(postResponse.body.name).toEqual(fighterPrototype.name);

  const getResponse = await request.get("/api/fighter-prototypes");

  expect(getResponse.status).toBe(200);
  expect(getResponse.body).toContainEqual(
    expect.objectContaining({ name: fighterPrototype.name })
  );
  expect(getResponse.body).toHaveLength(1);
});
