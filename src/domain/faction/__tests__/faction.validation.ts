import { factionValidationSchema } from "../faction.type";
import { validateObject } from "../../../common/middleware/bodyValidator";

describe("faction input validation", () => {
  test("a valid faction returns no error", () => {
    const faction = {
      name: "A name",
    };

    const result = validateObject(factionValidationSchema, faction);
    expect(result.error).toBe(undefined);
    expect(result).toEqual({ value: faction });
  });

  test("faction without a name returns error", () => {
    const faction = {};

    const result = validateObject(factionValidationSchema, faction);

    expect(result.error).toMatchInlineSnapshot(`
      Object {
        "message": "Invalid data: \\"name\\" is required",
      }
    `);
  });
});
