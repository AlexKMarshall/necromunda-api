export class PermissionError extends Error {
  public _tag: "PermissionError";

  private constructor(reason: unknown) {
    super(`${reason}`);
    this._tag = "PermissionError";
  }

  public static of(reason: unknown): PermissionError {
    return new PermissionError(reason);
  }
}

export function isPermissionError(
  e: PermissionError | Error
): e is PermissionError {
  return (e as PermissionError)._tag === "PermissionError";
}
