import React, { useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import MenuCategory from '../components/Menu/Menu';
import Hero from '../components/Hero/Hero';
import BackgroundTransition from '../components/BackgroundTransition';
import BlurTransition from '../components/BlurTransition';
import CreatorsCategoryContainer from '../components/Creators/CreatorsContainer';

import { useCards } from '../store/features/cards/useCards';
import { useCategories } from '../store/features/categories/useCategories';

const CreatorsHubPage: React.FC = () => {
  const { creatorsCards, handleFetchCreatorsCards } = useCards();
  const { items, changeClientCategory } = useCategories();

  // Find the creators category and fetch related data
  useEffect(() => {
    // Find the creators category
    const creatorsCategory = items.find(cat => 
      cat.title.toLowerCase().includes('creator') || 
      (cat.previewTitle && cat.previewTitle.toLowerCase().includes('creator'))
    );
    
    // Select it if found
    if (creatorsCategory) {
      changeClientCategory(creatorsCategory);
      
      // Fetch creator cards for this category
      handleFetchCreatorsCards(creatorsCategory.id);
    }
  }, [items, changeClientCategory, handleFetchCreatorsCards]);

  return (
    <MainLayout
      menu={<MenuCategory />}
      heroContainer={<Hero image='./Home1.jpg'></Hero>}
      background={<BackgroundTransition backgroundGradient='#090D23' />}
      backgroundTransition={<BlurTransition color='#090D23' blur={40} className='bottom-0 h-[230px]' />}
    >
      <div className='w-full pl-6 md:p-8 lg:p-12 -mt-48'>
        {/* Display creator content using CreatorsCategoryContainer */}
        {Object.entries(creatorsCards).length > 0 ? (
          Object.entries(creatorsCards).map(([key, category]) => (
            <div key={key} className="mb-10">
              <CreatorsCategoryContainer
                title={category.title}
                data={category.data}
              />
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-white text-xl">No creator content available at this time.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default CreatorsHubPage;