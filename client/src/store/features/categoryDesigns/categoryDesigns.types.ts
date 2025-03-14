/* eslint-disable @typescript-eslint/no-explicit-any */
import { ImageMetadata } from '../categories/categories.types';

// Basic types
export interface HtmlElement {
  id: string;
  designElementId: string;
  htmlTag: any; // JSON object with HTML content
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface DesignElement {
  id: string;
  url: string;
  order: number;
  categoryDesignId: string;
  deviceSize: "mobile" | "tablet" | "desktop";
  imageMetadataId?: string;
  imageMetadata?: ImageMetadata;
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

// Request/Response types for API calls
export interface CreateCategoryDesignRequest {
  categoryId: string;
  backgroundGradient?: string;
  transitionGradient?: string;
}

export interface UpdateCategoryDesignRequest {
  id: string;
  backgroundGradient?: string;
  transitionGradient?: string;
}

export interface CreateDesignElementRequest {
  categoryDesignId: string;
  image: File;
  order: number;
  deviceSize: "mobile" | "tablet" | "desktop";
  htmlElements?: CreateHtmlElementRequest[];
}

export interface UpdateDesignElementRequest {
  id: string;
  image?: File;
  order?: number;
  deviceSize?: "mobile" | "tablet" | "desktop";
}

export interface CreateHtmlElementRequest {
  designElementId: string;
  htmlTag: any; // JSON object
}

export interface UpdateHtmlElementRequest {
  id: string;
  htmlTag: any; // JSON object
}

export interface ReorderDesignElementsRequest {
  categoryDesignId: string;
  deviceSize: "mobile" | "tablet" | "desktop";
  elementIds: string[];
}

// Redux state type
export interface CategoryDesignsState {
  currentDesign: CategoryDesign | null;
  currentElement: DesignElement | null;
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
    reorderElements: {
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
  };
}