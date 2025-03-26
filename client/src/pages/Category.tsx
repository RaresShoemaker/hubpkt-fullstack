import React, { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import MenuCategory from '../components/Menu/Menu';
import Hero from '../components/Hero/Hero';
import BlurTransition from '../components/BlurTransition';
import BackgroundTransition from '../components/BackgroundTransition';
import { useCategories } from '../store/features/categories/useCategories';
import { useCards } from '../store/features/cards/useCards';
import { useCategoryDesigns } from '../store/features/categoryDesigns/useCategoryDesigns';
import CreatorsCategoryContainer from '../components/Creators/CreatorsContainer';
import CategoryContainer from '../components/Category/CategoryContainer';
import { Card } from '../store/features/cards/cards.types';
import { useParams, useLocation } from 'react-router-dom';
import { DeviceSize } from '../store/features/categoryDesigns/categoryDesigns.types';
import HeroElements from '../components/Hero/HeroElements';

// Helper function to convert Card[] to CreatorsData[]
const mapCardsToCreatorsData = (cards: Card[]) => {
	return cards.map((card) => ({
		id: card.id,
		title: card.title,
		description: card.description,
		genre: card.genre,
		image: card.image,
		href: card.href,
		alt: card.title // Using title as alt text
	}));
};

// Helper function to un-slugify a title
const deslugify = (slug: string): string => {
	return slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
};

const CategoryPage: React.FC = () => {
	const { title } = useParams<{ title: string }>();
	const location = useLocation();
	const { clientCategory, changeClientCategory, items, fetchCategoriesClient } = useCategories();
	const { cards, handleFetchCardsByCategory, loading } = useCards();
	const { designs, fetchDesigns } = useCategoryDesigns();
	const [currentDevice, setCurrentDevice] = useState<DeviceSize>(DeviceSize.desktop);

	// Get category from URL query param if available (for backward compatibility)
	const searchParams = new URLSearchParams(location.search);
	const queryCategory = searchParams.get('category');

	// Set device type based on window size
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

	// Ensure we have the category list loaded
	useEffect(() => {
		if (items.length === 0) {
			fetchCategoriesClient();
		}
	}, [items.length, fetchCategoriesClient]);

	// Find category by title in URL
	useEffect(() => {
		if (items.length > 0) {
			// First try the URL path param with both exact match and slugified match
			if (title) {
				// Try to find exact match first
				let foundCategory = items.find((cat) => slugify(cat.title) === title.toLowerCase());

				// If not found, try case-insensitive comparison
				if (!foundCategory) {
					const decodedTitle = deslugify(title);
					foundCategory = items.find((cat) => cat.title.toLowerCase() === decodedTitle.toLowerCase());
				}

				if (foundCategory) {
					changeClientCategory(foundCategory);
				}
			}
			// For backward compatibility, try the query param if title param not found
			else if (queryCategory) {
				const foundCategory = items.find((cat) => cat.title.toLowerCase() === queryCategory.toLowerCase());

				if (foundCategory) {
					changeClientCategory(foundCategory);
				}
			}
		}
	}, [title, queryCategory, items, changeClientCategory]);

	// Fetch cards for the current category when category changes
	useEffect(() => {
		if (clientCategory?.id) {
			handleFetchCardsByCategory(clientCategory.id);
		}
	}, [clientCategory, handleFetchCardsByCategory]);

	// Fetch designs for the current category
	useEffect(() => {
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

	// Helper function to slugify a title
	function slugify(text: string): string {
		if (!text) return '';

		return text
			.toString()
			.toLowerCase()
			.trim()
			.replace(/\s+/g, '-') // Replace spaces with -
			.replace(/[^\w-]+/g, '') // Remove all non-word chars
			.replace(/--+/g, '-') // Replace multiple - with single -
			.replace(/^-+/, '') // Trim - from start of text
			.replace(/-+$/, ''); // Trim - from end of text
	}

	// Get the appropriate design for the current device type
	const currentDesigns = designs[currentDevice] || [];
	const currentDesign = currentDesigns.length > 0 ? currentDesigns[0] : null;

	return (
		<MainLayout
			menu={<MenuCategory />}
			heroContainer={
				<Hero image={currentDesign?.image || './Home1.jpg'}>
					{/* Render HTML elements */}
					{currentDesign?.htmlElements && <HeroElements htmlTags={currentDesign.htmlElements} />}
				</Hero>
			}
			background={
				<BackgroundTransition backgroundGradient={currentDesign?.backgroundGradient || '#090D23'} />
			}
			backgroundTransition={
				<BlurTransition
					color={currentDesign?.transitionGradient || '#090D23'}
					blur={40}
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
						<h2 className='text-2xl font-bold mb-4'>{clientCategory?.title || deslugify(title || '')}</h2>
						<p>No content available for this category.</p>
					</div>
				)}

				{/* Render cards when available */}
				{!loading.fetchCardsByCategory && items.length > 0 && cards.length > 0 && (
					<>
						{/* Use appropriate container based on category type */}
						{clientCategory?.hasSquareContent ? (
							<CreatorsCategoryContainer
								title={clientCategory.previewTitle || clientCategory?.title || ''}
								data={mapCardsToCreatorsData(cards)}
							/>
						) : (
							<CategoryContainer
								title={clientCategory?.previewTitle || clientCategory?.title || ''}
								cards={cards}
								squareView={false}
								isFullPage={true}
							/>
						)}
					</>
				)}
			</div>
		</MainLayout>
	);
};

export default CategoryPage;
