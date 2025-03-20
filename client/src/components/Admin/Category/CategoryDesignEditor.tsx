import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Save, X } from 'lucide-react';
import { useTheme } from '../../../store/features/ui/useUITheme';
import { useCategoryDesigns } from '../../../store/features/categoryDesigns/useCategoryDesigns';
import ButtonBase from '../Buttons/ButtonBase';
import HeroImage from '../../Hero/HeroImage';
import { cn } from '../../../lib/utils';

const GRID_COLS = 12;
const GRID_ROWS = 6;

interface ButtonPosition {
  col: number;
  row: number;
  colSpan: number;
  rowSpan: number;
  text: string;
}

const CategoryDesignEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { currentDesign, fetchDesignElementById, editDesignElement } = useCategoryDesigns();
  const [isButtonMenuOpen, setIsButtonMenuOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [buttons, setButtons] = useState<ButtonPosition[]>([]);
  const [currentButton, setCurrentButton] = useState<ButtonPosition | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      // Fetch the design element if not already loaded
      fetchDesignElementById(id);
    }
  }, [id, fetchDesignElementById]);

  useEffect(() => {
    // Initialize buttons from design's HTML elements if any
    if (currentDesign?.htmlElements) {
      const existingButtons: ButtonPosition[] = [];

      currentDesign.htmlElements.forEach(element => {
        const htmlTag = element.htmlTag;
        if (htmlTag.type === 'button' || (htmlTag.data && htmlTag.data.cta)) {
          const cta = htmlTag.data?.cta || htmlTag;
          
          // Parse grid position from CSS classes
          const colMatch = cta.position.match(/col-start-(\d+)/);
          const colSpanMatch = cta.position.match(/col-span-(\d+)/);
          const rowMatch = cta.position.match(/row-start-(\d+)/);
          const rowSpanMatch = cta.position.match(/row-span-(\d+)/);

          if (colMatch && rowMatch) {
            existingButtons.push({
              col: parseInt(colMatch[1]),
              row: parseInt(rowMatch[1]),
              colSpan: colSpanMatch ? parseInt(colSpanMatch[1]) : 2,
              rowSpan: rowSpanMatch ? parseInt(rowSpanMatch[1]) : 1,
              text: cta.text || 'Learn More'
            });
          }
        }
      });

      setButtons(existingButtons);
    }
  }, [currentDesign]);

  const handleBack = () => {
    navigate(-1);
  };

  const addButton = () => {
    const newButton: ButtonPosition = {
      col: 4,
      row: 4,
      colSpan: 4,
      rowSpan: 1,
      text: 'Learn More'
    };
    setButtons([...buttons, newButton]);
    setCurrentButton(newButton);
    setIsButtonMenuOpen(false);
  };

  const handleDragStart = (e: React.MouseEvent, button: ButtonPosition) => {
    setIsDragging(true);
    setCurrentButton(button);
    
    // Calculate grid cell size based on container dimensions
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    // Update button position to where the drag started
    const cellWidth = rect.width / GRID_COLS;
    const cellHeight = rect.height / GRID_ROWS;
    
    const col = Math.max(1, Math.min(GRID_COLS - button.colSpan + 1, Math.floor(offsetX / cellWidth) + 1));
    const row = Math.max(1, Math.min(GRID_ROWS - button.rowSpan + 1, Math.floor(offsetY / cellHeight) + 1));
    
    // Update position of current button
    setButtons(prevButtons => 
      prevButtons.map(b => b === button ? { ...b, col, row } : b)
    );
  };

  const handleDrag = (e: React.MouseEvent) => {
    if (!isDragging || !currentButton || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    // Calculate grid position
    const cellWidth = rect.width / GRID_COLS;
    const cellHeight = rect.height / GRID_ROWS;
    
    const col = Math.max(1, Math.min(GRID_COLS - currentButton.colSpan + 1, Math.floor(offsetX / cellWidth) + 1));
    const row = Math.max(1, Math.min(GRID_ROWS - currentButton.rowSpan + 1, Math.floor(offsetY / cellHeight) + 1));
    
    // Update position of current button
    setButtons(prevButtons => 
      prevButtons.map(b => b === currentButton ? { ...b, col, row } : b)
    );
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleRemoveButton = (button: ButtonPosition) => {
    setButtons(buttons.filter(b => b !== button));
    if (currentButton === button) {
      setCurrentButton(null);
    }
  };

  const handleSave = async () => {
    if (!currentDesign) return;
    
    setIsSaving(true);
    
    try {
      // Convert buttons to HTML elements
      const htmlElements = buttons.map(button => ({
        type: 'button',
        data: {
          cta: {
            type: 'primary',
            text: button.text,
            link: '#',
            position: `col-start-${button.col} col-span-${button.colSpan} row-start-${button.row} row-span-${button.rowSpan}`
          }
        }
      }));
      
      // Update design element
      await editDesignElement({
        id: currentDesign.id,
        htmlElements: htmlElements
      });
      
      // Navigate back
      navigate(-1);
    } catch (error) {
      console.error('Failed to save design:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateButtonText = (button: ButtonPosition, text: string) => {
    setButtons(prevButtons => 
      prevButtons.map(b => b === button ? { ...b, text } : b)
    );
  };

  const handleResizeButton = (button: ButtonPosition, colSpan: number) => {
    setButtons(prevButtons => 
      prevButtons.map(b => b === button ? { ...b, colSpan } : b)
    );
  };

  if (!currentDesign) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
          isDark ? 'border-dark-text-accent' : 'border-light-text-accent'
        }`}></div>
      </div>
    );
  }

  // Generate grid template columns and rows styles
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))`,
    gridTemplateRows: `repeat(${GRID_ROWS}, minmax(0, 1fr))`,
    width: '100%',
    height: '100%',
    position: 'relative' as const,
  };

  // Convert button position to grid area style
  const getButtonStyle = (button: ButtonPosition) => {
    return {
      gridColumnStart: button.col,
      gridColumnEnd: button.col + button.colSpan,
      gridRowStart: button.row,
      gridRowEnd: button.row + button.rowSpan,
    };
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header with back button and save button */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 flex justify-between items-center">
        <ButtonBase
          onClick={handleBack}
          leftIcon={<ArrowLeft size={20} />}
          variant="secondary"
        >
          Back
        </ButtonBase>
        
        <div className="flex gap-4">
          <ButtonBase
            onClick={() => setIsButtonMenuOpen(!isButtonMenuOpen)}
            leftIcon={<Plus size={20} />}
            variant="secondary"
          >
            Add Button
          </ButtonBase>
          
          <ButtonBase
            onClick={handleSave}
            leftIcon={<Save size={20} />}
            variant="primary"
            isLoading={isSaving}
          >
            Save Changes
          </ButtonBase>
        </div>
      </div>

      {/* Button menu */}
      {isButtonMenuOpen && (
        <div className="absolute top-20 right-4 z-20 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Add Element</h3>
            <button 
              onClick={() => setIsButtonMenuOpen(false)}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <X size={16} />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={addButton}
              className={cn(
                "p-2 rounded flex items-center gap-2",
                isDark ? "hover:bg-dark-surface" : "hover:bg-gray-100"
              )}
            >
              <span className="flex-shrink-0">
                <Plus size={16} />
              </span>
              <span>Primary Button</span>
            </button>
          </div>
        </div>
      )}

      {/* Editing controls for selected button */}
      {currentButton && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg w-96">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Edit Button</h3>
            <button 
              onClick={() => setCurrentButton(null)}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <X size={16} />
            </button>
          </div>
          
          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Button Text</label>
              <input
                type="text"
                value={currentButton.text}
                onChange={(e) => handleUpdateButtonText(currentButton, e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Width</label>
              <div className="flex gap-2">
                {[2, 4, 6, 8, 10].map(width => (
                  <button
                    key={width}
                    onClick={() => handleResizeButton(currentButton, width)}
                    className={cn(
                      "px-3 py-1 border rounded text-sm",
                      currentButton.colSpan === width 
                        ? "bg-blue-500 text-white border-blue-500" 
                        : "border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                    )}
                  >
                    {width}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between mt-2">
              <ButtonBase
                onClick={() => handleRemoveButton(currentButton)}
                variant="ghost"
                className="text-red-500"
              >
                Remove
              </ButtonBase>
              
              <ButtonBase
                onClick={() => setCurrentButton(null)}
                variant="secondary"
              >
                Done
              </ButtonBase>
            </div>
          </div>
        </div>
      )}

      {/* Main editor area with grid */}
      <div 
        className="min-h-screen relative"
        onMouseMove={handleDrag}
        onMouseUp={handleDragEnd}
        ref={containerRef}
      >
        {/* Background image and gradients */}
        <div className="absolute inset-0">
          {/* Background image */}
          <HeroImage src={currentDesign.image} alt="Design Preview" overlay={true} overlayOpacity={30} />
          
          {/* Background gradient if specified */}
          {currentDesign.backgroundGradient && (
            <div 
              className="absolute inset-0"
              style={{ background: currentDesign.backgroundGradient }}
            />
          )}
          
          {/* Transition gradient if specified */}
          {currentDesign.transitionGradient && (
            <div 
              className="absolute bottom-0 left-0 right-0 h-1/4 w-full"
              style={{ background: currentDesign.transitionGradient }}
            />
          )}
        </div>

        {/* Grid overlay for debugging (optional) */}
        <div className="absolute inset-0 pointer-events-none">
          <div style={gridStyle}>
            {Array.from({ length: GRID_COLS * GRID_ROWS }).map((_, index) => (
              <div 
                key={index}
                className="border border-white/10"
              />
            ))}
          </div>
        </div>

        {/* Draggable buttons */}
        <div className="absolute inset-0" style={gridStyle}>
          {buttons.map((button, index) => (
            <div
              key={index}
              style={getButtonStyle(button)}
              className={cn(
                "flex items-center justify-center p-2",
                currentButton === button ? "ring-2 ring-blue-500" : "",
                isDragging && currentButton === button ? "cursor-grabbing" : "cursor-pointer"
              )}
              onClick={() => setCurrentButton(button)}
              onMouseDown={(e) => handleDragStart(e, button)}
            >
              <button className='bg-transparent border-2 border-white text-white font-bold py-3 px-6 rounded-full hover:bg-white hover:text-purple-600 transition duration-300 w-full'>
                {button.text}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryDesignEditor;