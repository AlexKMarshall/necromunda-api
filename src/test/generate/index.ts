import faker from "faker";
import { FactionInbound } from "../../domain/faction/faction.type";

export function buildFactionInbound(
  overrides?: Partial<FactionInbound>
): FactionInbound {
  return {
    name: faker.company.companyName(),
    ...overrides,
  };
}
