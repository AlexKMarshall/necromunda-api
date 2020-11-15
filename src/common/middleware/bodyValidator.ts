import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { BadRequestException } from "../exceptions/httpException";

export function validateBody(schema: Joi.ObjectSchema<any>) {
  return function (req: Request, res: Response, next: NextFunction) {
    const { error } = validateObject(schema, req.body);
    if (error) {
      throw new BadRequestException(error.message);
    } else {
      next();
    }
  };
}

export function validateObject(schema: Joi.ObjectSchema, object: any) {
  const result = schema.validate(object);
  if (result.error) {
    return {
      error: {
        message: `Invalid data: ${result.error.details
          .map((x) => x.message)
          .join(",")}`,
      },
    };
  } else {
    return result;
  }
}
