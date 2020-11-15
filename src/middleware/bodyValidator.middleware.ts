import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { BadRequestException } from "../common/exceptions/httpException";

export function validateBody(schema: Joi.ObjectSchema<any>) {
  return function (req: Request, res: Response, next: NextFunction) {
    const { error } = schema.validate(req.body);
    if (error) {
      next(
        new BadRequestException(
          `Invalid data: ${error.details.map((x) => x.message).join(",")}`
        )
      );
    } else {
      next();
    }
  };
}
