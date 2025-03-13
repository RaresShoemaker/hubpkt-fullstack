/* eslint-disable @typescript-eslint/no-explicit-any */
// src/store/features/categoryDesigns/categoryDesigns.types.ts

export type DeviceSize = 'mobile' | 'tablet' | 'desktop';

export interface HtmlElement {
  id: string;
  designElementId: string;
  htmlTag: Record<string, any>; // This contains the JSON structure for HTML elements
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface DesignElement {
  id: string;
  url: string;
  order: number;
  categoryDesignId: string;
  deviceSize: DeviceSize;
  imageMetadataId?: string;
  imageMetadata?: {
    id: string;
    width: number;
    height: number;
    size: number;
    mimeType: string;
    url: string;
  };
  htmlElements: HtmlElement[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface CategoryDesign {
  id: string;
  categoryId: string;
  backgroundGradient: string;
  transitionGradient: string;
  designElements: DesignElement[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface CreateCategoryDesignInput {
  categoryId: string;
  backgroundGradient?: string;
  transitionGradient?: string;
}

export interface UpdateCategoryDesignInput {
  id: string;
  backgroundGradient?: string;
  transitionGradient?: string;
}

export interface CreateDesignElementInput {
  categoryDesignId: string;
  url?: string; // Will be populated after image upload
  order: number;
  deviceSize: DeviceSize;
  htmlElements?: Record<string, any>[];
  imageFile?: File;
}

export interface UpdateDesignElementInput {
  id: string;
  order?: number;
  deviceSize?: DeviceSize;
  imageFile?: File;
}

export interface CreateHtmlElementInput {
  designElementId: string;
  htmlTag: Record<string, any>;
}

export interface UpdateHtmlElementInput {
  id: string;
  htmlTag: Record<string, any>;
}

export interface InitialState {
  designs: CategoryDesign[];
  currentDesign: CategoryDesign | null;
  operations: {
    createDesign: {
      isLoading: boolean;
      error: string | null;
    };
    updateDesign: {
      isLoading: boolean;
      error: string | null;
    };
    deleteDesign: {
      isLoading: boolean;
      error: string | null;
    };
    fetchDesign: {
      isLoading: boolean;
      error: string | null;
    };
    fetchDesignByCategory: {
      isLoading: boolean;
      error: string | null;
    };
    createElement: {
      isLoading: boolean;
      error: string | null;
    };
    updateElement: {
      isLoading: boolean;
      error: string | null;
    };
    deleteElement: {
      isLoading: boolean;
      error: string | null;
    };
    createHtmlElement: {
      isLoading: boolean;
      error: string | null;
    };
    updateHtmlElement: {
      isLoading: boolean;
      error: string | null;
    };
    deleteHtmlElement: {
      isLoading: boolean;
      error: string | null;
    };
    reorderElements: {
      isLoading: boolean;
      error: string | null;
    };
  };
}