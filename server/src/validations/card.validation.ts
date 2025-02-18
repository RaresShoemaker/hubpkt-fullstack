import z from "zod";
import { baseEntitySchema } from "./base.validation";


export const cardSchema = z.object({
  ...baseEntitySchema,
  title: z.string().min(2).max(100),
  description: z.string().min(10),
  image: z.string().url(),
  imageMetadataId: z.string().uuid().optional(),
  order: z.union([
    z.number().int().min(1).max(20),
    z.literal('random')
  ]),
  expiration: z.union([
    z.date(),
    z.literal('infinite')
  ]),
  isAvailable: z.boolean(),
  userId: z.string().uuid(),
  categoryId: z.string().uuid(),
  isHot: z.boolean(),
  isPreview: z.boolean(),
});

export const createCardSchema = cardSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true, 
  deletedAt: true 
});

export const updateCardSchema = cardSchema
  .omit({ createdAt: true, deletedAt: true })
  .partial()
  .required({ id: true });