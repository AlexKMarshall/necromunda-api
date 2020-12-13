import { NextFunction, Request, Response } from "express";
import logger from "../../loaders/logger";
import { HttpError } from "../types/httpResponse";

function notFoundHandler(req: Request, res: Response, next: NextFunction) {
  const err = HttpError.of(404, "Resource not found");
  next(err);
}

function errorMiddleware(
  error: HttpError,
  req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars
  _next: NextFunction
) {
  const status = error.code || 500;
  const message = JSON.stringify(error) || "something went wrong";
  res.status(status).json({ message });
}

export { errorMiddleware, notFoundHandler };
