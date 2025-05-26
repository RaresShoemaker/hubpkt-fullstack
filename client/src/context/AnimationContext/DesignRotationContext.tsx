import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { SimplifiedDesign } from '../../utils/designTransformer'

interface DesignContextType {
  currentIndex: number;
  designs: SimplifiedDesign[];
}

const DesignContext = createContext<DesignContextType>({
  currentIndex: 0,
  designs: []
});

interface DesignProviderProps {
  children: ReactNode;
  designs: SimplifiedDesign[];
  interval?: number;
}

export const DesignProvider: React.FC<DesignProviderProps> = ({ 
  children, 
  designs, 
  interval = 20000
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (designs.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % designs.length);
    }, interval);

    return () => clearInterval(timer);
  }, [designs.length, interval]);

  return (
    <DesignContext.Provider value={{ currentIndex, designs }}>
      {children}
    </DesignContext.Provider>
  );
};

export const useDesignRotation = () => useContext(DesignContext);