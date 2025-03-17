// src/components/CategoryDesign/DraggableButton.tsx
import React, { useState, useRef, useEffect } from 'react';
import ButtonHero from '../../../Hero/HeroButton';
import { DraggableButtonProps, Position } from './types';

const DraggableButton: React.FC<DraggableButtonProps> = ({ 
  element, 
  elementId,
  onPositionChange, 
  heroRef 
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [position, setPosition] = useState<Position>(element.position);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef<Position>({ x: 0, y: 0 });
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!wrapperRef.current || !heroRef.current) return;
    e.preventDefault(); // Prevent default to avoid button click while dragging
    
    setIsDragging(true);
    
    const wrapperRect = wrapperRef.current.getBoundingClientRect();
    const offsetX = e.clientX - wrapperRect.left;
    const offsetY = e.clientY - wrapperRect.top;
    
    dragOffset.current = { x: offsetX, y: offsetY };
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !heroRef.current) return;
    
    const heroRect = heroRef.current.getBoundingClientRect();
    
    // Calculate position relative to hero container
    const relativeX = e.clientX - heroRect.left - dragOffset.current.x;
    const relativeY = e.clientY - heroRect.top - dragOffset.current.y;
    
    // Calculate position as percentages for responsiveness
    const percentX = (relativeX / heroRect.width) * 100;
    const percentY = (relativeY / heroRect.height) * 100;
    
    // Calculate button width as percentage (estimate based on style)
    const buttonWidthPercent = element.style === 'primary' ? 20 : 15;
    const buttonHeightPercent = 8;
    
    // Constrain to hero container boundaries
    const constrainedX = Math.max(0, Math.min(percentX, 100 - buttonWidthPercent));
    const constrainedY = Math.max(0, Math.min(percentY, 100 - buttonHeightPercent));
    
    const newPosition = { x: constrainedX, y: constrainedY };
    setPosition(newPosition);
    
    // Update the element position
    onPositionChange(elementId, newPosition);
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
  }, [isDragging]);
  
  return (
    <div 
      ref={wrapperRef}
      className={`absolute hidden lg:block ${isDragging ? 'z-50' : 'z-10'}`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        touchAction: 'none',
        cursor: 'move',
        width: element.style === 'primary' ? '200px' : '150px'
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="drag-handle w-full h-6 flex items-center justify-center mb-1 bg-gray-800 bg-opacity-50 rounded-t">
        <div className="w-8 h-1 bg-white rounded-full"></div>
      </div>
      <ButtonHero 
        style={element.style}
        text={element.text}
        link={isDragging ? undefined : element.link} // Disable link while dragging
        className="pointer-events-none" // Prevent button click events during drag
      />
    </div>
  );
};

export default DraggableButton;