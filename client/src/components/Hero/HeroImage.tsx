import React from 'react';
import { cn } from '../../lib/utils';

interface HeroImageProps {
  src: string;
  nextSrc?: string;
  alt?: string;
  overlay?: boolean;
  overlayColor?: string;
  overlayOpacity?: number;
  className?: string;
  transitionOpacity?: number;
  isTransitioning?: boolean;
}

const HeroImage: React.FC<HeroImageProps> = ({
  src,
  nextSrc,
  alt = 'Hero image',
  overlay = true,
  overlayColor = 'black',
  overlayOpacity = 30,
  className,
  transitionOpacity = 1,
  isTransitioning = false,
}) => {
  return (
    <div className={cn('relative inset-0 w-full h-full overflow-hidden', className)}>
      {/* Current Image */}
      <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out" style={{ opacity: transitionOpacity }}>
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          loading="eager"
        />
        
        {/* Optional overlay for current image */}
        {overlay && (
          <div 
            className="absolute inset-0 w-full h-full"
            style={{ 
              backgroundColor: overlayColor, 
              opacity: overlayOpacity / 100 
            }}
          />
        )}
      </div>
      
      {/* Next Image (only shown during transition) */}
      {isTransitioning && nextSrc && (
        <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out" style={{ opacity: 1 - transitionOpacity }}>
          <img
            src={nextSrc}
            alt={`Next ${alt}`}
            className="w-full h-full object-cover"
            loading="eager"
          />
          
          {/* Optional overlay for next image */}
          {overlay && (
            <div 
              className="absolute inset-0 w-full h-full"
              style={{ 
                backgroundColor: overlayColor, 
                opacity: overlayOpacity / 100 
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default HeroImage;