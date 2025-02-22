import { ImageMetadata } from "../categories/categories.types";

export interface Card {
  id: string;
  title: string;
  description: string;
  genre: string;
  image: string;
  imageMetadata?: ImageMetadata;
  imageMetadataId?: string;
  order: number;
  expiration?: Date;
  isAvailable: boolean;
  userId: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  isDiscover: boolean;
  isHot: boolean;
  isPreview: boolean;
}