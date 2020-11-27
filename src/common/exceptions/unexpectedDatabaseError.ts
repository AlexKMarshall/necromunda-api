export class UnexpectedDatabaseError extends Error {
  public _tag: "UnexpectedDatabaseError";

  private constructor(reason: unknown) {
    super(`${reason}`);
    this._tag = "UnexpectedDatabaseError";
  }

  public static of(reason: unknown): UnexpectedDatabaseError {
    return new UnexpectedDatabaseError(reason);
  }
}
