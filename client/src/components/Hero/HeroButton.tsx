import React from 'react';
import { cn } from '../../lib/utils';

export type ButtonStyle = 'primary' | 'secondary';

interface ButtonHeroProps {
  style?: ButtonStyle;
  text?: string;
  link?: string;
  className?: string;
  onClick?: () => void;
}

const ButtonHero: React.FC<ButtonHeroProps> = ({
  style = 'secondary',
  text = 'Button',
  link,
  className,
  onClick,
}) => {
  // Style mappings
  const styleClasses: Record<ButtonStyle, string> = {
    primary: 'rounded-full bg-primary text-white font-medium w-full h-12',
    secondary: 'bg-transparent border-2 border-white text-white font-bold py-3 px-6 rounded-full hover:bg-white hover:text-purple-600 transition duration-300 w-full',
  };

  const buttonElement = (
    <button 
      className={cn(styleClasses[style as ButtonStyle] || styleClasses.secondary, className)}
      onClick={onClick}
    >
      {text}
    </button>
  );

  // If there's a link, wrap the button in an anchor tag
  if (link) {
    return (
      <a href={link} className="w-full">
        {buttonElement}
      </a>
    );
  }

  return buttonElement;
};

export default ButtonHero;