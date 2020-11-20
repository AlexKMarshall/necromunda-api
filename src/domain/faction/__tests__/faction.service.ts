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

    expect(savedFaction.name).toEqual(name);
    expect(savedFaction._id.toString()).toEqual(expect.any(String));
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
  test("find all factions returns factions", async () => {
    const names = ["name 1", "name 2"].sort();

    await FactionModel.create({ name: names[0] });
    await FactionModel.create({ name: names[1] });

    const returnedFactions = await factionService.findAllFactions();

    expect(returnedFactions).toHaveLength(2);
    expect(returnedFactions).toContainEqual(
      expect.objectContaining({ name: names[0] })
    );
    expect(returnedFactions).toContainEqual(
      expect.objectContaining({ name: names[1] })
    );
  });
});
