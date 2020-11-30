import { ZodObject } from "zod";
import { ZodRawShape } from "zod/lib/src/types/base";
import * as E from "fp-ts/lib/Either";

export function parseObject<T extends ZodRawShape>(schema: ZodObject<T>) {
  return (obj: unknown) => {
    const result = schema.safeParse(obj);
    return result.success ? E.right(result.data) : E.left(result.error);
  };
}
