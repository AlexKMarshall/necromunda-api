export class ValidationError extends Error {
  public _tag: "ValidationError";

  private constructor(reason: unknown) {
    super(`${reason}`);
    this._tag = "ValidationError";
  }

  public static of(reason: unknown): ValidationError {
    return new ValidationError(reason);
  }
}

export function isValidationError(
  e: ValidationError | Error
): e is ValidationError {
  return (e as ValidationError)._tag === "ValidationError";
}
