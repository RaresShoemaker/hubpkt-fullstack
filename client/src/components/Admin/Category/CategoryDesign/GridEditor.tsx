import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../../../../lib/utils';
import ButtonHero, { ButtonStyle } from '../../../Hero/HeroButton';
import HeroImage from '../../../Hero/HeroImage';
import { useNavigate } from 'react-router-dom';

interface Position {
  colStart: number;
  rowStart: number;
  colSpan: number;
  rowSpan: number;
}

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

interface GridEditorProps {
  backgroundImage: string;
  elements: ButtonElementData[];
  onElementsChange: (elements: ButtonElementData[]) => void;
  onSelectElement?: (id: string | null) => void;
  columns?: number;
  rows?: number;
  className?: string;
  minCellWidth?: number;
  minCellHeight?: number;
}

const GridEditor: React.FC<GridEditorProps> = ({
  backgroundImage,
  elements,
  onElementsChange,
  onSelectElement,
  columns = 12,
  rows = 6,
  className,
  minCellWidth = 50,
  minCellHeight = 40
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [activeElement, setActiveElement] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [mousePosition, setMousePosition] = useState<{ x: number, y: number } | null>(null);
  const [touchPosition, setTouchPosition] = useState<{ x: number, y: number } | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number, y: number } | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Detect touch capability on mount
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Helper function to create a grid of cells for visualization
  const renderGridCells = () => {
    const cells = [];
    for (let row = 1; row <= rows; row++) {
      for (let col = 1; col <= columns; col++) {
        cells.push(
          <div 
            key={`cell-${row}-${col}`} 
            className={cn(
              "border border-white/10 flex items-center justify-center",
              showGrid ? "opacity-90" : "opacity-0"
            )}
            style={{
              gridRowStart: row,
              gridColumnStart: col,
              transition: 'opacity 0.3s ease'
            }}
          >
            {showGrid && <span className="text-xs text-white/50">{col},{row}</span>}
          </div>
        );
      }
    }
    return cells;
  };

  // Calculate grid cell size based on container
  const getCellSize = () => {
    if (!gridRef.current) return { width: 0, height: 0 };
    
    const rect = gridRef.current.getBoundingClientRect();
    return {
      width: rect.width / columns,
      height: rect.height / rows
    };
  };

  // Convert position to grid position
  const getGridPosition = (clientX: number, clientY: number): Position | null => {
    if (!gridRef.current) return null;
    
    const rect = gridRef.current.getBoundingClientRect();
    
    // Apply drag offset if available
    let offsetX = clientX - rect.left;
    let offsetY = clientY - rect.top;
    
    if (dragOffset) {
      offsetX -= dragOffset.x;
      offsetY -= dragOffset.y;
    }
    
    // Ensure we're within bounds
    offsetX = Math.max(0, Math.min(rect.width, offsetX));
    offsetY = Math.max(0, Math.min(rect.height, offsetY));
    
    const { width, height } = getCellSize();
    
    // Calculate grid position (1-based)
    const colStart = Math.max(1, Math.min(columns, Math.floor(offsetX / width) + 1));
    const rowStart = Math.max(1, Math.min(rows, Math.floor(offsetY / height) + 1));
    
    // Get the active element to determine its span
    const element = elements.find(e => e.id === activeElement);
    const colSpan = element?.position.colSpan || 2;
    const rowSpan = element?.position.rowSpan || 1;
    
    // Adjust to ensure element doesn't go out of bounds
    const adjustedColStart = Math.min(colStart, columns - colSpan + 1);
    const adjustedRowStart = Math.min(rowStart, rows - rowSpan + 1);
    
    return {
      colStart: adjustedColStart,
      rowStart: adjustedRowStart,
      colSpan,
      rowSpan
    };
  };

  // MOUSE EVENT HANDLERS
  // Handle mouse down on an element
  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Set active element
    setActiveElement(elementId);
    if (onSelectElement) onSelectElement(elementId);
    
    // Start dragging and set mouse position
    setIsDragging(true);
    setMousePosition({ x: e.clientX, y: e.clientY });
    
    // Calculate drag offset (distance from top-left of the element to the mouse position)
    if (gridRef.current) {
      const element = elements.find(el => el.id === elementId);
      if (element) {
        const rect = gridRef.current.getBoundingClientRect();
        const cellSize = getCellSize();
        
        // Calculate element's top-left position
        const elementLeft = rect.left + (element.position.colStart - 1) * cellSize.width;
        const elementTop = rect.top + (element.position.rowStart - 1) * cellSize.height;
        
        // Drag offset is the difference between mouse position and element's top-left
        setDragOffset({
          x: e.clientX - elementLeft,
          y: e.clientY - elementTop
        });
      }
    }
  };

  // Handle mouse move to update element position
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !activeElement) return;
    
    // Update mouse position
    setMousePosition({ x: e.clientX, y: e.clientY });
    
    const gridPosition = getGridPosition(e.clientX, e.clientY);
    if (!gridPosition) return;
    
    // Update the position of the active element
    const updatedElements = elements.map(element => {
      if (element.id === activeElement) {
        return {
          ...element,
          position: gridPosition
        };
      }
      return element;
    });
    
    onElementsChange(updatedElements);
  };

  // Handle mouse up to end dragging
  const handleMouseUp = () => {
    setIsDragging(false);
    setMousePosition(null);
    setDragOffset(null);
  };

  // TOUCH EVENT HANDLERS
  // Handle touch start on an element
  const handleTouchStart = (e: React.TouchEvent, elementId: string) => {
    if (e.touches.length !== 1) return; // Only handle single touches
    
    e.stopPropagation();
    
    // Set active element
    setActiveElement(elementId);
    if (onSelectElement) onSelectElement(elementId);
    
    const touch = e.touches[0];
    
    // Start dragging and set touch position
    setIsDragging(true);
    setTouchPosition({ x: touch.clientX, y: touch.clientY });
    
    // Calculate drag offset (distance from top-left of the element to the touch position)
    if (gridRef.current) {
      const element = elements.find(el => el.id === elementId);
      if (element) {
        const rect = gridRef.current.getBoundingClientRect();
        const cellSize = getCellSize();
        
        // Calculate element's top-left position
        const elementLeft = rect.left + (element.position.colStart - 1) * cellSize.width;
        const elementTop = rect.top + (element.position.rowStart - 1) * cellSize.height;
        
        // Drag offset is the difference between touch position and element's top-left
        setDragOffset({
          x: touch.clientX - elementLeft,
          y: touch.clientY - elementTop
        });
      }
    }
  };

  // Handle touch move to update element position
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !activeElement || e.touches.length !== 1) return;
    
    // Prevent scrolling during drag
    e.preventDefault();
    
    const touch = e.touches[0];
    
    // Update touch position
    setTouchPosition({ x: touch.clientX, y: touch.clientY });
    
    const gridPosition = getGridPosition(touch.clientX, touch.clientY);
    if (!gridPosition) return;
    
    // Update the position of the active element
    const updatedElements = elements.map(element => {
      if (element.id === activeElement) {
        return {
          ...element,
          position: gridPosition
        };
      }
      return element;
    });
    
    onElementsChange(updatedElements);
  };

  // Handle touch end to end dragging
  const handleTouchEnd = () => {
    setIsDragging(false);
    setTouchPosition(null);
    setDragOffset(null);
  };

  // Set up global mouse events for dragging
  useEffect(() => {
    if (isDragging && mousePosition) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        const gridPosition = getGridPosition(e.clientX, e.clientY);
        if (!gridPosition) return;
        
        // Update the position of the active element
        const updatedElements = elements.map(element => {
          if (element.id === activeElement) {
            return {
              ...element,
              position: gridPosition
            };
          }
          return element;
        });
        
        onElementsChange(updatedElements);
        setMousePosition({ x: e.clientX, y: e.clientY });
      };
      
      const handleGlobalMouseUp = () => {
        setIsDragging(false);
        setMousePosition(null);
        setDragOffset(null);
      };
      
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleGlobalMouseMove);
        window.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, activeElement, mousePosition, elements, onElementsChange]);

  // Set up global touch events for dragging
  useEffect(() => {
    if (isDragging && touchPosition) {
      const handleGlobalTouchMove = (e: TouchEvent) => {
        if (e.touches.length !== 1) return;
        
        const touch = e.touches[0];
        const gridPosition = getGridPosition(touch.clientX, touch.clientY);
        if (!gridPosition) return;
        
        // Update the position of the active element
        const updatedElements = elements.map(element => {
          if (element.id === activeElement) {
            return {
              ...element,
              position: gridPosition
            };
          }
          return element;
        });
        
        onElementsChange(updatedElements);
        setTouchPosition({ x: touch.clientX, y: touch.clientY });
        
        // Prevent default to stop scrolling
        e.preventDefault();
      };
      
      const handleGlobalTouchEnd = () => {
        setIsDragging(false);
        setTouchPosition(null);
        setDragOffset(null);
      };
      
      window.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
      window.addEventListener('touchend', handleGlobalTouchEnd);
      window.addEventListener('touchcancel', handleGlobalTouchEnd);
      
      return () => {
        window.removeEventListener('touchmove', handleGlobalTouchMove);
        window.removeEventListener('touchend', handleGlobalTouchEnd);
        window.removeEventListener('touchcancel', handleGlobalTouchEnd);
      };
    }
  }, [isDragging, activeElement, touchPosition, elements, onElementsChange]);

  // Handle element selection
  const handleElementClick = (e: React.MouseEvent, elementId: string) => {
    if (!isDragging) {
      e.stopPropagation();
      const newActiveElement = elementId === activeElement ? null : elementId;
      setActiveElement(newActiveElement);
      if (onSelectElement) onSelectElement(newActiveElement);
    }
  };

  // Get element's visual position styles
  const getElementStyle = (position: Position) => {
    return {
      gridColumnStart: position.colStart,
      gridColumnEnd: position.colStart + position.colSpan,
      gridRowStart: position.rowStart,
      gridRowEnd: position.rowStart + position.rowSpan,
    };
  };

  // Handle click on the grid (deselect)
  const handleGridClick = () => {
    if (!isDragging) {
      setActiveElement(null);
      if (onSelectElement) onSelectElement(null);
    }
  };

  // Toggle grid visibility
  const toggleGrid = () => {
    setShowGrid(!showGrid);
  };

  const handleBack = () => {
    navigate(-1);
  }

  // Reset active element when elements change externally
  useEffect(() => {
    if (activeElement && !elements.some(e => e.id === activeElement)) {
      setActiveElement(null);
      if (onSelectElement) onSelectElement(null);
    }
  }, [elements, activeElement, onSelectElement]);

  // Create grid styles with minimum cell sizes
  const gridStyles = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, minmax(${minCellWidth}px, 1fr))`,
    gridTemplateRows: `repeat(${rows}, minmax(${minCellHeight}px, 1fr))`,
    width: '100%',
    height: '100%',
    minWidth: `${minCellWidth * columns}px`, // Ensure minimum grid width
    minHeight: `${minCellHeight * rows}px`,  // Ensure minimum grid height
    position: 'relative' as const,
    overflow: 'auto' as const
  };

  return (
    <div className={cn(
            'relative w-full overflow-hidden h-[70vh] md:h-[60vh]',
            className
          )}>
      {/* Background layers */}
      {backgroundImage && (
        <div className="absolute inset-0 w-full h-full z-0">
          <HeroImage src={backgroundImage} />
        </div>
      )}
      
      <div className='flex flex-col absolute top-2 right-2 z-50 gap-4'>
        <button 
          className="px-3 py-1 bg-gray-800 text-white rounded text-sm"
          onClick={toggleGrid}
        >
          {showGrid ? 'Hide Grid' : 'Show Grid'}
        </button>

        <button 
          className="px-3 py-1 bg-gray-800 text-white rounded text-sm"
          onClick={handleBack}
        >
          Back
        </button>
      </div>

      {/* Mobile hint - only shown on touch devices */}
      {isTouchDevice && (
        <div className="md:hidden absolute top-2 left-2 z-50 bg-gray-800/80 text-white text-xs p-2 rounded">
          Tap and drag elements to position
        </div>
      )}

      {/* Main grid container */}
      <div
        ref={gridRef}
        className="absolute inset-0 z-10 touch-manipulation"
        style={gridStyles}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleGridClick}
      >
        {/* Grid cells visualization */}
        {renderGridCells()}
        
        {/* Render draggable elements */}
        {elements.map((element) => (
          <div
            key={element.id}
            className={cn(
              "flex items-center justify-center z-20",
              activeElement === element.id ? "ring-2 ring-blue-500" : "",
              isDragging && activeElement === element.id ? "cursor-grabbing" : "cursor-grab"
            )}
            style={getElementStyle(element.position)}
            onClick={(e) => handleElementClick(e, element.id)}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
            onTouchStart={(e) => handleTouchStart(e, element.id)}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="relative w-full">
              {/* Draggable handle - larger on touch devices */}
              <div className={cn(
                "w-full flex items-center justify-center mb-1 rounded-t",
                "bg-gray-800 bg-opacity-60",
                isTouchDevice ? "h-8" : "h-6"
              )}>
                <div className={cn(
                  "bg-white rounded-full",
                  isTouchDevice ? "w-10 h-2" : "w-8 h-1"
                )}></div>
              </div>
              
              {/* Element content */}
              <ButtonHero
                style={element.style}
                text={element.text}
                className="pointer-events-none"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GridEditor;