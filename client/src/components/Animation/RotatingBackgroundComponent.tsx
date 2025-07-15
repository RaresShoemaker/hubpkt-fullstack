import React from 'react';
import BackgroundTransition from '../BackgroundTransition';
import { useDesignRotation } from '../../context/AnimationContext/DesignRotationContext';

const RotatingBackground: React.FC = () => {
  const { currentIndex, designs } = useDesignRotation();

  if (designs.length === 0) {
    return <BackgroundTransition backgroundGradient="#090D23" />;
  }

  return (
    <div className="relative w-full h-full">
      {designs.map((design, index) => (
        <div
          key={index}
          className="absolute inset-0 w-full h-full transition-opacity duration-[3s]"
          style={{
            opacity: index === currentIndex ? 1 : 0,
            zIndex: index === currentIndex ? 1 : 0
          }}
        >
          <BackgroundTransition backgroundGradient={design.backgroundGradient} />
        </div>
      ))}
    </div>
  );
};

export default RotatingBackground;