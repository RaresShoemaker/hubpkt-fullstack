import React from 'react';
import { cn } from '../../../lib/utils';

type Size = 'sm' | 'md' | 'lg' | 'custom';

interface CategoryIconProps {
  title: string;
  image: string;
  size?: Size;
  customSize?: string; // For custom tailwind classes
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ 
  image, 
  title, 
  size = 'sm', 
  customSize 
}) => {
  const getSizeClasses = (): string => {
    switch (size) {
      case 'sm':
        return 'w-7 h-7';
      case 'md':
        return 'w-9 h-9';
      case 'lg':
        return 'w-14 h-14';
      case 'custom':
        return customSize || 'w-7 h-7'; // Fallback to small if customSize is not provided
      default:
        return 'w-7 h-7';
    }
  };

  const sizeClasses = getSizeClasses();

  if (!image) {
    return (
      <div className={cn("bg-gray-200 rounded flex items-center justify-center", sizeClasses)}>
        <span className={cn("text-xs", size === 'lg' && 'text-base')}>?</span>
      </div>
    );
  }

  return (
    <img
      src={image}
      alt={title}
      className={cn(sizeClasses)}
    />
  );
};