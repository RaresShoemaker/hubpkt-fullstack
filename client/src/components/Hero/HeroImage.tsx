import React from 'react';
import { cn } from '../../lib/utils';

interface HeroImageProps {
  src: string;
  alt?: string;
  overlay?: boolean;
  overlayColor?: string;
  overlayOpacity?: number;
  className?: string;
}

const HeroImage: React.FC<HeroImageProps> = ({
  src,
  alt = 'Hero image',
  overlay = true,
  overlayColor = 'black',
  overlayOpacity = 30,
  className,
}) => {
  return (
    <div className={cn('absolute inset-0 w-full h-full overflow-hidden', className)}>
      {/* Image */}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        loading="eager"
      />
      
      {/* Optional overlay for better text readability */}
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
  );
};

export default HeroImage;