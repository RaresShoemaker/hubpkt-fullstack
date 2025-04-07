import React from 'react';

interface BackgroundTransitionProps {
  backgroundGradient?: string;
  nextBackgroundGradient?: string;
  opacity?: number;
  isTransitioning?: boolean;
}

const BackgroundTransition: React.FC<BackgroundTransitionProps> = ({
  backgroundGradient,
  nextBackgroundGradient,
  opacity = 1,
  isTransitioning = false,
}) => {
  return (
    <div className="relative w-full h-full">
      {/* Current background */}
      <div
        className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out"
        style={{
          background: `${backgroundGradient}`,
          opacity: opacity,
        }}
      />

      {/* Next background (only shown during transition) */}
      {isTransitioning && nextBackgroundGradient && (
        <div
          className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out"
          style={{
            background: `${nextBackgroundGradient}`,
            opacity: 1 - opacity,
          }}
        />
      )}
    </div>
  );
};

export default BackgroundTransition;