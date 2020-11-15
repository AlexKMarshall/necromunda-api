import { gangValidationSchema } from "../gang.type";
import { validateObject } from "../../../common/middleware/bodyValidator";

describe("gang input validation", () => {
  test("a valid gang returns no error", () => {
    const gang = {
      name: "A name",
      faction: "abc123",
    };

    const result = validateObject(gangValidationSchema, gang);
    expect(result.error).toBe(undefined);
    expect(result).toEqual({ value: gang });
  });

  test("gang with missing information returns error", () => {
    const emptyGang = {};
    const noNameGang = { factionId: "abc123" };
    const noFactionGang = { name: "A name" };

    const emptyResult = validateObject(gangValidationSchema, emptyGang);
    const noNameResult = validateObject(gangValidationSchema, noNameGang);
    const noFactionResult = validateObject(gangValidationSchema, noFactionGang);

    expect(emptyResult.error).toMatchInlineSnapshot(`
      Object {
        "message": "Invalid data: \\"name\\" is required",
      }
    `);
    expect(noNameResult.error).toMatchInlineSnapshot(`
      Object {
        "message": "Invalid data: \\"name\\" is required",
      }
    `);
    expect(noFactionResult.error).toMatchInlineSnapshot(`
      Object {
        "message": "Invalid data: \\"faction\\" is required",
      }
    `);
  });
});
