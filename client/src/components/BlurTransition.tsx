import React from 'react';
import { cn } from '../lib/utils';

interface BlurTransitionProps {
  className?: string;
  color?: string;
  nextColor?: string;
  blur?: number;
  opacity?: number;
  isTransitioning?: boolean;
}

const BlurTransition: React.FC<BlurTransitionProps> = ({ 
  className,
  color = '#090D23',
  nextColor,
  blur = 44,
  opacity = 1,
  isTransitioning = false
}) => {
  return (
    <div className="relative w-full h-full">
      {/* Current blur effect */}
      <div 
        className={cn("absolute mb-[70px] md:mb-0 -ml-[100px] lg:mb-0 w-[160%] md:w-[135%] transition-opacity duration-1000 ease-in-out", className)}
        style={{
          background: color,
          filter: `blur(${blur}px)`,
          zIndex: 1,
          opacity: opacity
        }}
      />
      
      {/* Next blur effect (only shown during transition) */}
      {isTransitioning && nextColor && (
        <div 
          className={cn("absolute mb-[70px] md:mb-0 -ml-[100px] lg:mb-0 w-[160%] md:w-[135%] transition-opacity duration-1000 ease-in-out", className)}
          style={{
            background: nextColor,
            filter: `blur(${blur}px)`,
            zIndex: 1,
            opacity: 1 - opacity
          }}
        />
      )}
    </div>
  );
};

export default BlurTransition;