import { NextFunction, Request, Response } from "express";
import { HttpException, notFoundException } from "../exceptions/httpException";

function notFoundHandler(req: Request, res: Response, next: NextFunction) {
  const err = notFoundException();
  next(err);
}

function errorMiddleware(
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = error.status || 500;
  const message = error.message || "something went wrong";

  res.status(status).json({ status, message });
}

export { errorMiddleware, notFoundHandler };
