import React from 'react';
import BlurTransition from '../BlurTransition';
import { useDesignRotation } from '../../context/AnimationContext/DesignRotationContext';

interface RotatingBlurTransitionProps {
  className?: string;
  blur?: number;
}

const RotatingBlurTransition: React.FC<RotatingBlurTransitionProps> = ({ 
  className = 'h-[230px]',
  blur = 40
}) => {
  const { currentIndex, designs } = useDesignRotation();

  if (designs.length === 0) {
    return <BlurTransition color="#090D23" blur={blur} className={className} />;
  }

  return (
    <div className="relative w-full">
      {designs.map((design, index) => (
        <div
          key={index}
          className="absolute inset-0 w-full transition-opacity duration-700"
          style={{
            opacity: index === currentIndex ? 1 : 0,
            zIndex: index === currentIndex ? 1 : 0
          }}
        >
          <BlurTransition 
            color={design.transitionGradient} 
            blur={blur}
            className={className}
          />
        </div>
      ))}
    </div>
  );
};

export default RotatingBlurTransition;