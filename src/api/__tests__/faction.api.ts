import supertest from "supertest";
import { buildApp } from "../../app";
import { clearDatabase } from "../../test/db-utils";
import { buildFactionInbound, buildUser } from "../../test/generate";
import { validateJwt } from "../../common/middleware/jwtValidator";
import { mocked } from "ts-jest/utils";
import { Request, Response, NextFunction } from "express";

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
