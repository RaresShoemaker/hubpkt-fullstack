import { Prisma, DeviceSize } from "@prisma/client";

export interface CreateCategoryInput {
  title: string;
  hasPreview?: boolean;
  isAvailable?: boolean;
  order: number;
  userId: string;
  previewTitle?: string;
  hasSquareContent?: boolean;
}

export type UpdateCategoryInput = Partial<
  Omit<
    Prisma.CategoryUpdateInput,
    'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'image' | 'imageMetadata' | 'cards' | 'design'
  >
>;

// Extended category type to include design
export interface CategoryWithDesign {
  id: string;
  title: string;
  image: string;
  imageMetadataId?: string;
  order: number;
  userId: string;
  createdAt: Date;
  deletedAt?: Date;
  updatedAt: Date;
  hasPreview: boolean;
  isAvailable: boolean;
  previewTitle: string;
  hasSquareContent: boolean;
  design?: CategoryDesignInfo;
}

// Design related types
export interface CategoryDesignInfo {
  id: string;
  categoryId: string;
  backgroundGradient: string;
  transitionGradient: string;
  designElements: DesignElementInfo[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface DesignElementInfo {
  id: string;
  url: string;
  order: number;
  categoryDesignId: string;
  deviceSize: DeviceSize;
  imageMetadataId?: string;
  htmlElements: HtmlElementInfo[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface HtmlElementInfo {
  id: string;
  designElementId: string;
  htmlTag: any; // JSON data
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}