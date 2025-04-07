import React, { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import MenuCategory from '../components/Menu/Menu';
import Hero from '../components/Hero/Hero';
import BlurTransition from '../components/BlurTransition';
import BackgroundTransition from '../components/BackgroundTransition';
import { useCategories } from '../store/features/categories/useCategories';
import { useCategoryDesigns } from '../store/features/categoryDesigns/useCategoryDesigns';
import { DeviceSize } from '../store/features/categoryDesigns/categoryDesigns.types';
import HeroElements from '../components/Hero/HeroElements';


const NewsPage: React.FC = () => {
	const { clientCategory, changeClientCategory, items, fetchCategoriesClient } = useCategories();
	const { designs, fetchDesigns } = useCategoryDesigns();
	const [currentDevice, setCurrentDevice] = useState<DeviceSize>(DeviceSize.desktop);

	// Get category from URL query param if available (for backward compatibility)

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
			// Find the creators category
			const creatorsCategory = items.find(cat => 
				cat.title.toLowerCase().includes('news') || 
				(cat.previewTitle && cat.previewTitle.toLowerCase().includes('news'))
			);
			
			// Select it if found
			if (creatorsCategory) {
				changeClientCategory(creatorsCategory);
			}
		}, [items, changeClientCategory]);

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

			<p> Here will be NEWS IFRAME included</p>
			</div>
		</MainLayout>
	);
};

export default NewsPage;
