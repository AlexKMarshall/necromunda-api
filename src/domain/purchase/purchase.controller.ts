import { Request, Response, NextFunction } from "express";
import { userSchema } from "../../common/types/user";
import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import * as purchaseService from "./purchase.service";
import { purchaseSchema } from "./purchase.type";
import { sequenceT } from "fp-ts/lib/Apply";
import { pipe } from "fp-ts/lib/function";
import logger from "../../loaders/logger";
import { parseObject } from "../../common/utils/validation";

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
    TE.chainW((args) => purchaseService.executePurchase(...args))
  );

  const result = await trigger();

  if (E.isLeft(result)) {
    logger.error(result.left);
    return next(result.left);
  } else {
    res.status(201).json(result.right);
  }
}

const parseUser = parseObject(userSchema);
const parsePurchase = parseObject(purchaseSchema);
