import React, { useEffect, useState } from 'react';
import { useCategories } from '../../../../store/features/categories/useCategories';
import { useCards } from '../../../../store/features/cards/useCards';
import { useTheme } from '../../../../store/features/ui/useUITheme';
import CardList from '../../Cards/CardsList';
import { Card } from '../../../../store/features/cards/cards.types';
import CategoryViewTabs from '../../Category/CategoryViewTabl';
import CategoryDesigns from '../../Category/CategoryDesign';

type CategoryContentProps = {
  id: string;
}

const CategoryContent: React.FC<CategoryContentProps> = () => {
  const { isDark } = useTheme();
  const { currentCategory } = useCategories();
  const { 
    cards, 
    handleFetchCardsByCategory, 
    loading 
  } = useCards();
  
  const [categoryCards, setCategoryCards] = useState<Card[]>([]);
  const [activeView, setActiveView] = useState<'cards' | 'designs'>('cards');

  // Fetch cards for the current category
  useEffect(() => {
    if (currentCategory?.id) {
      handleFetchCardsByCategory(currentCategory.id);
    }
  }, [currentCategory, handleFetchCardsByCategory]);

  // Filter cards when they change
  useEffect(() => {
    if (currentCategory?.id) {
      setCategoryCards(cards.filter(card => card.categoryId === currentCategory.id));
    }
  }, [cards, currentCategory]);

  const handleViewChange = (view: 'cards' | 'designs') => {
    setActiveView(view);
  };

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
            Manage {activeView === 'cards' ? 'cards' : 'designs'} in this category
          </p>
        </div>
      </div>

      {/* View Tabs */}
      <CategoryViewTabs 
        activeView={activeView}
        onChange={handleViewChange}
      />

      {/* Content area - either Card List or Designs based on active view */}
      {activeView === 'cards' ? (
        <CardList 
          cards={categoryCards} 
          isLoading={loading.fetchCardsByCategory} 
        />
      ) : (
        <CategoryDesigns />
      )}
    </div>
  );
};

export default CategoryContent;