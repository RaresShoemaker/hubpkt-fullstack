import { DeviceSize } from "../../../../store/features/categoryDesigns/categoryDesigns.types";
import { ButtonStyle } from '../../../Hero/HeroButton';

export interface Position {
  x: number;
  y: number;
}

// Align with your existing HtmlTag structure
export interface HtmlTag {
  link?: string;
  text?: string;
  type: string;
  style?: ButtonStyle;
  position: string;
}

// Align with your existing HtmlElement structure
export interface HtmlElement {
  id: string;
  designElementId: string;
  htmlTag: HtmlTag;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

// Our custom DraggableButtonElement for internal use
export interface DraggableButtonData {
  style: ButtonStyle;
  text: string;
  link: string;
  position: Position;
}

export interface CategoryDesignLayoutProps {
  heroImage?: string;
  backgroundGradient?: string;
  transitionGradient?: string;
  deviceSize?: DeviceSize;
  htmlElements?: HtmlElement[];
  onUpdateElements?: (elements: HtmlElement[]) => void;
}

export interface DraggableButtonProps {
  element: DraggableButtonData;
  elementId: string;
  onPositionChange: (elementId: string, newPosition: Position) => void;
  heroRef: React.RefObject<HTMLDivElement>;
}

export interface ButtonFactoryProps {
  onButtonCreate: (buttonData: Omit<DraggableButtonData, 'position'>) => void;
}