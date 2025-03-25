import React, { useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import MenuCategory from '../components/Menu/Menu';
import Hero from '../components/Hero/Hero';
import BlurTransition from '../components/BlurTransition';
import BackgroundTransition from '../components/BackgroundTransition';
import { useCards } from '../store/features/cards/useCards';
import CreatorsCategoryContainer from '../components/Creators/CreatorsContainer';
import CategoryContainer from '../components/Category/CategoryContainer';
import { Card } from '../store/features/cards/cards.types';

// Helper function to convert Card[] to CreatorsData[]
const mapCardsToCreatorsData = (cards: Card[]) => {
  return cards.map(card => ({
    id: card.id,
    title: card.title,
    description: card.description,
    genre: card.genre,
    image: card.image,
    href: card.href,
    alt: card.title, // Using title as alt text
  }));
};

const HomePage: React.FC = () => {
  const { homeCards, handleFetchHomeCards } = useCards();

  useEffect(() => {
    handleFetchHomeCards();
  }, [handleFetchHomeCards]);

  return (
    <MainLayout
      menu={<MenuCategory />}
      heroContainer={<Hero image='./Home1.jpg'></Hero>}
      background={<BackgroundTransition backgroundGradient='#090D23' />}
      backgroundTransition={<BlurTransition color='#090D23' blur={40} className='bottom-0 h-[230px]' />}
    >
      <div className='w-full p-6 md:p-8 lg:p-12 -mt-48 flex flex-col gap-10'>
        {/* Render "What's Hot" section if it exists and has data */}
        {homeCards?.hot?.data?.length > 0 && (
          <CategoryContainer 
            title={homeCards.hot.previewTitle} 
            cards={homeCards.hot.data}
            squareView={false}
            isViewOnly={true}
          />
        )}
        
        {/* Render "Discover" section if it exists and has data */}
        {homeCards?.discover?.data?.length > 0 && (
          <CategoryContainer 
            title={homeCards.discover.previewTitle} 
            cards={homeCards.discover.data}
            squareView={false}
            isViewOnly={true}
          />
        )}
        
        {/* Render "Creator Hub" section if it exists and has data */}
        {homeCards?.creator?.data?.length > 0 && (
          <CreatorsCategoryContainer
            title={homeCards.creator.previewTitle}
            data={mapCardsToCreatorsData(homeCards.creator.data)}
          />
        )}
        
        {/* Render other category sections */}
        {Object.entries(homeCards || {}).map(([key, category]) => {
          // Skip categories we've already explicitly rendered
          if (['hot', 'discover', 'creator'].includes(key)) return null;
          
          // Skip empty categories
          if (!category.data || category.data.length === 0) return null;
          
          // Check if this category has square content
          const hasSquareContent = category.hasSquareContent || false;
          
          return hasSquareContent ? (
            <CreatorsCategoryContainer
              key={key}
              title={category.previewTitle}
              data={mapCardsToCreatorsData(category.data)}
            />
          ) : (
            <CategoryContainer
              key={key}
              title={category.previewTitle}
              cards={category.data}
              squareView={false}
            />
          );
        })}
      </div>
    </MainLayout>
  );
};

export default HomePage;