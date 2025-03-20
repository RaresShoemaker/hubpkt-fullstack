import React, { useState, useRef, useEffect } from 'react';
import ButtonHero from '../../../Hero/HeroButton';
import { DraggableButtonProps, Position } from './types';

// Grid configuration - must match the grid in HeroContainer
const GRID_COLS = 12;
const GRID_ROWS = 6;

// Convert mouse position to grid-snapped percentage position
function getGridSnappedPosition(clientX: number, clientY: number, heroRect: DOMRect): Position {
  // Calculate relative position within hero
  const relativeX = clientX - heroRect.left;
  const relativeY = clientY - heroRect.top;
  
  // Convert to percentages
  const percentX = (relativeX / heroRect.width) * 100;
  const percentY = (relativeY / heroRect.height) * 100;
  
  // Calculate cell width/height in percentage terms
  const cellWidth = 100 / GRID_COLS;
  const cellHeight = 100 / GRID_ROWS;
  
  // Calculate which grid cell we're in (1-based)
  const colStart = Math.max(1, Math.min(GRID_COLS, Math.floor(percentX / cellWidth) + 1));
  const rowStart = Math.max(1, Math.min(GRID_ROWS, Math.floor(percentY / cellHeight) + 1));
  
  // Convert back to percentage positions, but snapped to grid cell
  const snappedX = (colStart - 1) * cellWidth;
  const snappedY = (rowStart - 1) * cellHeight;
  
  return { x: snappedX, y: snappedY };
}

const DraggableButton: React.FC<DraggableButtonProps> = ({ 
  element, 
  elementId,
  onPositionChange, 
  heroRef 
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [currentGridCell, setCurrentGridCell] = useState<{col: number, row: number}>(() => {
    const cellWidth = 100 / GRID_COLS;
    const cellHeight = 100 / GRID_ROWS;
    return {
      col: Math.max(1, Math.min(GRID_COLS, Math.floor(element.position.x / cellWidth) + 1)),
      row: Math.max(1, Math.min(GRID_ROWS, Math.floor(element.position.y / cellHeight) + 1))
    };
  });
  
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  // Update grid cell when element.position changes from parent
  useEffect(() => {
    // Update current grid cell
    const cellWidth = 100 / GRID_COLS;
    const cellHeight = 100 / GRID_ROWS;
    setCurrentGridCell({
      col: Math.max(1, Math.min(GRID_COLS, Math.floor(element.position.x / cellWidth) + 1)),
      row: Math.max(1, Math.min(GRID_ROWS, Math.floor(element.position.y / cellHeight) + 1))
    });
  }, [element.position]);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!heroRef.current) return;
    e.preventDefault(); // Prevent default to avoid button click while dragging
    setIsDragging(true);
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !heroRef.current) return;
    
    const heroRect = heroRef.current.getBoundingClientRect();
    const snappedPosition = getGridSnappedPosition(e.clientX, e.clientY, heroRect);
    
    // Calculate the current grid cell
    const cellWidth = 100 / GRID_COLS;
    const cellHeight = 100 / GRID_ROWS;
    const col = Math.floor(snappedPosition.x / cellWidth) + 1;
    const row = Math.floor(snappedPosition.y / cellHeight) + 1;
    
    // Only update if we've moved to a different grid cell
    if (col !== currentGridCell.col || row !== currentGridCell.row) {
      setCurrentGridCell({ col, row });
      onPositionChange(elementId, snappedPosition);
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // Add and remove event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, currentGridCell]);
  
  // Calculate current grid position class string
  const gridPosition = `col-start-${currentGridCell.col} col-span-2 row-start-${currentGridCell.row} row-span-1`;
  
  // Both dragging and non-dragging states now use the grid system
  return (
    <div 
      ref={wrapperRef}
      className={`${gridPosition} hidden lg:flex items-center justify-center cursor-grab z-10 ${isDragging ? 'z-50' : 'z-10'}`}
      onMouseDown={handleMouseDown}
    >
      <div className="relative w-full">
        {/* Add a visual indicator for dragging state */}
        <div className={`drag-handle w-full h-6 flex items-center justify-center mb-1 bg-gray-800 ${isDragging ? 'bg-opacity-80' : 'bg-opacity-50'} rounded-t`}>
          <div className="w-8 h-1 bg-white rounded-full"></div>
        </div>
        <ButtonHero 
          style={element.style}
          text={element.text}
          link={isDragging ? undefined : element.link} // Disable link while dragging
          className="pointer-events-none" // Prevent button click events during drag
        />
      </div>
    </div>
  );
};

export default DraggableButton;