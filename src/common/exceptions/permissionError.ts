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
