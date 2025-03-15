/* eslint-disable @typescript-eslint/no-explicit-any */
export enum DeviceSize {
  mobile = 'mobile',
  tablet = 'tablet',
  desktop = 'desktop'
}

export interface DesignElement {
  id: string;
  url: string;
  order: number;
  categoryId: string;
  device: DeviceSize;
  image: string;
  imageMetadataId?: string;
  backgroundGradient: string;
  transitionGradient: string;
  htmlElements: HtmlElement[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  imageMetadata?: ImageMetadata;
}

export interface HtmlElement {
  id: string;
  designElementId: string;
  htmlTag: any; // JSON data for HTML elements
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface ImageMetadata {
  id: string;
  width: number;
  height: number;
  size: number;
  mimeType: string;
  url: string;
}

export interface CategoryDesigns {
  mobile: DesignElement[];
  tablet: DesignElement[];
  desktop: DesignElement[];
}

export interface CategoryDesignsState {
  designs: CategoryDesigns;
  currentDesign: DesignElement | null;
  loading: boolean;
  error: string | null;
}

// Request Types
export interface CreateDesignElementRequest {
  categoryId: string;
  device: DeviceSize;
  order: number;
  backgroundGradient?: string;
  transitionGradient?: string;
  htmlElements?: any[];
  image: File;
}

export interface UpdateDesignElementRequest {
  id: string;
  device?: DeviceSize;
  order?: number;
  backgroundGradient?: string;
  transitionGradient?: string;
  htmlElements?: any[]; // Updated to include htmlElements for direct updates
  image?: File;
}

export interface ReorderDesignElementsRequest {
  categoryId: string;
  device: DeviceSize;
  elementIds: string[];
}

export interface CreateHtmlElementRequest {
  designElementId: string;
  htmlTag: any;
}

export interface UpdateHtmlElementRequest {
  id: string;
  htmlTag: any;
}

// Response Types
export interface ApiResponse<T> {
  status: string;
  data: T;
}