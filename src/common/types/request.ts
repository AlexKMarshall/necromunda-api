import { Request } from "express";

export type RequestWithBody<T> = Request<{}, {}, T>;

export interface AuthenticatedRequest<body> extends Request<{}, {}, body> {
  user: any;
}
