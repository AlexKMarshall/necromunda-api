import { ZodType } from "zod/lib/src/types/base";
import * as E from "fp-ts/lib/Either";
import { ValidationError } from "../exceptions/validationError";

export function parseObject<T>(schema: ZodType<T>) {
  return (obj: unknown): E.Either<ValidationError, T> => {
    const result = schema.safeParse(obj);
    return result.success
      ? E.right(result.data)
      : E.left(ValidationError.of(result.error));
  };
}
