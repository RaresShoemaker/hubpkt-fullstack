import React, { useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import MenuCategory from '../components/Menu/Menu';
import Hero from '../components/Hero/Hero';
import BlurTransition from '../components/BlurTransition';
import BackgroundTransition from '../components/BackgroundTransition';
import { useCategories } from '../store/features/categories/useCategories';
import { useCards } from '../store/features/cards/useCards';
import { useCategoryDesigns } from '../store/features/categoryDesigns/useCategoryDesigns';
import CategoryContainer from '../components/Category/CategoryContainer';
import { useDesignTransition } from '../hooks/useDesignTransition';
import { useParams } from 'react-router-dom';
import HeroElements from '../components/Hero/HeroElements';

const CategoryPage: React.FC = () => {
  const { title } = useParams<{ title: string }>();
  const { clientCategory, changeClientCategory, items, fetchCategoriesClient } = useCategories();
  const { cards, handleFetchCardsByCategory, loading } = useCards();
  const { designs, fetchDesigns } = useCategoryDesigns();

  // Fetch category data when component mounts
  useEffect(() => {
    if (items.length === 0) {
      fetchCategoriesClient();
    }
  }, [items.length, fetchCategoriesClient]);

  // Find category by title in URL
  useEffect(() => {
    if (items.length > 0 && title) {
      const foundCategory = items.find(
        (cat) => cat.title.toLowerCase() === title.toLowerCase()
      );
      if (foundCategory) {
        changeClientCategory(foundCategory);
      }
    }
  }, [title, items, changeClientCategory]);

  // Fetch designs for the current category
  useEffect(() => {
    if (clientCategory?.id) {
      fetchDesigns(clientCategory.id);
      handleFetchCardsByCategory(clientCategory.id);
    }
  }, [clientCategory, fetchDesigns, handleFetchCardsByCategory]);

  // Get all design elements for the desktop device
  const desktopDesigns = designs.desktop || [];
  
  // Use our custom hook to handle transitions between designs
  const {
    currentDesign,
    nextDesign,
    opacity,
    isTransitioning
  } = useDesignTransition(desktopDesigns);

  return (
    <MainLayout
      menu={<MenuCategory />}
      heroContainer={
        <Hero
          image={currentDesign?.image || './Home1.jpg'}
          nextImage={nextDesign?.image}
          transitionOpacity={opacity}
          isTransitioning={isTransitioning}
        >
          {/* Render HTML elements for current design */}
          {currentDesign?.htmlElements && <HeroElements htmlTags={currentDesign.htmlElements} />}
        </Hero>
      }
      background={
        <BackgroundTransition
          backgroundGradient={currentDesign?.backgroundGradient || '#090D23'}
          nextBackgroundGradient={nextDesign?.backgroundGradient}
          opacity={opacity}
          isTransitioning={isTransitioning}
        />
      }
      backgroundTransition={
        <BlurTransition
          color={currentDesign?.transitionGradient || '#090D23'}
          nextColor={nextDesign?.transitionGradient}
          blur={40}
          opacity={opacity}
          isTransitioning={isTransitioning}
          className='bottom-0 h-[230px]'
        />
      }
    >
      <div className='w-full p-6 md:p-8 lg:p-12 -mt-48 flex flex-col gap-10'>
        {/* Loading state */}
        {(loading.fetchCardsByCategory || items.length === 0) && (
          <div className='flex justify-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white'></div>
          </div>
        )}

        {/* No content state */}
        {!loading.fetchCardsByCategory && items.length > 0 && cards.length === 0 && (
          <div className='text-center text-white'>
            <h2 className='text-2xl font-bold mb-4'>{clientCategory?.title || ''}</h2>
            <p>No content available for this category.</p>
          </div>
        )}

        {/* Render cards when available */}
        {!loading.fetchCardsByCategory && items.length > 0 && cards.length > 0 && (
          <CategoryContainer
            title={clientCategory?.title || ''}
            cards={cards}
            squareView={false}
            isFullPage={true}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default CategoryPage;