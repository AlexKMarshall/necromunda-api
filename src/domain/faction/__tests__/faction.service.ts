import { mocked } from "ts-jest/utils";
import { FactionModel } from "../faction.model";
import * as factionService from "../faction.service";

jest.mock("../faction.model");

const MockFactionModel = mocked(FactionModel, true);

beforeEach(() => {
  jest.resetAllMocks();
});

describe("factionService", () => {
  test("createFaction returns new faction", async () => {
    const faction: any = { name: "My Faction", _id: "abc123" };

    MockFactionModel.findOne.mockResolvedValueOnce(null);

    await factionService.createFaction(faction);

    expect(MockFactionModel.findOne).toHaveBeenCalledTimes(1);
    expect(MockFactionModel.findOne).toHaveBeenCalledWith({
      name: faction.name,
    });
    expect(MockFactionModel).toHaveBeenCalledTimes(1);
    const mockFactionInstance = MockFactionModel.mock.instances[0];
    expect(mockFactionInstance.save).toHaveBeenCalledTimes(1);

    // TODO, how to test that the thing was returned?
  });
  test("createFaction throws error if faction name already exists", async () => {
    const faction: any = { name: "FAKE_FACTION_NAME" };
    MockFactionModel.findOne.mockResolvedValueOnce(faction);

    const error = await factionService.createFaction(faction).catch((e) => e);
    expect(error).toMatchInlineSnapshot(
      `[Error: Name "FAKE_FACTION_NAME" already exists]`
    );
    expect(MockFactionModel.findOne).toHaveBeenCalledTimes(1);
    expect(MockFactionModel.findOne).toHaveBeenCalledWith({
      name: faction.name,
    });
  });
});
