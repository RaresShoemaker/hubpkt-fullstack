import { Prisma } from "@prisma/client";

export interface CreateCategoryInput {
  title: string;
  hasPreview?: boolean;
  isAvailable?: boolean;
  order: number;
  userId: string;
}

export type UpdateCategoryInput = Partial<
  Omit<
    Prisma.CategoryUpdateInput,
    'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'image' | 'imageMetadata' | 'cards'
  >
>;