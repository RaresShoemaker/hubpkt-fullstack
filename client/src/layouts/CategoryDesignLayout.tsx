import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DraggableButtonData } from '../components/Admin/Category/CategoryDesign/types';
import Hero from '../components/Hero/Hero';
import HeroElements from '../components/Hero/HeroElements';
import BlurTransition from '../components/BlurTransition';
import BackgroundTransition from '../components/BackgroundTransition';
import DraggableButton from '../components/Admin/Category/CategoryDesign/DraggableButton';
import ButtonFactory from '../components/Admin/Category/CategoryDesign/ButtonFactory';
import { CategoryDesignLayoutProps, Position } from '../components/Admin/Category/CategoryDesign/types';
import { useCategoryDesigns } from '../store/features/categoryDesigns/useCategoryDesigns';
import ButtonBase from '../components/Admin/Buttons/ButtonBase';
import { Save, ArrowLeft } from 'lucide-react';

const CategoryDesignLayout: React.FC<CategoryDesignLayoutProps> = ({
  heroImage,
  backgroundGradient,
  transitionGradient,
  htmlElements = [],
}) => {
  // Navigation
  const navigate = useNavigate();
  
  // Category design state
  const { currentDesign, getDesignById, editDesignElement, addHtmlElement, removeHtmlElement, loading, error } = useCategoryDesigns();
  
  // Local state for draggable elements
  const [draggableElements, setDraggableElements] = useState<{[id: string]: DraggableButtonData}>({});
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Initialize draggable elements from htmlElements on first render
  useEffect(() => {
    const initialDraggableElements: {[id: string]: DraggableButtonData} = {};
    
    htmlElements.forEach(element => {
      if (element.htmlTag.type === 'button') {
        // Parse position from string "col-start-X col-end-Y row-start-Z row-end-W" to x, y coordinates
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
    setHasUnsavedChanges(false);
  }, [htmlElements]);

  // Update draggable elements when currentDesign changes (after a refresh)
  useEffect(() => {
    if (currentDesign && currentDesign.htmlElements) {
      const updatedDraggableElements: {[id: string]: DraggableButtonData} = {};
      
      // Process all HTML elements from the current design
      currentDesign.htmlElements.forEach(element => {
        if (element.htmlTag.type === 'button') {
          // Parse position from string to x, y coordinates
          const position = parsePositionFromGridClasses(element.htmlTag.position || '');
          
          updatedDraggableElements[element.id] = {
            text: element.htmlTag.text || '',
            link: element.htmlTag.link || '',
            style: element.htmlTag.style || 'secondary',
            position
          };
        }
      });
      
      // Only update if it's different to avoid infinite loops
      if (JSON.stringify(Object.keys(updatedDraggableElements)) !== 
          JSON.stringify(Object.keys(draggableElements))) {
        setDraggableElements(updatedDraggableElements);
      }
    }
  }, [currentDesign]);
  
  // Helper function to parse grid position classes to x,y coordinates
  const parsePositionFromGridClasses = (positionClass: string): Position => {
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
    const colStart = Math.floor((position.x / 100) * 12) + 1;
    const rowStart = Math.floor((position.y / 100) * 6) + 1;
    
    return `col-start-${colStart} col-span-2 row-start-${rowStart} row-span-1`;
  };
  
  // Handle element position changes (just update local state, don't save to API yet)
  const handlePositionChange = (elementId: string, newPosition: Position) => {
    setDraggableElements(prev => ({
      ...prev,
      [elementId]: {
        ...prev[elementId],
        position: newPosition
      }
    }));
    setHasUnsavedChanges(true);
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
      
      // Generate a unique ID for the new element (temporary ID for local state only)
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
      
      setHasUnsavedChanges(true);
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
    
    // Generate a unique ID for the new element (temporary ID for local state only)
    const newElementId = `new-${Date.now()}`;
    
    // Add to draggable elements
    setDraggableElements(prev => ({
      ...prev,
      [newElementId]: {
        ...buttonData,
        position
      }
    }));
    
    setHasUnsavedChanges(true);
  };

  // Handle removing a button
  const handleRemoveButton = (elementId: string) => {    
    if (!elementId.startsWith('new-')) {
      removeHtmlElement(elementId);
    }

    setHasUnsavedChanges(true);

    // Remove from the draggable elements state
    setDraggableElements(prev => {
      const newState = { ...prev };
      delete newState[elementId];
      return newState;
    });

  };
  
  // Save all changes to the API
  const handleSave = async () => {
    if (!currentDesign) {
      console.error('No current design to save changes to');
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Step 1: First update the basic design element properties (without HTML elements)
      await editDesignElement({
        id: currentDesign.id,
        backgroundGradient: currentDesign.backgroundGradient,
        transitionGradient: currentDesign.transitionGradient
      });
      
      // Step 2: Process all draggable elements - separate new and existing elements
      const existingElements = [];
      const newElements = [];
      
      for (const [id, element] of Object.entries(draggableElements)) {
        const gridPosition = convertPositionToGridClasses(element.position);
        
        if (id.startsWith('new-')) {
          // Collect new elements to be created
          newElements.push({
            type: 'button',
            text: element.text,
            link: element.link || '#',
            style: element.style || 'primary',
            position: gridPosition
          });
        } else {
          // Collect existing elements to be updated
          existingElements.push({
            id,
            type: 'button',
            text: element.text,
            link: element.link || '#',
            style: element.style || 'primary',
            position: gridPosition
          });
        }
      }
      
      // Step 3: Handle existing elements using editDesignElement if there are any
      if (existingElements.length > 0) {
        await editDesignElement({
          id: currentDesign.id,
          htmlElements: existingElements
        });
      }
      
      // Step 4: Create new HTML elements individually using addHtmlElement
      for (const element of newElements) {
        await addHtmlElement({
          designElementId: currentDesign.id,
          htmlTag: element
        });
      }
      
      // Success - update state
      setHasUnsavedChanges(false);
      
      // Refresh the design to show updated elements and clear any stale state
      await getDesignById(currentDesign.id);
      
      // Temporarily clear draggable elements to prevent duplicates
      // The useEffect for currentDesign will repopulate it with fresh data
      setDraggableElements({});
      
    } catch (err) {
      console.error('Error saving design elements:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    if (hasUnsavedChanges) {
      if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };
  
  return (
    <div className='relative'>
      {/* Header with back button and save button */}
      <div className="fixed top-0 left-0 right-0 z-20 p-4 flex justify-between items-center">
        <ButtonBase
          onClick={handleBack}
          leftIcon={<ArrowLeft size={20} />}
          variant="secondary"
        >
          Back
        </ButtonBase>
        
        <ButtonBase
          onClick={handleSave}
          leftIcon={<Save size={20} />}
          variant={hasUnsavedChanges ? "primary" : "secondary"}
          isLoading={isSaving}
          disabled={!hasUnsavedChanges || loading}
        >
          Save Changes
        </ButtonBase>
      </div>
      
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
        </div>
        
        {/* Sidebar with Button Factory */}
        <div className='fixed top-0 left-0 bottom-0 z-[10] py-4 px-3 hidden lg:block w-[300px]'>
          <div className='h-screen overflow-y-auto pb-48 pt-16'>
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
              
              {/* Save button in sidebar */}
              <div className="mt-6">
                <ButtonBase
                  onClick={handleSave}
                  leftIcon={<Save size={20} />}
                  variant={hasUnsavedChanges ? "primary" : "secondary"}
                  isLoading={isSaving}
                  disabled={!hasUnsavedChanges || loading}
                  className="w-full"
                >
                  Save Changes
                </ButtonBase>
                
                {error && (
                  <p className="text-red-400 text-sm mt-2">{error}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDesignLayout;