import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { useTheme } from '../../store/features/ui/useUITheme';
import { cn } from '../../lib/utils';

interface InfoPopupProps {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const InfoPopup:React.FC<InfoPopupProps> = ({ content, position = 'top' }) => {
  const [isHovering, setIsHovering] = useState(false);
  const { isDark } = useTheme();
  
  // Get theme colors based on current theme
  const themeColors = isDark ? {
    iconColor: 'text-teal-400', // Approximating the accent color
    bgColor: 'bg-gray-800', // Approximating dark.background
    textColor: 'text-gray-100', // Approximating dark.text.primary
    borderColor: 'border-gray-700' // Approximating dark.border
  } : {
    iconColor: 'text-rose-600', // light.accent
    bgColor: 'bg-white', // light.background
    textColor: 'text-slate-700', // light.text.primary
    borderColor: 'border-slate-200' // light.border
  };
  
  // Calculate popup position classes based on the position prop
  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full mb-2';
      case 'bottom':
        return 'top-full mt-2';
      case 'left':
        return 'right-full mr-2';
      case 'right':
        return 'left-full ml-2';
      default:
        return 'bottom-full mb-2';
    }
  };
  
  return (
    <div className="relative inline-flex items-center">
      <div
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="cursor-help"
      >
        <Info 
          size={20} 
          className={cn(themeColors.iconColor)}
        />
      </div>
      
      {isHovering && (
        <div 
          className={cn(
            "absolute w-64 text-sm p-2 rounded shadow-lg z-10 border",
            getPositionClasses(),
            themeColors.bgColor,
            themeColors.textColor,
            themeColors.borderColor
          )}
        >
          <div className="relative">
            {content}
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoPopup;