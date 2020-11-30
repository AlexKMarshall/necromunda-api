export class HttpError {
  public _tag: "HttpError";
  public code: number;
  public body: { message: string };

  private constructor(code: number, message: string) {
    this._tag = "HttpError";
    this.code = code;
    this.body = { message };
  }

  public static of(code: number, message: string = "Something went wrong") {
    return new HttpError(code, message);
  }
}

export class HttpOk {
  public _tag = "HttpOk" as const;
  public code = 200 as const;
  public body: any | undefined;

  private constructor(body?: any) {
    this.body = body;
  }

  public static of(body?: any) {
    return new HttpOk(body);
  }
}

export class HttpCreated {
  public _tag = "HttpCreated" as const;
  public code = 201 as const;
  public body: any | undefined;

  private constructor(body?: any) {
    this.body = body;
  }

  public static of(body?: any) {
    return new HttpCreated(body);
  }
}

export type HttpResponse = HttpOk | HttpError | HttpCreated;
