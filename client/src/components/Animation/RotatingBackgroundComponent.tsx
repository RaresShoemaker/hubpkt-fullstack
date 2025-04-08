import React from 'react';
import BackgroundTransition from '../BackgroundTransition';
import { useDesignRotation } from '../../context/AnimationContext/DesignRotationCotext';

const RotatingBackground: React.FC = () => {
  const { currentDesign, isTransitioning } = useDesignRotation();

  if (!currentDesign) {
    return <BackgroundTransition backgroundGradient="#090D23" />;
  }

  return (
    <div className="relative w-full h-full">
      <div 
        className="w-full h-full transition-opacity duration-1000"
        style={{ opacity: isTransitioning ? 0 : 1 }}
      >
        <BackgroundTransition backgroundGradient={currentDesign.backgroundGradient} />
      </div>
    </div>
  );
};

export default RotatingBackground;