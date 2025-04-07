/* eslint-disable @typescript-eslint/no-explicit-any */
import { HtmlElement } from '../store/features/categoryDesigns/categoryDesigns.types';
import { ButtonStyle } from '../components/Hero/HeroButton';

// Interface for the button elements used in the grid editor
interface ButtonElementData {
	id: string;
	text: string;
	link: string;
	style: ButtonStyle;
	position: {
		colStart: number;
		rowStart: number;
		colSpan: number;
		rowSpan: number;
	};
}

// Position data extracted from CSS classes
interface ParsedPosition {
  colStart: number;
  colSpan: number;
  rowStart: number;
  rowSpan: number;
}

/**
 * Parse grid position from CSS classes string
 * Example: "col-start-2 col-span-4 row-start-3 row-span-1"
 */
export function parsePositionFromClasses(positionClasses: string): ParsedPosition | null {
  if (!positionClasses) return null;
  
  const colStartMatch = positionClasses.match(/col-start-(\d+)/);
  const colSpanMatch = positionClasses.match(/col-span-(\d+)/);
  const rowStartMatch = positionClasses.match(/row-start-(\d+)/);
  const rowSpanMatch = positionClasses.match(/row-span-(\d+)/);
  
  if (!colStartMatch || !rowStartMatch) return null;
  
  return {
    colStart: parseInt(colStartMatch[1]),
    colSpan: colSpanMatch ? parseInt(colSpanMatch[1]) : 2,
    rowStart: parseInt(rowStartMatch[1]),
    rowSpan: rowSpanMatch ? parseInt(rowSpanMatch[1]) : 1
  };
}

/**
 * Create position classes string from grid position
 */
export function createPositionClasses(position: ParsedPosition): string {
  // Ensure all values are numbers and have sensible defaults/limits
  const colStart = Math.max(1, Math.min(12, position.colStart || 1));
  const colSpan = Math.max(1, Math.min(12, position.colSpan || 2));
  const rowStart = Math.max(1, Math.min(6, position.rowStart || 1));
  const rowSpan = Math.max(1, Math.min(6, position.rowSpan || 1));
  
  // Safeguard: make sure we don't exceed grid bounds
  const effectiveColSpan = colStart + colSpan > 13 ? 13 - colStart : colSpan;
  const effectiveRowSpan = rowStart + rowSpan > 7 ? 7 - rowStart : rowSpan;
  
  return `col-start-${colStart} col-span-${effectiveColSpan} row-start-${rowStart} row-span-${effectiveRowSpan}`;
}

/**
 * Convert HTML elements from the API to button elements for the grid editor
 */
export function convertHtmlElementsToButtonElements(htmlElements: HtmlElement[]): ButtonElementData[] {
  const buttonElements: ButtonElementData[] = [];
  
  htmlElements.forEach(element => {
    // Handle both direct button elements and nested CTA data structures
    const isButton = element.htmlTag.type === 'button';
    const isCta = element.htmlTag.data?.cta !== undefined;
    
    if (isButton || isCta) {
      // Get the relevant data depending on structure
      const data = isCta ? element.htmlTag.data.cta : element.htmlTag;
      
      // Parse position from CSS classes
      const position = parsePositionFromClasses(data.position);
      
      if (position) {
        buttonElements.push({
          id: element.id,
          text: data.text || 'Button',
          link: data.link || '#',
          style: data.style || 'secondary',
          position: position
        });
      }
    }
  });
  
  return buttonElements;
}

/**
 * Convert button elements from the grid editor to HTML elements for the API
 */
export function convertButtonElementsToHtmlElements(buttonElements: ButtonElementData[]): any[] {
  // Create objects in the format expected by the API
  // Log the transformation process to debug
  
  const transformedElements = buttonElements.map(button => {
    // Create position classes string
    const position = createPositionClasses({
      colStart: button.position.colStart,
      colSpan: button.position.colSpan,
      rowStart: button.position.rowStart,
      rowSpan: button.position.rowSpan
    });
    
    // Create HTML element in the format expected by the API
    return {
      type: 'button',
      text: button.text,
      link: button.link,
      style: button.style,
      position: position
    };
  });
  return transformedElements;
}

/**
 * Generate a default position for a new button
 */
export function getDefaultButtonPosition(columns: number = 12, rows: number = 6): ParsedPosition {
  return {
    colStart: Math.floor(columns / 3),
    colSpan: Math.floor(columns / 3),
    rowStart: Math.floor(rows / 2),
    rowSpan: 1
  };
}

/**
 * Generate a unique ID for a new button
 */
export function generateButtonId(): string {
  return `btn-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}