export class BadDataError extends Error {
  public _tag: "BadDataError";

  private constructor(reason: unknown) {
    super(`${reason}`);
    this._tag = "BadDataError";
  }

  public static of(reason: unknown): BadDataError {
    return new BadDataError(reason);
  }
}

export function isBadDataError(e: BadDataError | Error): e is BadDataError {
  return (e as BadDataError)._tag === "BadDataError";
}
