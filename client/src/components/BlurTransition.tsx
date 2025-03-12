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
      className={cn("w-full", className)}
      style={{
        position: 'absolute',
        background: color,
        filter: `blur(${blur}px)`,
        width: '120%',
        zIndex: 1
      }}
    />
  );
};

export default BlurTransition;