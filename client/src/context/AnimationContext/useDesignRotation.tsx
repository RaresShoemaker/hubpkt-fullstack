import { useContext } from 'react';
import { DesignContext } from '../context/DesignContext';

// Custom hook to use the design context
export function useDesignRotation() {
  return useContext(DesignContext);
}