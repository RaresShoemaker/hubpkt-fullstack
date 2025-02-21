// Basic types
export interface ImageMetadata {
  id: string;
  url: string;
  mimeType: string;
  widht: number;
  height: number;
}

export interface Category {
  id: string;
  title: string;
  hasPreview: boolean;
  isAvailable: boolean;
  order: number;
  image: string;
  imageMetadata?: ImageMetadata;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  createdById: string;
}

// Request/Response types for API calls
export interface CreateCategoryRequest {
  title: string;
  hasPreview?: boolean;
  isAvailable?: boolean;
  order: number;
  userId: string;
  image: File;
}

export interface UpdateCategoryRequest {
  id: string;
  title?: string;
  hasPreview?: boolean;
  isAvailable?: boolean;
  order?: number;
  image?: File;
}

export interface ListCategoriesParams {
  skip?: number;
  take?: number;
  orderBy?: {
    [key: string]: 'asc' | 'desc';
  };
  where?: {
    title?: string;
    isAvailable?: boolean;
  };
}

// Redux state type with granular operations
export interface CategoryState {
  items: Category[];
  total: number;
  currentCategory: Category | null;
  operations: {
    create: {
      isLoading: boolean;
      error: string | null;
    };
    update: {
      isLoading: boolean;
      error: string | null;
    };
    delete: {
      isLoading: boolean;
      error: string | null;
    };
    fetch: {
      isLoading: boolean;
      error: string | null;
    };
    list: {
      isLoading: boolean;
      error: string | null;
    };
    updateOrder: {
      isLoading: boolean;
      error: string | null;
    };
    reorder: {
      isLoading: boolean;
      error: string | null;
    };
  };
}

// Action payload types
export interface UpdateCategoryOrderPayload {
  categoryId: string;
  newOrder: number;
}

export interface ReorderCategoriesPayload {
  orderedCategoryIds: string[];
}

// API response types
export type CreateCategoryResponse = Category;
export type UpdateCategoryResponse = Category;
export type GetCategoryResponse = Category;
export type DeleteCategoryResponse = boolean;
export type UpdateCategoryOrderResponse = boolean;
export type ReorderCategoriesResponse = boolean;
export interface ListCategoriesResponse {
  total: number;
  categories: Category[];
}
