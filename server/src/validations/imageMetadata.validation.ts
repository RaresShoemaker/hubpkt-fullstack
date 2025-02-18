import z from "zod";
import { baseEntitySchema } from "./base.validation";

export const imageMetadataSchema = z.object({
  ...baseEntitySchema,
  width: z.number().min(1),
  height: z.number().min(1),
  size: z.number().max(500), // Max 500KB
  mimeType: z.string().regex(/^image\/(jpeg|png|gif|webp)$/),
  url: z.string().url(),
});


export const createImageMetadataSchema = imageMetadataSchema.omit({
  id: true,
  url: true // URL will be generated after upload
});