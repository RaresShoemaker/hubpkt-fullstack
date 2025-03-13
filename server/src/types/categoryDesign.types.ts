import { DeviceSize } from '@prisma/client';

export interface CreateCategoryDesignInput {
  categoryId: string;
  backgroundGradient?: string;
  transitionGradient?: string;
}

export interface UpdateCategoryDesignInput {
  backgroundGradient?: string;
  transitionGradient?: string;
}

export interface DesignElementInput {
  url: string;
  order: number;
  deviceSize: DeviceSize;
  htmlElements?: HtmlElementInput[];
}

export interface CreateDesignElementInput extends DesignElementInput {
  categoryDesignId: string;
}

export interface UpdateDesignElementInput {
  url?: string;
  order?: number;
  deviceSize?: DeviceSize;
}

export interface HtmlElementInput {
  htmlTag: Record<string, any>; // JSON structure for HTML elements
}

export interface CreateHtmlElementInput extends HtmlElementInput {
  designElementId: string;
}

export interface UpdateHtmlElementInput {
  htmlTag?: Record<string, any>;
}

// Example of the CTA HTML element structure
export interface CtaHtmlElement {
  data: {
    cta: {
      type: string;
      style: string;
      link: string;
      text: string;
      position: string; // CSS grid position classes
    }
  }
}