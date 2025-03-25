import React, { useEffect, useState } from 'react';
import { ButtonStyle } from '../../../Hero/HeroButton';
import { createPositionClasses } from '../../../../utils/designElementUtils';
import { useCategoryDesigns } from '../../../../store/features/categoryDesigns/useCategoryDesigns';

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

interface ButtonEditorProps {
  initialValue: ButtonElementData;
  onUpdate: (id: string, updates: Partial<ButtonElementData>) => void;
  onDelete: (id: string) => void;
}

const ButtonEditor: React.FC<ButtonEditorProps> = ({
  initialValue,
  onUpdate,
  onDelete
}) => {
  const { editHtmlElement } = useCategoryDesigns();
  const [buttonText, setButtonText] = useState<string>('');
  const [buttonStyle, setButtonStyle] = useState<ButtonStyle>('primary');
  const [buttonLink, setButtonLink] = useState<string>('');
  
  // Track the current position separately from other button properties
  const [currentPosition, setCurrentPosition] = useState(initialValue.position);

  useEffect(() => {
    if(initialValue) {
      setButtonText(initialValue.text);
      setButtonStyle(initialValue.style);
      setButtonLink(initialValue.link);
      setCurrentPosition(initialValue.position);
    }
  }, [initialValue]);

  // This effect updates the current position when it changes from outside
  useEffect(() => {
    setCurrentPosition(initialValue.position);
  }, [initialValue.position]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setButtonText(e.target.value);
  };

  const handleStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setButtonStyle(e.target.value as ButtonStyle);
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setButtonLink(e.target.value);
  };

  const handleApplyChanges = async () => {
    const updatedButton = {
      text: buttonText,
      style: buttonStyle,
      link: buttonLink,
      position: currentPosition // Use the current position instead of initialValue.position
    };

    await editHtmlElement({
      id: initialValue.id,
      htmlTag: {
        ...updatedButton,
        type: 'button',
        position: createPositionClasses(updatedButton.position)
      }
    });
  
    // Call the onUpdate function with the updated data
    onUpdate(initialValue.id, updatedButton);
  };

  const handleDelete = () => {
    onDelete(initialValue.id);
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h3 className="text-white font-medium mb-4">Edit Button</h3>
      
      <div className="mb-3">
        <label className="text-white text-sm block mb-1">Button Text</label>
        <input 
          type="text" 
          value={buttonText} 
          onChange={handleTextChange}
          className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600"
        />
      </div>

      <div className="mb-3">
        <label className="text-white text-sm block mb-1">Button Link</label>
        <input 
          type="text" 
          value={buttonLink} 
          onChange={handleLinkChange}
          className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600"
        />
      </div>
      
      <div className="mb-4">
        <label className="text-white text-sm block mb-1">Button Style</label>
        <select 
          value={buttonStyle} 
          onChange={handleStyleChange}
          className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600"
        >
          <option value="primary">Primary</option>
          <option value="secondary">Secondary</option>
        </select>
      </div>
      
      <div className="mb-4">
        <label className="text-white text-sm block mb-1">Button Position</label>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div>
            <label className="text-gray-400 text-xs">Column Start</label>
            <div className="text-white bg-gray-700 px-3 py-2 rounded border border-gray-600">
              {currentPosition.colStart}
            </div>
          </div>
          <div>
            <label className="text-gray-400 text-xs">Column Span</label>
            <div className="text-white bg-gray-700 px-3 py-2 rounded border border-gray-600">
              {currentPosition.colSpan}
            </div>
          </div>
          <div>
            <label className="text-gray-400 text-xs">Row Start</label>
            <div className="text-white bg-gray-700 px-3 py-2 rounded border border-gray-600">
              {currentPosition.rowStart}
            </div>
          </div>
          <div>
            <label className="text-gray-400 text-xs">Row Span</label>
            <div className="text-white bg-gray-700 px-3 py-2 rounded border border-gray-600">
              {currentPosition.rowSpan}
            </div>
          </div>
        </div>
        <p className="text-gray-400 text-xs mt-1">Position is set by dragging in the grid. Columns: 1-12, Rows: 1-6</p>
      </div>
      
      <div className="flex gap-2">
        <button 
          onClick={handleApplyChanges}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Apply
        </button>
        
        <button 
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ButtonEditor;