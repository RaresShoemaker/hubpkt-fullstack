import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategoryOverviewLayout from '../layouts/CategoryOverviewLayout';
import CategoryContainer from '../components/Category/CategoryContainer';
import SEO from '../components/SEO';
import PachetHubLogo from '../assets/PacketaShareLink.png';
import PktHubLogoStacked from '../assets/PktHubLogoStacked.png';
import { useCards } from '../store/features/cards/useCards';

const Home: React.FC = () => {
  const { handleFetchHomeCards, homeCards } = useCards();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category')?.toLowerCase();

  useEffect(() => {
    const getHomeCards = async () => {
      await handleFetchHomeCards();
    };
    getHomeCards();
  }, [handleFetchHomeCards]);

  // If cards are still loading or not available
  if (!homeCards || Object.keys(homeCards).length === 0) {
    return (
      <CategoryOverviewLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </CategoryOverviewLayout>
    );
  }

  // If a specific category is requested via URL parameter
  if (categoryParam) {
    const categoryKey = Object.keys(homeCards).find(
      key => homeCards[key].previewTitle.toLowerCase() === categoryParam
    );
    
    if (categoryKey) {
      const categoryData = homeCards[categoryKey];
      
      if (categoryData && !categoryData.hasSquareContent) {
        return (
          <>
            <SEO
              title={`${categoryData.previewTitle} - Packet Hub`}
              description={`Browse ${categoryData.previewTitle} on Packet Hub`}
              keywords={`Packet Hub, ${categoryData.previewTitle}`}
              url={`https://hub.pkt.cash/?category=${categoryParam}`}
              imgSrc={PktHubLogoStacked}
            />
            <CategoryOverviewLayout>
              <CategoryContainer 
                title={categoryData.previewTitle} 
                cards={categoryData.data} 
                isFullPage={true}
                squareView={categoryData.hasSquareContent}
              />
            </CategoryOverviewLayout>
          </>
        );
      }
    }
  }

  return (
    <>
      <SEO
        title='Packet Hub'
        description='Packet Hub'
        keywords='Packet Hub'
        url='https://hub.pkt.cash/'
        imgSrc={PachetHubLogo}
      />
      <CategoryOverviewLayout>
        <div className='flex flex-col gap-8'>
          {Object.entries(homeCards).map(([key, categoryData]) => (
            <CategoryContainer
              key={key}
              title={categoryData.previewTitle}
              cards={categoryData.data}
              isFullPage={false}
              isViewOnly={
                categoryData.previewTitle.includes('Discover') || 
                categoryData.previewTitle.includes('Hot')
              }
              squareView={categoryData.hasSquareContent}
            />
          ))}
        </div>
      </CategoryOverviewLayout>
    </>
  );
};

export default Home;