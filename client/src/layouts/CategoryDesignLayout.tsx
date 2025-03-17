// src/components/CategoryDesign/CategoryDesignLayout.tsx
import React, { useState, useRef, useEffect } from 'react';
import { DraggableButtonData, HtmlElement } from '../components/Admin/Category/CategoryDesign/types';
import Hero from '../components/Hero/Hero';
import HeroElements from '../components/Hero/HeroElements';
import BlurTransition from '../components/BlurTransition';
import BackgroundTransition from '../components/BackgroundTransition';
import DraggableButton from '../components/Admin/Category/CategoryDesign/DraggableButton';
import ButtonFactory from '../components/Admin/Category/CategoryDesign/ButtonFactory';
import { CategoryDesignLayoutProps, Position } from '../components/Admin/Category/CategoryDesign/types';

const CategoryDesignLayout: React.FC<CategoryDesignLayoutProps> = ({
  heroImage,
  backgroundGradient,
  transitionGradient,
  htmlElements = [],
  onUpdateElements
}) => {
  // Internal state to track draggable elements separately from the HtmlElements structure
  const [draggableElements, setDraggableElements] = useState<{[id: string]: DraggableButtonData}>({});
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Initialize draggable elements from htmlElements on first render
  useEffect(() => {
    const initialDraggableElements: {[id: string]: DraggableButtonData} = {};
    
    htmlElements.forEach(element => {
      if (element.htmlTag.type === 'button') {
        // Parse position from string "col-start-X col-end-Y row-start-Z row-end-W" to x, y coordinates
        // This is a simplified conversion - you may need to adapt this to your actual grid system
        const position = parsePositionFromGridClasses(element.htmlTag.position || '');
        
        initialDraggableElements[element.id] = {
          text: element.htmlTag.text || '',
          link: element.htmlTag.link || '',
          style: element.htmlTag.style || 'secondary',
          position
        };
      }
    });
    
    setDraggableElements(initialDraggableElements);
  }, []);
  
  // Helper function to parse grid position classes to x,y coordinates
  const parsePositionFromGridClasses = (positionClass: string): Position => {
    // This is a simplified implementation - adapt to your grid system
    // Example: "col-start-2 col-end-5 row-start-3 row-end-4" 
    // would be converted to { x: (2-1)/12*100, y: (3-1)/6*100 }
    try {
      const colStartMatch = positionClass.match(/col-start-(\d+)/);
      const rowStartMatch = positionClass.match(/row-start-(\d+)/);
      
      if (colStartMatch && rowStartMatch) {
        const colStart = parseInt(colStartMatch[1], 10);
        const rowStart = parseInt(rowStartMatch[1], 10);
        
        // Convert to percentage positions (assuming 12 column grid and 6 row grid)
        const x = ((colStart - 1) / 12) * 100;
        const y = ((rowStart - 1) / 6) * 100;
        
        return { x, y };
      }
    } catch (error) {
      console.error('Error parsing position class:', error);
    }
    
    // Default position if parsing fails
    return { x: 10, y: 40 };
  };
  
  // Helper function to convert x,y coordinates to grid position classes
  const convertPositionToGridClasses = (position: Position): string => {
    // Convert percentage positions back to grid coordinates
    // This is a simplified implementation - adapt to your grid system
    const colStart = Math.floor((position.x / 100) * 12) + 1;
    const colEnd = colStart + 3; // Assuming buttons span 3 columns
    const rowStart = Math.floor((position.y / 100) * 6) + 1;
    const rowEnd = rowStart + 1; // Assuming buttons span 1 row
    
    return `col-start-${colStart} col-end-${colEnd} row-start-${rowStart} row-end-${rowEnd}`;
  };
  
  // Update the parent component when elements change
  const syncToHtmlElements = () => {
    if (!onUpdateElements) return;
    
    // Create a deep copy of htmlElements to modify
    const updatedElements = htmlElements.map(element => {
      // If this element has a draggable counterpart, update its position
      if (draggableElements[element.id]) {
        const draggable = draggableElements[element.id];
        const gridPosition = convertPositionToGridClasses(draggable.position);
        
        // Return a new element with updated htmlTag
        return {
          ...element,
          htmlTag: {
            ...element.htmlTag,
            text: draggable.text,
            link: draggable.link,
            style: draggable.style,
            position: gridPosition
          }
        };
      }
      
      // If no changes, return original element
      return element;
    });
    
    onUpdateElements(updatedElements);
  };
  
  // Call syncToHtmlElements whenever draggableElements changes
  useEffect(() => {
    syncToHtmlElements();
  }, [draggableElements]);
  
  // Handle element position changes
  const handlePositionChange = (elementId: string, newPosition: Position) => {
    setDraggableElements(prev => ({
      ...prev,
      [elementId]: {
        ...prev[elementId],
        position: newPosition
      }
    }));
  };
  
  // Handle dropping new elements onto the hero
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    try {
      const buttonData = JSON.parse(e.dataTransfer.getData('application/json'));
      
      if (!heroRef.current) return;
      
      const heroRect = heroRef.current.getBoundingClientRect();
      
      // Calculate drop position within hero container as percentages
      const percentX = ((e.clientX - heroRect.left) / heroRect.width) * 100;
      const percentY = ((e.clientY - heroRect.top) / heroRect.height) * 100;
      
      // Constrain to boundaries
      const buttonWidthPercent = buttonData.style === 'primary' ? 20 : 15;
      const buttonHeightPercent = 8;
      
      const constrainedX = Math.max(0, Math.min(percentX, 100 - buttonWidthPercent));
      const constrainedY = Math.max(0, Math.min(percentY, 100 - buttonHeightPercent));
      
      // Generate a unique ID for the new element
      const newElementId = `new-${Date.now()}`;
      
      // Add to draggable elements
      setDraggableElements(prev => ({
        ...prev,
        [newElementId]: {
          text: buttonData.text,
          link: buttonData.link,
          style: buttonData.style,
          position: { x: constrainedX, y: constrainedY }
        }
      }));
      
      // Create a new HtmlElement and add it to htmlElements
      const newHtmlElement: HtmlElement = {
        id: newElementId,
        designElementId: `design-${Date.now()}`,
        htmlTag: {
          type: 'button',
          text: buttonData.text,
          link: buttonData.link,
          style: buttonData.style,
          position: convertPositionToGridClasses({ x: constrainedX, y: constrainedY })
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // If onUpdateElements is provided, add the new element
      if (onUpdateElements) {
        onUpdateElements([...htmlElements, newHtmlElement]);
      }
    } catch (error) {
      console.error('Error processing dropped item:', error);
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Allow dropping
  };
  
  // Handle creating a new button
  const handleButtonCreate = (buttonData: Omit<DraggableButtonData, 'position'>) => {
    // Default position for new buttons
    const position = { x: 10, y: 40 };
    
    // Generate a unique ID for the new element
    const newElementId = `new-${Date.now()}`;
    
    // Add to draggable elements
    setDraggableElements(prev => ({
      ...prev,
      [newElementId]: {
        ...buttonData,
        position
      }
    }));
    
    // Create a new HtmlElement and add it to htmlElements
    const newHtmlElement: HtmlElement = {
      id: newElementId,
      designElementId: `design-${Date.now()}`,
      htmlTag: {
        type: 'button',
        text: buttonData.text,
        link: buttonData.link,
        style: buttonData.style,
        position: convertPositionToGridClasses(position)
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // If onUpdateElements is provided, add the new element
    if (onUpdateElements) {
      onUpdateElements([...htmlElements, newHtmlElement]);
    }
  };

  // Handle removing a button
  const handleRemoveButton = (elementId: string) => {
    // Remove from draggable elements
    setDraggableElements(prev => {
      const newState = { ...prev };
      delete newState[elementId];
      return newState;
    });
    
    // Remove from htmlElements
    if (onUpdateElements) {
      onUpdateElements(htmlElements.filter(element => element.id !== elementId));
    }
  };
  
  return (
    <div className='relative'>
      <div className='w-full min-h-screen flex flex-col'>
        {/* Background (covers entire layout) */}
        <div className='fixed inset-0 z-0'>
          <BackgroundTransition backgroundGradient={backgroundGradient} />
        </div>

        {/* Main content wrapper */}
        <div className='flex flex-col flex-grow z-10 overflow-x-hidden'>
          {/* Hero Container (fixed height) - This is the drop target */}
          <div 
            ref={heroRef}
            className='w-full z-[5] h-[70vh] md:h-[52vh] pt-16 lg:pt-0 relative'
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <Hero image={heroImage}>
              {/* Display original HTML elements from the data */}
              <HeroElements htmlTags={htmlElements} />
              
              {/* Display draggable buttons - only on desktop */}
              {Object.entries(draggableElements).map(([id, element]) => (
                <DraggableButton 
                  key={id}
                  elementId={id}
                  element={element}
                  onPositionChange={handlePositionChange}
                  heroRef={heroRef}
                />
              ))}
            </Hero>
          </div>

          {/* Background Transition */}
          {transitionGradient && (
            <div className='w-full z-[5] h-[200px] relative justify-center'>
              <BlurTransition color={transitionGradient} blur={40} className='bottom-0 h-[230px]' />
            </div>
          )}

          {/* Main Content */}
          <div className='flex-grow z-[5] pt-16 lg:pt-0 lg:ml-[300px]'>
            {/* Button Factory content would go here */}
          </div>
        </div>
        
        {/* Sidebar with Button Factory */}
        <div className='fixed top-0 left-0 bottom-0 z-[10] py-4 px-3 hidden lg:block w-[300px]'>
          <div className='h-screen overflow-y-auto pb-48'>
            <div className='h-full md:hidden lg:w-full rounded-2xl bg-[#1B1B1B] px-4 py-6 lg:flex flex-col justify-between hidden shadow-[0_0_40px_0_rgba(62,74,192,0.24)]'>
              <h2 className="text-white text-xl font-bold mb-6">Design Tools</h2>
              
              <ButtonFactory onButtonCreate={handleButtonCreate} />
              
              <div className="mt-6">
                <h3 className="text-white font-medium mb-3">Placed Elements</h3>
                <div className="space-y-2">
                  {Object.entries(draggableElements).map(([id, element]) => (
                    <div 
                      key={id} 
                      className="flex justify-between items-center bg-gray-800 p-2 rounded text-white text-sm"
                    >
                      <span>{element.text} ({element.style})</span>
                      <button 
                        className="text-red-400 hover:text-red-300"
                        onClick={() => handleRemoveButton(id)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDesignLayout;