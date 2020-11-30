import * as z from "zod";
import { fighterPrototypeSchema } from "../fighter-prototype/fighter-prototype.type";

export const fighterSchema = z.object({
  _id: z.string().optional(),
  name: z.string(),
  proto: fighterPrototypeSchema.shape.name,
  protoId: fighterPrototypeSchema.shape._id,
  class: fighterPrototypeSchema.shape.class,
});

export type Fighter = z.infer<typeof fighterSchema>;
