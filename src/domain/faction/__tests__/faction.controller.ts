import * as factionController from "../faction.controller";
import * as dbUtils from "../../../test/db-utils";
import * as E from "fp-ts/lib/Either";
import { FactionModel } from "../faction.model";
import { FactionInbound } from "../faction.type";
import faker from "faker";

function buildFactionInbound(
  overrides?: Partial<FactionInbound>
): FactionInbound {
  return {
    name: faker.company.companyName(),
    ...overrides,
  };
}

beforeAll(dbUtils.connectMongoose);
afterAll(dbUtils.disconnectMongoose);

beforeEach(dbUtils.clearDatabase);

describe("factionController", () => {
  test("postFaction creates a faction", async () => {
    const faction = buildFactionInbound();

    const trigger = factionController.postFaction(faction);
    const result = await trigger();

    expect(E.isRight(result)).toBe(true);

    if (E.isRight(result)) {
      expect(result.right).toEqual(expect.objectContaining(faction));
    }
  });
  test("postFaction without a valid faction returns exception", async () => {
    const empty = {};
    const trigger = factionController.postFaction(empty);
    const result = await trigger();

    expect(E.isLeft(result)).toBe(true);

    if (E.isLeft(result)) {
      expect(result.left).toMatchInlineSnapshot(`
        [Error: 1 validation issue(s)

          Issue #0: invalid_type at name
          Required
        ]
      `);
    }
  });
  xtest("postFaction with an existing name returns exception", async () => {
    const existingFaction = buildFactionInbound({ name: "FAKE_FACTION" });
    await FactionModel.create(existingFaction);

    const trigger = factionController.postFaction(existingFaction);
    const result = await trigger();

    console.log(result);

    expect(E.isLeft(result)).toBe(true);

    if (E.isLeft(result)) {
      expect(result.left).toMatchInlineSnapshot(`
        [Error: 1 validation issue(s)

          Issue #0: invalid_type at name
          Required
        ]
      `);
    }
  });
  test("getFactions returns some factions", async () => {
    const [factionOne, factionTwo] = [
      buildFactionInbound(),
      buildFactionInbound(),
    ];
    await FactionModel.create([factionOne, factionTwo]);

    const trigger = factionController.getFactions();
    const result = await trigger();

    expect(E.isRight(result)).toBe(true);

    if (E.isRight(result)) {
      const returnedFactions = result.right;
      expect(returnedFactions).toHaveLength(2);
      expect(returnedFactions).toContainEqual(
        expect.objectContaining(factionOne)
      );
      expect(returnedFactions).toContainEqual(
        expect.objectContaining(factionTwo)
      );
    }
  });
});
