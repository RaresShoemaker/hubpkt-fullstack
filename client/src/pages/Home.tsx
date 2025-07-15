import React, { useState, useEffect } from 'react';
import { DeviceSize } from '../store/features/categoryDesigns/categoryDesigns.types';
import MainLayout from '../layouts/MainLayout';
import MenuCategory from '../components/Menu/Menu';
import { useCards } from '../store/features/cards/useCards';
import CreatorsCategoryContainer from '../components/Creators/CreatorsContainer';
import CategoryContainer from '../components/Category/CategoryContainer';
import { Card } from '../store/features/cards/cards.types';

import RotatingBackground from '../components/Animation/RotatingBackgroundComponent';
import RotatingBlurTransition from '../components/Animation/RotatingBlurTransition';
import RotatingHero from '../components/Animation/RotatingHeroComponent';
import { DesignProvider } from '../context/AnimationContext/DesignRotationContext';
import { useCategoryDesigns } from '../store/features/categoryDesigns/useCategoryDesigns';
import { SimplifiedDesign, simplifyDesigns } from '../utils/designTransformer';
import { useCategories } from '../store/features/categories/useCategories';

// Helper function to convert Card[] to CreatorsData[]
const mapCardsToCreatorsData = (cards: Card[]) => {
	return cards.map((card) => ({
		id: card.id,
		title: card.title,
		description: card.description,
		genre: card.genre,
		image: card.image,
		href: card.href,
		alt: card.title
	}));
};

const HomePage: React.FC = () => {
	const { homeCards, handleFetchHomeCards } = useCards();
    const { clientCategory, changeClientCategory, items, fetchCategoriesClient } = useCategories();
    const { designs, fetchDesigns } = useCategoryDesigns();
	const [currentDevice, setCurrentDevice] = useState<DeviceSize>(DeviceSize.desktop);
	const [simplifiedDesigns, setSimplifiedDesigns] = useState<SimplifiedDesign[]>([]);

	useEffect(() => {
		const handleResize = () => {
			const width = window.innerWidth;
			if (width < 768) {
				setCurrentDevice(DeviceSize.mobile);
			} else if (width < 1024) {
				setCurrentDevice(DeviceSize.tablet);
			} else {
				setCurrentDevice(DeviceSize.desktop);
			}
		};

		// Initial check
		handleResize();

		// Add listener for resize
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		handleFetchHomeCards();
	}, [handleFetchHomeCards]);

  // Ensure we have the category list loaded
    useEffect(() => {
      if (items.length === 0) {
        fetchCategoriesClient();
      }
    }, [items.length, fetchCategoriesClient]);
  
    // Find category by title in URL
    useEffect(() => {
      // Find the news category
      const homeCategory = items.find(
        (cat) =>
          cat.title.toLowerCase().includes('home') ||
          (cat.previewTitle && cat.previewTitle.toLowerCase().includes('home'))
      );
  
      // Select it if found
      if (homeCategory) {
        changeClientCategory(homeCategory);
      }
    }, [items, changeClientCategory]);
  
    // Fetch designs for the current category
    useEffect(() => {
      console.log(clientCategory)
      if (clientCategory?.id) {
        fetchDesigns(clientCategory.id);
      }
    }, [fetchDesigns, clientCategory]);
  
    // Clean up selected category on unmount
    useEffect(() => {
      return () => {
        changeClientCategory(null);
      };
    }, [changeClientCategory]);
  
  useEffect(() => {
      if (Object.keys(designs).length > 0) {
        const transformed = simplifyDesigns(designs);
        const deviceDesigns = transformed[currentDevice] || [];
  
        // Set the simplified designs for the current device
        setSimplifiedDesigns(deviceDesigns);
      }
    }, [designs, currentDevice]);

	return (
		<DesignProvider designs={simplifiedDesigns} interval={20000}>
			<MainLayout
				menu={<MenuCategory />}
				heroContainer={<RotatingHero />}
				background={<RotatingBackground />}
				backgroundTransition={<RotatingBlurTransition />}
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
		</DesignProvider>
	);
};

export default HomePage;
