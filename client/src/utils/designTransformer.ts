/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeviceSize } from '../store/features/categoryDesigns/categoryDesigns.types';

// Define the simplified design element structure
export interface SimplifiedDesign {
  id: string;
  backgroundGradient: string;
  transitionGradient: string;
  image: string;
  htmlElements: any[]; 
}

// Interface for the organized designs by device
export interface OrganizedDesigns {
  [DeviceSize.mobile]: SimplifiedDesign[];
  [DeviceSize.tablet]: SimplifiedDesign[];
  [DeviceSize.desktop]: SimplifiedDesign[];
}

/**
 * Transforms the raw design data into a simplified structure 
 * with only the needed properties
 */
export const simplifyDesigns = (rawData: any): OrganizedDesigns => {
  const result: OrganizedDesigns = {
    [DeviceSize.mobile]: [],
    [DeviceSize.tablet]: [],
    [DeviceSize.desktop]: [],
  };

  // Process each device type
  for (const deviceType of Object.keys(rawData)) {
    if (Array.isArray(rawData[deviceType])) {
      // Map each design item to a simplified structure
      result[deviceType as DeviceSize] = rawData[deviceType].map((item: any) => ({
        id: item.id,
        backgroundGradient: item.backgroundGradient || '#090D23', // Default if missing
        transitionGradient: item.transitionGradient || '#090D23', // Default if missing
        image: item.image || './Home1.jpg', // Default if missing
        htmlElements: item.htmlElements || []
      }));
      
      // Sort by order if available
      result[deviceType as DeviceSize].sort((a: any, b: any) => {
        if (rawData[deviceType].find((i: any) => i.id === a.id)?.order && 
            rawData[deviceType].find((i: any) => i.id === b.id)?.order) {
          return rawData[deviceType].find((i: any) => i.id === a.id).order - 
                 rawData[deviceType].find((i: any) => i.id === b.id).order;
        }
        return 0;
      });
    }
  }

  return result;
};