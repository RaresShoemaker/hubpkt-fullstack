import React, { useState } from 'react';
import { ButtonStyle } from '../../../Hero/HeroButton';

interface ButtonEditorProps {
  id: string;
  text: string;
  style: ButtonStyle;
  position?: {
    colStart: number;
    rowStart: number;
    colSpan: number;
    rowSpan: number;
  };
  onUpdate: (id: string, updates: { 
    text?: string; 
    style?: ButtonStyle;
    position?: {
      colStart?: number;
      rowStart?: number;
      colSpan?: number;
      rowSpan?: number;
    }
  }) => void;
  onDelete: (id: string) => void;
}

const ButtonEditor: React.FC<ButtonEditorProps> = ({
  id,
  text,
  style,
  position = { colStart: 1, rowStart: 1, colSpan: 2, rowSpan: 1 },
  onUpdate,
  onDelete
}) => {
  const [buttonText, setButtonText] = useState(text);
  const [buttonStyle, setButtonStyle] = useState<ButtonStyle>(style);
  const [colSpan, setColSpan] = useState(position.colSpan);
  const [rowSpan, setRowSpan] = useState(position.rowSpan);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setButtonText(e.target.value);
  };

  const handleStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setButtonStyle(e.target.value as ButtonStyle);
  };

  const handleColSpanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= 12) {
      setColSpan(value);
    }
  };

  const handleRowSpanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= 6) {
      setRowSpan(value);
    }
  };

  const handleApply = () => {
    onUpdate(id, { 
      text: buttonText, 
      style: buttonStyle,
      position: {
        colSpan,
        rowSpan
      }
    });
  };

  const handleDelete = () => {
    onDelete(id);
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
        <label className="text-white text-sm block mb-1">Button Size</label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-white text-xs block mb-1">Width (columns)</label>
            <input 
              type="number" 
              min="1" 
              max="12" 
              value={colSpan} 
              onChange={handleColSpanChange}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600"
            />
          </div>
          <div>
            <label className="text-white text-xs block mb-1">Height (rows)</label>
            <input 
              type="number" 
              min="1" 
              max="6" 
              value={rowSpan} 
              onChange={handleRowSpanChange}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600"
            />
          </div>
        </div>
        <p className="text-gray-400 text-xs mt-1">Columns: 1-12, Rows: 1-6</p>
      </div>
      
      <div className="flex gap-2">
        <button 
          onClick={handleApply}
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