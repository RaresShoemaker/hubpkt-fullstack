import React, { useState } from 'react';
import ButtonHero from '../../../Hero/HeroButton';
import { ButtonFactoryProps } from './types';

const ButtonFactory: React.FC<ButtonFactoryProps> = ({ onButtonCreate }) => {
  const [buttonType, setButtonType] = useState<'primary' | 'secondary'>('primary');
  const [buttonText, setButtonText] = useState<string>('Shop Now');
  const [buttonLink, setButtonLink] = useState<string>('/shop');
  
  const createButton = () => {
    onButtonCreate({
      link: buttonLink,
      text: buttonText,
      style: buttonType,
    });
  };

  const handleDragStart = (e: React.DragEvent) => {
    // Store the button data in the drag event
    e.dataTransfer.setData('application/json', JSON.stringify({
      link: buttonLink,
      text: buttonText,
      type: 'button' as const,
      style: buttonType
    }));
  };
  
  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h3 className="text-white font-medium mb-4">Button Factory</h3>
      
      <div className="mb-3">
        <label className="text-white text-sm block mb-1">Button Text</label>
        <input 
          type="text" 
          value={buttonText} 
          onChange={(e) => setButtonText(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600"
        />
      </div>
      
      <div className="mb-3">
        <label className="text-white text-sm block mb-1">Button Link</label>
        <input 
          type="text" 
          value={buttonLink} 
          onChange={(e) => setButtonLink(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600"
        />
      </div>
      
      <div className="mb-4">
        <label className="text-white text-sm block mb-1">Button Style</label>
        <select 
          value={buttonType} 
          onChange={(e) => setButtonType(e.target.value as 'primary' | 'secondary')}
          className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600"
        >
          <option value="primary">Primary</option>
          <option value="secondary">Secondary</option>
        </select>
      </div>
      
      <div className="space-y-4">
        <button 
          onClick={createButton}
          className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
        >
          Add to Hero
        </button>
        
        <div className="mt-4">
          <p className="text-white text-sm mb-2">Preview:</p>
          <div 
            className="w-full cursor-move"
            draggable
            onDragStart={handleDragStart}
          >
            <ButtonHero 
              style={buttonType}
              text={buttonText}
              link={undefined} // No link in preview
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ButtonFactory;