import * as factionController from "../faction.controller";
import * as dbUtils from "../../../test/db-utils";
import * as E from "fp-ts/lib/Either";
import { FactionModel } from "../faction.model";

import { buildFactionInbound } from "../../../test/generate";

beforeAll(dbUtils.connectMongoose);
afterAll(dbUtils.disconnectMongoose);

beforeEach(dbUtils.clearDatabase);

describe("factionController", () => {
  test("postFaction creates a faction and returns 201 code", async () => {
    const faction = buildFactionInbound();

    const trigger = factionController.postFaction(faction);
    const result = await trigger();

    expect(result.code).toBe(201);
    expect(result.body).toEqual(expect.objectContaining(faction));
  });
  test("postFaction without a valid faction returns exception", async () => {
    const empty = {};
    const trigger = factionController.postFaction(empty);
    const result = await trigger();

    expect(result.code).toBe(400);
    expect(result.body).toMatchInlineSnapshot(`
      Object {
        "message": "Error: 1 validation issue(s)

        Issue #0: invalid_type at name
        Required
      ",
      }
    `);
  });
  xtest("postFaction with an existing name returns exception", async () => {
    const existingFaction = buildFactionInbound({ name: "FAKE_FACTION" });
    await FactionModel.create(existingFaction);

    const trigger = factionController.postFaction(existingFaction);
    const result = await trigger();

    expect(result.code).toBe(400);
    expect(result.body).toMatchInlineSnapshot();
  });
  test("getFactions returns some factions", async () => {
    const [factionOne, factionTwo] = [
      buildFactionInbound(),
      buildFactionInbound(),
    ];
    await FactionModel.create([factionOne, factionTwo]);

    const trigger = factionController.getFactions();
    const result = await trigger();

    expect(result.code).toBe(200);
    expect(result.body).toHaveLength(2);
    expect(result.body).toContainEqual(expect.objectContaining(factionOne));
    expect(result.body).toContainEqual(expect.objectContaining(factionTwo));
  });
});
