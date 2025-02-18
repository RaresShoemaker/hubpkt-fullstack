import z from 'zod';

export const baseEntitySchema = {
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
};