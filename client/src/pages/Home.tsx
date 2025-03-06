import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategoryOverviewLayout from '../layouts/CategoryOverviewLayout';
import CategoryContainer from '../components/Category/CategoryContainer';
import SEO from '../components/SEO';
import PachetHubLogo from '../assets/PacketaShareLink.png';
import PktHubLogoStacked from '../assets/PktHubLogoStacked.png';
import { useCards } from '../store/features/cards/useCards';
import { useCategories } from '../store/features/categories/useCategories';

const Home: React.FC = () => {
  const { 
    handleFetchHomeCards, 
    handleFetchFilteredCards, 
    homeCards, 
    cards,
    operations 
  } = useCards();
  
  const { clientCategory } = useCategories();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category')?.toLowerCase();

  console.log(homeCards);

  // Determine loading states from operations
  const isLoadingHomeCards = operations.fetchHomeCards.isLoading;
  const isLoadingFilteredCards = operations.fetchFilteredCards.isLoading;

  useEffect(() => {
    if (clientCategory) {
      handleFetchFilteredCards({
        categoryId: clientCategory.id,
        isAvailable: true,
        take: 150
      });
    } else {
      handleFetchHomeCards();
    }
  }, [handleFetchHomeCards, handleFetchFilteredCards, clientCategory]);

  // Loading state
  if ((clientCategory && isLoadingFilteredCards) || (!clientCategory && isLoadingHomeCards)) {
    return (
      <CategoryOverviewLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </CategoryOverviewLayout>
    );
  }

  // For client category view using filtered cards
  if (clientCategory && cards && cards.length > 0) {
    // Get category name from the first card or use clientCategory
    const categoryTitle = clientCategory.title;
    
    return (
      <>
        <SEO
          title={`${categoryTitle} - Packet Hub`}
          description={`Browse ${categoryTitle} on Packet Hub`}
          keywords={`Packet Hub, ${categoryTitle}`}
          url={`https://hub.pkt.cash/`}
          imgSrc={PktHubLogoStacked}
        />
        <CategoryOverviewLayout>
          <CategoryContainer 
            title={categoryTitle}
            cards={cards}
            isFullPage={true}
            squareView={false}
          />
        </CategoryOverviewLayout>
      </>
    );
  }

  // If cards are still not available for home view
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

  // Default view (home page with all categories)
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