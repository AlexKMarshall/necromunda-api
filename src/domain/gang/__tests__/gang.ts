import { gangInboundSchema } from "../gang.type";
import faker from "faker";

describe("gang basic input validation", () => {
  test("a valid gang returns no error", () => {
    const gang = {
      name: "A name",
      faction: faker.random.uuid(),
      userId: "abc123",
    };

    const result = gangInboundSchema.safeParse(gang);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(gang);
    } else {
      throw result.error;
    }
  });

  test("gang with empty data returns error", () => {
    const invalidGang = {};

    const result = gangInboundSchema.safeParse(invalidGang);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toMatchInlineSnapshot(`
        [Error: 3 validation issue(s)

          Issue #0: invalid_type at name
          Required

          Issue #1: invalid_type at userId
          Required

          Issue #2: invalid_type at faction
          Required
        ]
      `);
    }
  });
  test("Gang with no name returns error", () => {
    const noNameGang = {
      faction: faker.random.uuid(),
      userId: faker.random.uuid(),
    };

    const result = gangInboundSchema.safeParse(noNameGang);
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
  test("Gang with no faction returns error", () => {
    const invalidGang = {
      name: faker.lorem.words(3),
      userId: faker.random.uuid(),
    };

    const result = gangInboundSchema.safeParse(invalidGang);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toMatchInlineSnapshot(`
        [Error: 1 validation issue(s)

          Issue #0: invalid_type at faction
          Required
        ]
      `);
    }
  });
  test("Gang with no userId returns error", () => {
    const invalidGang = {
      name: faker.lorem.words(3),
      faction: faker.random.uuid(),
    };

    const result = gangInboundSchema.safeParse(invalidGang);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toMatchInlineSnapshot(`
        [Error: 1 validation issue(s)

          Issue #0: invalid_type at userId
          Required
        ]
      `);
    }
  });
});
