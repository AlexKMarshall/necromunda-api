import faker from "faker";
import { FactionInbound } from "../../domain/faction/faction.type";
import { GangInbound } from "../../domain/gang/gang.type";
import {
  FighterPrototype,
  FighterPrototypeInbound,
} from "../../domain/fighter-prototype/fighter-prototype.type";
import { FactionModel } from "../../domain/faction/faction.model";
import { User } from "../../common/types/user";

export function buildFactionInbound(
  overrides?: Partial<FactionInbound>
): FactionInbound {
  return {
    name: faker.company.companyName(),
    ...overrides,
  };
}

export function insertFactions(factions: FactionInbound[]) {
  return FactionModel.create(factions);
}

export function buildGangInbound(
  overrides?: Partial<GangInbound>
): GangInbound {
  return {
    name: faker.company.companyName(),
    userId: faker.internet.userName(),
    faction: faker.random.uuid(),
    ...overrides,
  };
}

export function buildFighterPrototypeInbound(
  overrides?: Partial<FighterPrototypeInbound>
): FighterPrototypeInbound {
  return {
    name: faker.commerce.productName(),
    faction: faker.random.uuid(),
    fighterClass:
      fighterClasses[Math.floor(Math.random() * fighterClasses.length)],
    ...overrides,
  };
}

const fighterClasses: Array<FighterPrototype["fighterClass"]> = [
  "Ganger",
  "Juve",
  "Leader",
  "Champion",
  "Prospect",
];

export function buildUser(overrides?: Partial<User>): User {
  return {
    sub: faker.internet.userName(),
    ...overrides,
  };
}
