import { Request, Response, NextFunction } from "express";
import { userSchema } from "../../common/types/user";
import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import * as T from "fp-ts/lib/Task";
import * as purchaseService from "./purchase.service";
import { purchaseSchema } from "./purchase.type";
import { sequenceT } from "fp-ts/lib/Apply";
import { pipe } from "fp-ts/lib/function";
import { parseObject } from "../../common/utils/validation";
import {
  HttpCreated,
  HttpError,
  HttpResponse,
} from "../../common/types/httpResponse";

import { isValidationError } from "../../common/exceptions/validationError";
import { isBadDataError } from "../../common/exceptions/badDataError";
import { isPermissionError } from "../../common/exceptions/permissionError";

export async function handlePostPurchase(req: Request, res: Response) {
  const userId = pipe(
    parseUser(req.user),
    E.map(({ sub }) => sub)
  );
  const purchase = pipe(parsePurchase(req.body));

  const trigger = pipe(
    sequenceT(E.either)(userId, purchase),
    TE.fromEither,
    TE.chainW((args) => purchaseService.executePurchase(...args)),
    TE.fold(
      (left) => T.of(toHttpError(left)),
      (right) => T.of(HttpCreated.of(right))
    )
  );

  const result = await trigger();

  res.status(result.code);
  res.json(result.body);
}

const parseUser = parseObject(userSchema);
const parsePurchase = parseObject(purchaseSchema);

function toHttpError<E extends Error>(e: E): HttpResponse {
  if (isValidationError(e)) return HttpError.of(400, e.message);
  if (isBadDataError(e)) return HttpError.of(400, e.message);
  if (isPermissionError(e)) return HttpError.of(403, e.message);
  return HttpError.of(500, e.message);
}
