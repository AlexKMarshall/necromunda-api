import * as z from "zod";
import { fighterSchema } from "../fighter/fighter.type";
import { gangSchema } from "../gang/gang.type";

export const purchaseSchema = z.object({
  gangId: gangSchema.shape._id,
  fighters: z.array(fighterSchema.pick({ name: true, protoId: true })),
});

export type Purchase = z.infer<typeof purchaseSchema>;
