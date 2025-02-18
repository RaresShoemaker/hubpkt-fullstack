import z from "zod";
import { baseEntitySchema } from "./base.validation";

export const categorySchema = z.object({
  ...baseEntitySchema,
  title: z.string().min(2).max(100),
  image: z.string().url(),
  imageMetadataId: z.string().uuid().optional(),
  order: z.number().int().positive(),
  userId: z.string().uuid(),
  hasPreview: z.boolean(),
  isAvailable: z.boolean(),
});

export const createCategorySchema = categorySchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true, 
  deletedAt: true 
});

export const updateCategorySchema = categorySchema
  .omit({ createdAt: true, deletedAt: true })
  .partial()
  .required({ id: true });