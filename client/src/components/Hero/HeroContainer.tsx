import React, {useMemo} from 'react';
import { cn } from '../../lib/utils';

interface HeroContainerProps {
  children: React.ReactNode;
  background?: React.ReactNode;
  className?: string;
  columns?: number;
  rows?: number;
  fullHeight?: boolean;
  // Media queries will be handled via className and CSS
  gridClassName?: string;
  minCellWidth?: number;
  minCellHeight?: number;
}

const HeroContainer: React.FC<HeroContainerProps> = ({
  children,
  background,
  className,
  columns = 12,
  rows = 6,
  fullHeight = false,
  gridClassName,
  minCellWidth = 80,
  minCellHeight = 80
}) => {
  // Create grid styles
  const gridStyles = useMemo(() => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, minmax(${minCellWidth}px, 1fr))`,
    gridTemplateRows: `repeat(${rows}, minmax(${minCellHeight}px, 1fr))`,
    width: '100%',
    height: '100%',
    minWidth: `${minCellWidth * columns}px`, // Ensure minimum grid width
    minHeight: `${minCellHeight * rows}px`,  // Ensure minimum grid height
    position: 'relative' as const,
    overflow: 'auto' as const
  }), [columns, rows, minCellWidth, minCellHeight]);

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