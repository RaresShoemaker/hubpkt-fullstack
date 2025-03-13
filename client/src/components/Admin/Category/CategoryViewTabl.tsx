import React from 'react';
import { useTheme } from '../../../store/features/ui/useUITheme';
import { cn } from '../../../lib/utils';

interface CategoryViewTabsProps {
  activeView: 'cards' | 'designs';
  onChange: (view: 'cards' | 'designs') => void;
}

const CategoryViewTabs: React.FC<CategoryViewTabsProps> = ({ activeView, onChange }) => {
  const { isDark } = useTheme();
  
  return (
    <div className="flex border-b mb-6">
      <button
        onClick={() => onChange('cards')}
        className={cn(
          'px-4 py-2 font-medium text-sm relative',
          activeView === 'cards' 
            ? (isDark ? 'text-dark-text-accent' : 'text-light-text-accent') 
            : (isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'),
          'transition-colors duration-200'
        )}
      >
        Cards
        {activeView === 'cards' && (
          <span 
            className={cn(
              'absolute bottom-0 left-0 w-full h-0.5',
              isDark ? 'bg-dark-text-accent' : 'bg-light-text-accent'
            )}
          />
        )}
      </button>
      
      <button
        onClick={() => onChange('designs')}
        className={cn(
          'px-4 py-2 font-medium text-sm relative',
          activeView === 'designs' 
            ? (isDark ? 'text-dark-text-accent' : 'text-light-text-accent') 
            : (isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'),
          'transition-colors duration-200'
        )}
      >
        Designs
        {activeView === 'designs' && (
          <span 
            className={cn(
              'absolute bottom-0 left-0 w-full h-0.5',
              isDark ? 'bg-dark-text-accent' : 'bg-light-text-accent'
            )}
          />
        )}
      </button>
    </div>
  );
};

export default CategoryViewTabs;