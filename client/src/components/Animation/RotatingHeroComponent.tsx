import React from 'react';
import Hero from '../Hero/Hero';
import HeroElements from '../Hero/HeroElements';
import { useDesignRotation } from '../../context/AnimationContext/DesignRotationContext';

const RotatingHero: React.FC = () => {
  const { currentDesign, isTransitioning } = useDesignRotation();

  if (!currentDesign) {
    return <Hero image="./Home1.jpg" />;
  }

  return (
    <div className="relative w-full h-full">
      <div 
        className="w-full h-full transition-opacity duration-1000"
        style={{ opacity: isTransitioning ? 0 : 1 }}
      >
        <Hero image={currentDesign.image}>
          {currentDesign.htmlElements && (
            <HeroElements htmlTags={currentDesign.htmlElements} />
          )}
        </Hero>
      </div>
    </div>
  );
};

export default RotatingHero;