import React, { CSSProperties } from 'react';
import { cn } from '../../lib/utils';

interface HeroContainerProps {
  children: React.ReactNode;
  background?: React.ReactNode;
  className?: string;
  columns?: number;
  rows?: number;
  fullHeight?: boolean;
  gapX?: number; // horizontal gap in pixels
  gapY?: number; // vertical gap in pixels
  padding?: {
    x?: number;
    y?: number;
  };
  // Media queries will be handled via className and CSS
  gridClassName?: string;
}

const HeroContainer: React.FC<HeroContainerProps> = ({
  children,
  background,
  className,
  columns = 12,
  rows = 6,
  fullHeight = false,
  gapX = 8,
  gapY = 8,
  padding = { x: 16, y: 0 },
  gridClassName,
}) => {
  // Create grid styles
  const gridStyles: CSSProperties = {
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
    gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
    columnGap: `${gapX}px`,
    rowGap: `${gapY}px`,
    padding: `${padding.y}px ${padding.x}px`
  };

  return (
    <div 
      className={cn(
        'relative w-full overflow-hidden',
        fullHeight ? 'h-full' : 'h-[70vh] md:h-[60vh]',
        className
      )}
    >
      {/* Background (HeroImage or other background component) */}
      {background && (
        <div className="absolute inset-0 w-full h-full z-0">
          {background}
        </div>
      )}
      
      {/* Grid container for positioning elements */}
      <div 
        className={cn("relative z-10 w-full h-full grid", gridClassName)}
        style={gridStyles}
      >
        {children}
      </div>
    </div>
  );
};

export default HeroContainer;