import * as gangService from "../gang.service";
import * as dbUtils from "../../../test/db-utils";
import { FactionModel } from "../../faction/faction.model";
import { GangModel } from "../gang.model";

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
    expect(savedGang.faction).toEqual(
      expect.objectContaining({ name: factionName })
    );
  });
  test("findGangsByUser only returns gangs for that userId", async () => {
    const factionName = "test faction";
    const faction = await FactionModel.create({ name: factionName });
    const myGang = await GangModel.create({
      name: "a name",
      userId: "me",
      faction: faction._id,
    });
    await GangModel.create({
      name: "b name",
      userId: "other",
      faction: faction._id,
    });

    const returnedGangs = await gangService.findGangsByUser(myGang.userId);

    expect(returnedGangs).toHaveLength(1);
    expect(returnedGangs).toContainEqual(
      expect.objectContaining({ name: myGang.name })
    );
  });
  test("findGangById returns a single gang", async () => {
    const factionName = "test faction";
    const faction = await FactionModel.create({ name: factionName });
    const myGang = await GangModel.create({
      name: "a name",
      userId: "me",
      faction: faction._id,
    });

    const { _id: gangId } = myGang;

    const returnedGang = await gangService.findGangById(gangId);

    expect(returnedGang).toEqual(
      expect.objectContaining({
        name: myGang.name,
        userId: myGang.userId,
        faction: expect.objectContaining({ name: factionName }),
      })
    );
  });
});
