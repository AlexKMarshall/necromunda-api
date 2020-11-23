import * as factionController from "../faction.controller";
import * as dbUtils from "../../../test/db-utils";
import * as E from "fp-ts/lib/Either";
import { FactionModel } from "../faction.model";

beforeAll(dbUtils.connectMongoose);
afterAll(dbUtils.disconnectMongoose);

beforeEach(dbUtils.clearDatabase);

describe("factionController", () => {
  test("postFaction creates a faction", async () => {
    const name: string = "My Faction";

    const trigger = factionController.postFaction({ name });

    const result = await trigger();

    expect(E.isRight(result)).toBe(true);

    if (E.isRight(result)) {
      expect(result.right).toEqual(expect.objectContaining({ name }));
    }
  });
  test("postFaction without a valid faction returns exception", async () => {
    const trigger = factionController.postFaction({});

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
  test("getFactions returns some factions", async () => {
    const factionOne = { name: "faction1" };
    const factionTwo = { name: "faction2" };
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
