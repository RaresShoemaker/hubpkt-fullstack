import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { SimplifiedDesign } from '../../utils/designTransformer'

interface DesignContextType {
  currentDesign: SimplifiedDesign | null;
  designs: SimplifiedDesign[];
  isTransitioning: boolean;
}

// Create context with default values
const DesignContext = createContext<DesignContextType>({
  currentDesign: null,
  designs: [],
  isTransitioning: false
});

interface DesignProviderProps {
  children: ReactNode;
  designs: SimplifiedDesign[];
  interval?: number;
}

export const DesignProvider: React.FC<DesignProviderProps> = ({ 
  children, 
  designs, 
  interval = 20000 // Default to 20 seconds
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentDesign, setCurrentDesign] = useState<SimplifiedDesign | null>(
    designs.length > 0 ? designs[0] : null
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState<string[]>([]);

  // Preload all images to avoid flickering during transitions
  useEffect(() => {
    if (designs.length > 0) {
      const imagesToPreload = designs.map(design => design.image);
      
      // Create an array of preloaded image promises
      const imagePromises = imagesToPreload.map(src => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = () => resolve(src);
          img.onerror = reject;
        });
      });

      // When all images are loaded, set them as preloaded
      Promise.all(imagePromises)
        .then(loadedImages => {
          setPreloadedImages(loadedImages as string[]);
          // Set initial design after images are loaded
          if (designs.length > 0) {
            setCurrentDesign(designs[0]);
          }
        })
        .catch(err => console.error('Failed to preload images:', err));
    }
  }, [designs]);

  // Handle design rotation
  useEffect(() => {
    if (designs.length <= 1 || preloadedImages.length === 0) return; // Don't rotate if there's only one design or images aren't preloaded

    const rotationTimer = setInterval(() => {
      // Start transition effect
      setIsTransitioning(true);
      
      // After a short transition delay, change the design
      setTimeout(() => {
        const nextIndex = (currentIndex + 1) % designs.length;
        setCurrentIndex(nextIndex);
        setCurrentDesign(designs[nextIndex]);
        
        // End transition effect after another short delay
        setTimeout(() => {
          setIsTransitioning(false);
        }, 500);
      }, 500);
    }, interval);

    return () => clearInterval(rotationTimer);
  }, [designs, currentIndex, interval, preloadedImages]);

  const value = {
    currentDesign,
    designs,
    isTransitioning
  };

  return (
    <DesignContext.Provider value={value}>
      {children}
    </DesignContext.Provider>
  );
};

// Custom hook to use the design context
export const useDesignRotation = () => useContext(DesignContext);