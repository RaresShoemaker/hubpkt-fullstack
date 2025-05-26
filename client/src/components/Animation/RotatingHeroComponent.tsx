"use client"

import React, { useEffect } from 'react';
import Hero from '../Hero/Hero';
import HeroElements from '../Hero/HeroElements';
import { useDesignRotation } from '../../context/AnimationContext/DesignRotationContext';

const RotatingHero: React.FC = () => {
  const { currentIndex, designs } = useDesignRotation();

  // Preload all images
  useEffect(() => {
    designs.forEach(design => {
      const img = new Image();
      img.src = design.image;
    });
  }, [designs]);

  if (designs.length === 0) {
    return <Hero image="./Home1.jpg" />;
  }

  return (
    <div className="relative w-full h-full">
      {designs.map((design, index) => (
        <div
          key={index}
          className="absolute inset-0 w-full h-full transition-opacity duration-1000"
          style={{
            opacity: index === currentIndex ? 1 : 0,
            zIndex: index === currentIndex ? 1 : 0
          }}
        >
          <Hero image={design.image}>
            {design.htmlElements && (
              <HeroElements htmlTags={design.htmlElements} />
            )}
          </Hero>
        </div>
      ))}
    </div>
  );
};

export default RotatingHero;