import { pipe } from "fp-ts/lib/function";
import * as E from "fp-ts/lib/Either";
import * as A from "fp-ts/lib/Array";
import * as TE from "fp-ts/TaskEither";
import { User } from "../../common/types/user";
import { Purchase } from "./purchase.type";
import * as gangService from "../gang/gang.service";
import * as fighterPrototypeService from "../fighter-prototype/fighter-prototype.service";
import { Gang } from "../gang/gang.type";
import { PermissionError } from "../../common/exceptions/permissionError";
import { BadDataError } from "../../common/exceptions/badDataError";
import { FighterPrototype } from "../fighter-prototype/fighter-prototype.type";
import { Fighter } from "../fighter/fighter.type";
import { UnexpectedDatabaseError } from "src/common/exceptions/unexpectedDatabaseError";

export function executePurchase(userId: User["sub"], purchase: Purchase) {
  return pipe(
    purchase.gangId,
    gangService.findGangByID,
    TE.chainEitherKW(userOwnsGang(userId)),
    TE.chainW((gang) =>
      A.array.sequence(TE.taskEither)(
        purchase.fighters.map(mapAFighter(gang.faction._id))
      )
    ),
    TE.chainW((fighters) => gangService.addFighters(purchase.gangId, fighters))
  );
}

function mapAFighter(factionId: string) {
  return (
    f: Purchase["fighters"][number]
  ): TE.TaskEither<UnexpectedDatabaseError | BadDataError, Fighter> =>
    pipe(
      f.protoId,
      fighterPrototypeService.findByID,
      TE.chainEitherKW(factionOwnsPrototype(factionId)),
      TE.map((proto) => makeFighter(proto, f.name))
    );
}

function makeFighter(proto: FighterPrototype, name: string): Fighter {
  return {
    name,
    proto: proto.name,
    fighterClass: proto.fighterClass,
    protoId: proto._id,
  };
}

function factionOwnsPrototype(factionId: string) {
  return (prototype: FighterPrototype) =>
    prototype.faction._id === factionId
      ? E.right(prototype)
      : E.left(
          BadDataError.of(
            `FactionId ${factionId} can't use this fighter prototype`
          )
        );
}

function userOwnsGang(userId: string) {
  return (gang: Gang) =>
    gang.userId === userId
      ? E.right(gang)
      : E.left(PermissionError.of(`UserId ${userId} does not own this gang`));
}
