import React from 'react';
import { cn } from '../lib/utils';

interface BlurTransitionProps {
  className?: string;
  color?: string;
  blur?: number;
}

const BlurTransition: React.FC<BlurTransitionProps> = ({ 
  className,
  color = '#090D23',
  blur = 44 
}) => {
  return (
    <div 
      className={cn("mb-[70px] md:mt-[-25px] mt-[-100px] md:mb-0 -ml-[100px] lg:mb-0 w-[160%] md:w-[135%]", className)}
      style={{
        position: 'absolute',
        background: color,
        filter: `blur(${blur}px)`,
        zIndex: 1
      }}
    />
  );
};

export default BlurTransition;