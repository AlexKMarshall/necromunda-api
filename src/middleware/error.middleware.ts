import { NextFunction, Request, Response } from "express";
import { HttpException, NotFoundException } from "../exceptions/httpException";

function notFoundHandler(req: Request, res: Response, next: NextFunction) {
  const err = new NotFoundException();
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
