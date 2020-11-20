import * as gangService from "../gang.service";
import * as dbUtils from "../../../test/db-utils";
import { FactionModel } from "../../faction/faction.model";

beforeAll(dbUtils.connectMongoose);
afterAll(dbUtils.disconnectMongoose);

beforeEach(dbUtils.clearDatabase);

describe("gangService", () => {
  test("createGang returns new faction", async () => {
    const factionName = "test faction";
    const faction = new FactionModel({ name: factionName });
    await faction.save();
    const gangName = "My Gang";
    const userId = "abc";

    const savedGang = await gangService.createGang({
      name: gangName,
      faction: faction._id,
      userId,
    });

    expect(savedGang.name).toBe(gangName);
    expect(savedGang.userId).toEqual(userId);
    expect(savedGang._id.toString()).toEqual(expect.any(String));
    expect(savedGang.faction.name).toEqual(factionName);
  });
});
