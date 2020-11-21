import { factionInboundSchema } from "../faction.type";

describe("faction input validation", () => {
  test("a valid faction returns no error", () => {
    const faction = {
      name: "A name",
    };

    const result = factionInboundSchema.safeParse(faction);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(faction);
    }
  });

  test("faction without a name returns error", () => {
    const faction = {};

    const result = factionInboundSchema.safeParse(faction);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toMatchInlineSnapshot(`
        [Error: 1 validation issue(s)

          Issue #0: invalid_type at name
          Required
        ]
      `);
    }
  });
});
