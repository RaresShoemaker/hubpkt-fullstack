import { useState, useEffect } from 'react';
import { DesignElement } from '../store/features/categoryDesigns/categoryDesigns.types';

/**
 * Custom hook to handle smooth transitions between design elements
 * @param designs Array of design elements to transition between
 * @param interval Time in milliseconds between transitions (default: 20000ms)
 * @param fadeTime Time in milliseconds for the fade transition (default: 1000ms)
 * @returns Object with current design and opacity state for transitions
 */
export function useDesignTransition(
  designs: DesignElement[],
  interval: number = 5000,
  fadeTime: number = 1000
) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState<number | null>(null);
  const [opacity, setOpacity] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Don't do anything if there are fewer than 2 designs
    if (!designs || designs.length < 2) return;

    // Set initial indexes
    setCurrentIndex(0);
    setNextIndex(1);

    // Function to handle transitions
    const handleTransition = () => {
      // Start fade out
      setIsTransitioning(true);
      setOpacity(0);

      // Wait for fade out to complete
      const fadeOutTimeout = setTimeout(() => {
        // Switch to next design
        setCurrentIndex(prevIndex => {
          const newIndex = (prevIndex + 1) % designs.length;
          setNextIndex((newIndex + 1) % designs.length);
          return newIndex;
        });

        // Start fade in
        setOpacity(1);

        // Transition is complete
        setTimeout(() => {
          setIsTransitioning(false);
        }, fadeTime);
      }, fadeTime);

      return fadeOutTimeout;
    };

    // Set up interval for transitions
    const transitionInterval = setInterval(handleTransition, interval);

    // Clean up all timeouts and intervals
    return () => {
      clearInterval(transitionInterval);
    };
  }, [designs, interval, fadeTime]);

  // Get the current and next design elements
  const currentDesign = designs && designs.length > 0 ? designs[currentIndex] : null;
  const nextDesign = nextIndex !== null && designs && designs.length > 0 ? designs[nextIndex] : null;

  return {
    currentDesign,
    nextDesign,
    opacity,
    isTransitioning
  };
}