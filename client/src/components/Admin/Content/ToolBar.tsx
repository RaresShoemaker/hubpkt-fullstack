import React, { useState } from 'react';
import ButtonBase from '../Buttons/ButtonBase';
import { ArrowLeftRight, SaveIcon, Search, Filter, X, Check } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useTheme } from '../../../store/features/ui/useUITheme';

interface ToolBarProps {
  isEditOrder?: boolean;
  handleEditOrder?: () => void;
  showSaveOrder?: boolean;
  handleSaveOrder?: () => void;
  // Search functionality
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  // Filter functionality
  showFilter?: boolean;
  filters?: {
    isAvailable?: boolean;
    isHot?: boolean;
    isDiscover?: boolean;
    isPreview?: boolean;
  };
  onFilterChange?: (filters: {
    isAvailable?: boolean;
    isHot?: boolean;
    isDiscover?: boolean;
    isPreview?: boolean;
  }) => void;
}

const ToolBar: React.FC<ToolBarProps> = ({
  isEditOrder,
  handleEditOrder,
  showSaveOrder,
  handleSaveOrder,
  // Search props
  showSearch = false,
  searchValue = '',
  onSearchChange,
  // Filter props
  showFilter = false,
  filters = {},
  onFilterChange
}) => {
  const { isDark } = useTheme();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Count active filters
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearchChange) {
      onSearchChange(e.target.value);
    }
  };

  const handleClearSearch = () => {
    if (onSearchChange) {
      onSearchChange('');
    }
  };

  const handleFilterToggle = (filterName: keyof typeof filters) => {
    if (onFilterChange) {
      onFilterChange({
        ...filters,
        [filterName]: !filters[filterName]
      });
    }
  };

  const toggleFilterPanel = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const clearAllFilters = () => {
    if (onFilterChange) {
      onFilterChange({
        isAvailable: undefined,
        isHot: undefined,
        isDiscover: undefined,
        isPreview: undefined
      });
    }
  };

  return (
    <div className='flex gap-4 items-center'>
      {/* Order editing buttons (from original ToolBar) */}
      {isEditOrder && (
        <>
          <ButtonBase
            leftIcon={<ArrowLeftRight size={20} />}
            onClick={handleEditOrder}
            variant='primary'
            className='flex items-center h-10 w-10'
          />
          {showSaveOrder && (
            <ButtonBase
              leftIcon={<SaveIcon size={20} />}
              onClick={handleSaveOrder}
              variant='primary'
              className='flex items-center h-10 w-10'
            />
          )}
        </>
      )}

      {/* Search functionality */}
      {showSearch && (
        <div className={cn(
          'relative flex items-center rounded-md border px-3 w-64',
          isDark ? 'bg-dark-surface border-dark-border' : 'bg-light-surface border-light-border'
        )}>
          <Search size={18} className={cn(
            'mr-2',
            isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'
          )} />
          <input
            type="text"
            value={searchValue}
            onChange={handleSearchInputChange}
            placeholder="Search cards..."
            className={cn(
              'bg-transparent py-2 outline-none flex-grow text-sm',
              isDark ? 'text-dark-text-primary placeholder:text-dark-text-secondary' : 'text-light-text-primary placeholder:text-light-text-secondary'
            )}
          />
          {searchValue && (
            <button 
              onClick={handleClearSearch}
              className={cn(
                'p-1 rounded-full',
                isDark ? 'hover:bg-dark-background' : 'hover:bg-light-background'
              )}
            >
              <X size={16} className={isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'} />
            </button>
          )}
        </div>
      )}

      {/* Filter functionality */}
      {showFilter && (
        <div className="relative">
          <ButtonBase
            leftIcon={<Filter size={20} />}
            onClick={toggleFilterPanel}
            variant='ghost'
            className={cn(
              'flex items-center',
              activeFilterCount > 0 && 'text-blue-500'
            )}
          >
            {activeFilterCount > 0 && (
              <span className="ml-1 flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-xs">
                {activeFilterCount}
              </span>
            )}
          </ButtonBase>

          {/* Filter dropdown panel */}
          {isFilterOpen && (
            <div className={cn(
              'absolute top-full right-0 mt-2 w-60 rounded-lg shadow-lg z-50',
              isDark ? 'bg-dark-surface border border-dark-border' : 'bg-light-surface border border-light-border'
            )}>
              <div className="p-3 border-b border-opacity-20 flex justify-between items-center">
                <h3 className={cn(
                  'font-medium',
                  isDark ? 'text-dark-text-primary' : 'text-light-text-primary'
                )}>
                  Filter Cards
                </h3>
                {activeFilterCount > 0 && (
                  <button 
                    onClick={clearAllFilters}
                    className={cn(
                      'text-xs',
                      isDark ? 'text-dark-text-accent hover:text-dark-text-accent/80' : 'text-light-text-accent hover:text-light-text-accent/80'
                    )}
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="p-3">
                <div className="space-y-3">
                  <FilterOption 
                    label="Available" 
                    isActive={!!filters.isAvailable} 
                    onClick={() => handleFilterToggle('isAvailable')}
                    isDark={isDark}
                  />
                  <FilterOption 
                    label="Hot" 
                    isActive={!!filters.isHot} 
                    onClick={() => handleFilterToggle('isHot')}
                    isDark={isDark}
                  />
                  <FilterOption 
                    label="Discover" 
                    isActive={!!filters.isDiscover} 
                    onClick={() => handleFilterToggle('isDiscover')}
                    isDark={isDark}
                  />
                  <FilterOption 
                    label="Preview" 
                    isActive={!!filters.isPreview} 
                    onClick={() => handleFilterToggle('isPreview')}
                    isDark={isDark}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Helper component for filter options
const FilterOption: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
  isDark: boolean;
}> = ({ label, isActive, onClick, isDark }) => (
  <div 
    className={cn(
      'flex items-center justify-between py-1 px-2 rounded cursor-pointer',
      isActive ? (isDark ? 'bg-dark-background' : 'bg-light-background') : ''
    )}
    onClick={onClick}
  >
    <span className={isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}>
      {label}
    </span>
    {isActive ? (
      <div className={cn(
        'w-5 h-5 rounded-full flex items-center justify-center',
        isDark ? 'bg-dark-text-accent' : 'bg-light-text-accent'
      )}>
        <Check size={12} className="text-white" />
      </div>
    ) : (
      <div className={cn(
        'w-5 h-5 rounded-full border',
        isDark ? 'border-dark-border' : 'border-light-border'
      )}>
      </div>
    )}
  </div>
);

export default ToolBar;