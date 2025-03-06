import React, { useEffect } from 'react';
import CategoryOverviewLayout from '../layouts/CategoryOverviewLayout';
import SEO from '../components/SEO';
import CreatorsStackedLogo from '../assets/PktCreatorStackLogo.png';
import { useCategories } from '../store/features/categories/useCategories';
import { useCards } from '../store/features/cards/useCards';
import CreatorsCategoryContainer from '../components/Creators/CreatorsContainer';

const CreatorsHubPage: React.FC = () => {
  const { clientCategory } = useCategories();
  const { handleFetchCreatorsCards, creatorsCards } = useCards();

  useEffect(() => {
    if (clientCategory) {
      handleFetchCreatorsCards(clientCategory.id);
    }
  }, [handleFetchCreatorsCards, clientCategory]);

  return (
    <>
      <SEO
        title='Creator Hub'
        description='Creator Hub'
        keywords='Creator Hub'
        url='https://hub.pkt.cash/creatorhub'
        imgSrc={CreatorsStackedLogo}
      />
      <CategoryOverviewLayout>
        <div className='flex flex-col gap-8'>
          {creatorsCards && Object.keys(creatorsCards).length > 0 ? (
            Object.entries(creatorsCards).map(([key, categoryData]) => (
              categoryData && (
                <CreatorsCategoryContainer 
                  key={key}
                  title={categoryData.title}
                  data={categoryData.data}
                />
              )
            ))
          ) : (
            <p className="text-white">Loading creator content...</p>
          )}
        </div>
      </CategoryOverviewLayout>
    </>
  );
};

export default CreatorsHubPage;