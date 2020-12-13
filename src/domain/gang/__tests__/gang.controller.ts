import * as gangController from "../gang.controller";
import * as dbUtils from "../../../test/db-utils";
import { GangModel } from "../gang.model";
import faker from "faker";
import {
  buildFactionInbound,
  buildGangInbound,
  insertFactions,
} from "../../../test/generate";
import { User } from "../../../common/types/user";
import { removeProp } from "../../../common/utils";

function buildUser(overrides?: Partial<User>): User {
  return {
    sub: faker.internet.userName(),
    ...overrides,
  };
}

beforeAll(dbUtils.connectMongoose);
afterAll(dbUtils.disconnectMongoose);

beforeEach(dbUtils.clearDatabase);

describe("gangController", () => {
  test("postGang creates a gang and returns 201 code", async () => {
    const [faction] = await insertFactions([buildFactionInbound()]);
    const gang = buildGangInbound({ faction: faction._id.toString() });
    const gangWithoutUser = removeProp("userId", gang);
    const user = buildUser();

    const trigger = gangController.postGang(user, gangWithoutUser);
    const result = await trigger();

    expect(result.code).toBe(201);
    expect(result.body).toEqual(expect.objectContaining({ name: gang.name }));
  });
  test("getGangs returns gangs for that userId", async () => {
    const [faction] = await insertFactions([buildFactionInbound()]);

    const [myUser, otherUser] = [buildUser(), buildUser()];
    const [myGang, otherGang] = [
      buildGangInbound({ userId: myUser.sub, faction: faction._id }) as any,
      buildGangInbound({ userId: otherUser.sub, faction: faction._id }) as any,
    ];
    await GangModel.create([myGang, otherGang]);

    const trigger = gangController.getGangs(myUser);
    const result = await trigger();

    expect(result.code).toBe(200);
    expect(result.body).toHaveLength(1);
    expect(result.body[0]).toEqual(
      expect.objectContaining({ name: myGang.name })
    );
  });
  test("getGangs returns error if no user provided", async () => {
    const undefinedUser = undefined;

    const trigger = gangController.getGangs(undefinedUser);
    const result = await trigger();

    expect(result.code).toBe(400);
    expect(result.body).toMatchInlineSnapshot(`
      Object {
        "message": "Error: 1 validation issue(s)

        Issue #0: invalid_type at 
        Required
      ",
      }
    `);
  });
});
