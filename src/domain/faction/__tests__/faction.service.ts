import * as factionService from "../faction.service";
import * as dbUtils from "../../../test/db-utils";
import { FactionModel } from "../faction.model";

beforeAll(dbUtils.connectMongoose);
afterAll(dbUtils.disconnectMongoose);

beforeEach(dbUtils.clearDatabase);

describe("factionService", () => {
  test("createFaction returns new faction", async () => {
    const name: string = "My Faction";

    const savedFaction = await factionService.createFaction({ name });

    expect(savedFaction.toJSON()).toMatchObject({
      name,
      _id: expect.any(String),
    });
  });
  test("createFaction throws error if faction name already exists", async () => {
    const existingName = "FAKE_FACTION";
    const existingFaction = new FactionModel({ name: existingName });
    await existingFaction.save();

    const error = await factionService
      .createFaction({ name: existingName })
      .catch((e) => e);
    expect(error).toMatchInlineSnapshot(
      `[Error: Name "FAKE_FACTION" already exists]`
    );
  });
});
