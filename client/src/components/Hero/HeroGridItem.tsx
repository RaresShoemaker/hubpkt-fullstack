import React from 'react';
import { cn } from '../../lib/utils';

interface HeroGridItemProps {
  children: React.ReactNode;
  className?: string;
  // Responsive positioning using explicit classes
  gridClasses?: string;
  // Alignment
  align?: 'start' | 'center' | 'end';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  // For direct style-based positioning (alternative to classes)
  style?: React.CSSProperties;
}

const HeroGridItem: React.FC<HeroGridItemProps> = ({
  children,
  className,
  gridClasses = 'col-span-12',
  align = 'center',
  justify = 'center',
  style,
}) => {
  // Get alignment classes
  const getAlignmentClasses = () => {
    let alignClasses = 'flex ';
    
    // Vertical alignment
    if (align === 'start') alignClasses += 'items-start ';
    else if (align === 'end') alignClasses += 'items-end ';
    else alignClasses += 'items-center ';
    
    // Horizontal alignment
    if (justify === 'start') alignClasses += 'justify-start';
    else if (justify === 'end') alignClasses += 'justify-end';
    else if (justify === 'between') alignClasses += 'justify-between';
    else if (justify === 'around') alignClasses += 'justify-around';
    else alignClasses += 'justify-center';
    
    return alignClasses;
  };
  
  return (
    <div
      className={cn(
        // Grid positioning from provided classes
        gridClasses,
        
        // Alignment classes
        getAlignmentClasses(),
        
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
};

export default HeroGridItem;