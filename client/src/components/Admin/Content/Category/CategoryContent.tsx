import React, { useEffect, useState, useRef } from 'react';
import { useCategories } from '../../../../store/features/categories/useCategories';
import { useCards } from '../../../../store/features/cards/useCards';
import { useTheme } from '../../../../store/features/ui/useUITheme';
import CardList from '../../Cards/CardsList';
import CategoryViewTabs from '../../Category/CategoryViewTabl';
import CategoryDesigns from '../../Category/CategoryDesign';
import ToolBar from '../ToolBar';
import ButtonBase from '../../Buttons/ButtonBase';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../../../lib/utils';

type CategoryContentProps = {
  id: string;
}

// Define the filter types
interface CardFilters {
  isAvailable?: boolean;
  isHot?: boolean;
  isDiscover?: boolean;
  isPreview?: boolean;
  searchTerm?: string;
}

const CategoryContent: React.FC<CategoryContentProps> = () => {
  const { isDark } = useTheme();
  const { currentCategory } = useCategories();
  const { 
    cards, 
    handleFetchFilteredCards,
    loading,
    total
  } = useCards();
  
  // Basic state
  const [activeView, setActiveView] = useState<'cards' | 'designs'>('cards');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<CardFilters>({});
  
  // Pagination state
  const ITEMS_PER_PAGE = 20;
  const [currentPage, setCurrentPage] = useState(1);
  
  // Search debounce
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);
  
  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  
  // Fetch cards when category, page, or filtering changes
  useEffect(() => {
    if (!currentCategory?.id) return;
    
    const fetchCards = async () => {
      try {
        // Always use the filtered endpoint to ensure pagination works consistently
        // This provides the most flexibility
        await handleFetchFilteredCards({
          skip: (currentPage - 1) * ITEMS_PER_PAGE,
          take: ITEMS_PER_PAGE,
          categoryId: currentCategory.id,
          // Include any active filters
          ...filters
        });
      } catch (error) {
        console.error("Error fetching cards:", error);
      }
    };
    
    fetchCards();
  }, [currentCategory, currentPage, filters, handleFetchFilteredCards, ITEMS_PER_PAGE]);
  
  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
    // Reset filters when category changes
    setFilters({});
    setSearchTerm('');
  }, [currentCategory]);
  
  // Handle view tab change
  const handleViewChange = (view: 'cards' | 'designs') => {
    setActiveView(view);
  };
  
  // Handle search input with debounce
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    
    // Clear previous timer
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    
    // Set new timer
    searchDebounceRef.current = setTimeout(() => {
      // Reset to page 1 when search changes
      setCurrentPage(1);
      
      // Update filters with search term
      setFilters(prev => ({
        ...prev,
        searchTerm: value.trim() ? value : undefined
      }));
    }, 500);
  };
  
  // Handle filter changes
  const handleFilterChange = (newFilters: CardFilters) => {
    // Clean up filters - remove falsy values
    const cleanedFilters: CardFilters = {};
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        cleanedFilters[key as keyof CardFilters] = value;
      } else {
        cleanedFilters[key as keyof CardFilters] = undefined;
      }
    });
    
    // Preserve search term
    if (searchTerm) {
      cleanedFilters.searchTerm = searchTerm;
    }
    
    // Reset to page 1 when filters change
    setCurrentPage(1);
    setFilters(cleanedFilters);
  };
  
  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, []);
  
  // Determine if any filtering is active
  const isFiltering = Object.values(filters).some(val => val !== undefined);
  
  // Determine loading state
  const isLoading = loading.fetchCardsByCategory || loading.fetchFilteredCards;
  
  return (
    <div
      className={`flex-1 p-8 rounded-2xl border transition-colors duration-300
      ${isDark ? 'bg-dark-surface border-dark-border/20' : 'bg-light-surface border-light-border/20'}`}
    >
      {/* Page header */}
      <div className='mb-8 flex justify-between items-center'>
        <div className='flex flex-col'>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
            {currentCategory?.title || 'Loading...'}
          </h1>
          <p className={`mt-2 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
            {isFiltering ? 
              `Showing ${total} filtered ${total === 1 ? 'card' : 'cards'}` : 
              `Manage ${activeView === 'cards' ? 'cards' : 'designs'} in this category`
            }
          </p>
        </div>
        
        {/* Only show search and filters in cards view */}
        {activeView === 'cards' && (
          <ToolBar 
            showSearch={true}
            searchValue={searchTerm}
            onSearchChange={handleSearchChange}
            showFilter={true}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        )}
      </div>

      {/* View Tabs */}
      <CategoryViewTabs 
        activeView={activeView}
        onChange={handleViewChange}
      />

      {/* Content area - either Card List or Designs based on active view */}
      {activeView === 'cards' ? (
        <>
          <CardList 
            cards={cards} 
            isLoading={isLoading} 
          />
          
          {/* Only show pagination if we have multiple pages */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-6 gap-2">
              <ButtonBase
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                variant="ghost"
                leftIcon={<ChevronLeft size={16} />}
                className={cn(
                  currentPage === 1 && "opacity-50 cursor-not-allowed"
                )}
              >
                Previous
              </ButtonBase>
              
              <div className="flex items-center gap-1 mx-2">
                {/* Show page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageToShow: number;
                  
                  if (totalPages <= 5) {
                    // If 5 or fewer pages, show all pages
                    pageToShow = i + 1;
                  } else if (currentPage <= 3) {
                    // If near the start, show first 5 pages
                    pageToShow = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    // If near the end, show last 5 pages
                    pageToShow = totalPages - 4 + i;
                  } else {
                    // Show 2 pages before and after current page
                    pageToShow = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={`page-${pageToShow}`}
                      onClick={() => handlePageChange(pageToShow)}
                      className={cn(
                        "w-8 h-8 flex items-center justify-center rounded",
                        currentPage === pageToShow
                          ? (isDark ? "bg-dark-text-accent text-white" : "bg-light-text-accent text-white")
                          : (isDark ? "text-dark-text-primary hover:bg-dark-background" : "text-light-text-primary hover:bg-light-background")
                      )}
                    >
                      {pageToShow}
                    </button>
                  );
                })}
                
                {/* Show ellipsis if there are more pages */}
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <span className={isDark ? "text-dark-text-secondary" : "text-light-text-secondary"}>...</span>
                )}
                
                {/* Always show last page if not included in the buttons already */}
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className={cn(
                      "w-8 h-8 flex items-center justify-center rounded",
                      isDark ? "text-dark-text-primary hover:bg-dark-background" : "text-light-text-primary hover:bg-light-background"
                    )}
                  >
                    {totalPages}
                  </button>
                )}
              </div>
              
              <ButtonBase
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                variant="ghost"
                rightIcon={<ChevronRight size={16} />}
                className={cn(
                  currentPage === totalPages && "opacity-50 cursor-not-allowed"
                )}
              >
                Next
              </ButtonBase>
            </div>
          )}
          
          {/* Debug info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="text-xs mt-4 text-gray-500 text-center">
              Debug: Total items: {total} | Page {currentPage} of {totalPages} | Cards shown: {cards.length} | Filters: {JSON.stringify(filters)}
            </div>
          )}
        </>
      ) : (
        <CategoryDesigns />
      )}
    </div>
  );
};

export default CategoryContent;