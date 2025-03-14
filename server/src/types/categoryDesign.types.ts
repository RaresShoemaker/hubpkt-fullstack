import { DeviceSize } from '@prisma/client';

export interface CreateDesignElementInput {
  categoryId: string;
  url: string;
  order: number;
  device: DeviceSize;
  image: string;
  backgroundGradient?: string;
  transitionGradient?: string;
  htmlElements?: HtmlElementInput[];
}

export interface UpdateDesignElementInput {
  url?: string;
  order?: number;
  device?: DeviceSize;
  image?: string;
  backgroundGradient?: string;
  transitionGradient?: string;
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