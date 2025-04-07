import React from 'react';
import HeroImage from './HeroImage';
import HeroContainer from './HeroContainer';

interface HeroProps {
  image?: string;
  nextImage?: string;
  transitionOpacity?: number;
  isTransitioning?: boolean;
  children?: React.ReactNode;
}

const Hero: React.FC<HeroProps> = ({
  image = "./Home1.jpg", 
  nextImage,
  transitionOpacity = 1,
  isTransitioning = false,
  children
}) => {
  return (
    <HeroContainer
      columns={12}
      rows={6}
      background={
        <HeroImage 
          src={image} 
          nextSrc={nextImage}
          alt='Hero image' 
          overlay={true} 
          overlayOpacity={30} 
          transitionOpacity={transitionOpacity}
          isTransitioning={isTransitioning}
        />
      }
    >
      {children}
    </HeroContainer>
  );
};

export default Hero;