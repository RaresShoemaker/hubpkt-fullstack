import React, { useState } from 'react';
import ButtonHero, { ButtonStyle } from '../../../Hero/HeroButton';

interface ButtonFactoryProps {
  onCreateButton: (buttonData: { text: string; style: ButtonStyle; link: string }) => void;
}

const ButtonFactory: React.FC<ButtonFactoryProps> = ({ onCreateButton }) => {
  const [buttonText, setButtonText] = useState<string>('Learn More');
  const [buttonStyle, setButtonStyle] = useState<ButtonStyle>('primary');
  const [buttonLink, setButtonLink] = useState<string>('#');
  
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setButtonText(e.target.value);
  };

  const handleStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setButtonStyle(e.target.value as ButtonStyle);
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setButtonLink(e.target.value);
  };
  
  const handleCreateButton = () => {
    onCreateButton({
      text: buttonText,
      style: buttonStyle,
      link: buttonLink
    });
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h3 className="text-white font-medium mb-4">Create Button</h3>
      
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
      
      <div>
        <button 
          onClick={handleCreateButton}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Create Element
        </button>
        
        <div className="mt-4">
          <p className="text-white text-sm mb-2">Preview:</p>
          <div className="w-full">
            <ButtonHero 
              style={buttonStyle}
              text={buttonText}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ButtonFactory;