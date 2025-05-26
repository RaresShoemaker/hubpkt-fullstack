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
  const { currentDesign, isTransitioning } = useDesignRotation();

  if (!currentDesign) {
    return <BlurTransition color="#090D23" blur={blur} className={className} />;
  }

  return (
    <div className="relative w-full">
      <div 
        className="w-full transition-opacity duration-1000"
        style={{ opacity: isTransitioning ? 0 : 1 }}
      >
        <BlurTransition 
          color={currentDesign.transitionGradient} 
          blur={blur}
          className={className}
        />
      </div>
    </div>
  );
};

export default RotatingBlurTransition;