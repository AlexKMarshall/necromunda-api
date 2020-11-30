import { Request, Response, NextFunction } from "express";
import { User, userSchema } from "../../common/types/user";
import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import * as purchaseService from "./purchase.service";
import { ZodError } from "zod";
import { Purchase, purchaseSchema } from "./purchase.type";
import { sequenceT } from "fp-ts/lib/Apply";
import { pipe } from "fp-ts/lib/function";
import logger from "../../loaders/logger";

export async function handlePostPurchase(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = pipe(
    parseUser(req.user),
    E.map(({ sub }) => sub)
  );
  const purchase = pipe(parsePurchase(req.body));

  const trigger = pipe(
    sequenceT(E.either)(userId, purchase),
    TE.fromEither,
    TE.map((args) => purchaseService.executePurchase(...args))
  );

  const result = await trigger();

  if (E.isLeft(result)) {
    logger.error(result.left);
    return next(result.left);
  } else {
    res.status(201).json(result.right);
  }
}

export async function handlePostPurchase2(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = pipe(
    parseUser(req.user),
    E.map(({ sub }) => sub)
  );
  const purchase = pipe(parsePurchase(req.body));

  const trigger = pipe(
    sequenceT(E.either)(userId, purchase),
    TE.fromEither,
    TE.chainW((args) => purchaseService.tempPurchase(...args))
  );

  const result = await trigger();
  console.log("result is");
  console.log(result);
  if (result._tag === "Right") {
    console.log(result.right);
  }

  if (E.isLeft(result)) {
    logger.error(result.left);
    return next(result.left);
  } else {
    res.status(201).json(result.right);
  }
}

function parseUser(possibleUser: unknown): E.Either<ZodError, User> {
  const result = userSchema.safeParse(possibleUser);
  return result.success ? E.right(result.data) : E.left(result.error);
}

function parsePurchase(purchase: unknown): E.Either<ZodError, Purchase> {
  const result = purchaseSchema.safeParse(purchase);
  return result.success ? E.right(result.data) : E.left(result.error);
}
