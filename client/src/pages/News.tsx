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
import { cn } from '../lib/utils';

enum NewsCategory {
  TOP_STORIES = 'top-stories',
  BUSINESS = 'business',
  LIFESTYLE = 'lifestyle',
  TECH = 'tech',
  CELEBRITY = 'celebrity',
  CRYPTO = 'crypto'
}

const NewsPage: React.FC = () => {
	const { clientCategory, changeClientCategory, items, fetchCategoriesClient } = useCategories();
	const { designs, fetchDesigns } = useCategoryDesigns();
	const [currentDevice, setCurrentDevice] = useState<DeviceSize>(DeviceSize.desktop);
	const [newsCategory, setNewsCategory] = useState<NewsCategory>(NewsCategory.TOP_STORIES);

	// Load RSS widget script when component mounts
	useEffect(() => {
		const script = document.createElement('script');
		script.src = 'https://widget.rss.app/v1/wall.js';
		script.async = true;
		document.body.appendChild(script);

		return () => {
			// Cleanup script when component unmounts
			try {
				document.body.removeChild(script);
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (err) {
				// Script might already be removed, ignore error
			}
		};
	}, []);

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
		// Find the news category
		const newsCategory = items.find(cat => 
			cat.title.toLowerCase().includes('news') || 
			(cat.previewTitle && cat.previewTitle.toLowerCase().includes('news'))
		);
		
		// Select it if found
		if (newsCategory) {
			changeClientCategory(newsCategory);
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
				{/* News Container */}
				<div className='min-h-screen w-full flex flex-col'>
					{/* News Category Navigation */}
					<div className='flex flex-grow gap-5 pr-4 md:pr-0 text-lg md:text-xl text-white w-full justify-start md:justify-center overflow-x-auto pb-4 whitespace-nowrap scrollbar-hide'>
						<button
							className={cn(
								'w-32 text-center text-white/40 hover:text-white hover:font-semibold transition-all duration-100',
								newsCategory === NewsCategory.TOP_STORIES && 'text-white font-semibold'
							)}
							onClick={() => setNewsCategory(NewsCategory.TOP_STORIES)}
						>
							Top Stories
						</button>
						<button
							className={cn(
								'w-24 text-center text-white/40 hover:text-white hover:font-semibold transition-all duration-100',
								newsCategory === NewsCategory.BUSINESS && 'text-white font-semibold'
							)}
							onClick={() => setNewsCategory(NewsCategory.BUSINESS)}
						>
							Business
						</button>
						<button
							className={cn(
								'w-24 text-center text-white/40 hover:text-white hover:font-semibold transition-all duration-100',
								newsCategory === NewsCategory.LIFESTYLE && 'text-white font-semibold'
							)}
							onClick={() => setNewsCategory(NewsCategory.LIFESTYLE)}
						>
							Lifestyle
						</button>
						<button
							className={cn(
								'w-24 text-center text-white/40 hover:text-white hover:font-semibold transition-all duration-100',
								newsCategory === NewsCategory.TECH && 'text-white font-semibold'
							)}
							onClick={() => setNewsCategory(NewsCategory.TECH)}
						>
							Tech
						</button>
						<button
							className={cn(
								'w-24 text-center text-white/40 hover:text-white hover:font-semibold transition-all duration-100',
								newsCategory === NewsCategory.CELEBRITY && 'text-white font-semibold'
							)}
							onClick={() => setNewsCategory(NewsCategory.CELEBRITY)}
						>
							Celebrity
						</button>
						<button
							className={cn(
								'w-24 text-center text-white/40 hover:text-white hover:font-semibold transition-all duration-100',
								newsCategory === NewsCategory.CRYPTO && 'text-white font-semibold'
							)}
							onClick={() => setNewsCategory(NewsCategory.CRYPTO)}
						>
							Crypto
						</button>
					</div>

					{/* News Content */}
					<div className="mt-8 px-4 md:px-10">
						{newsCategory === NewsCategory.TOP_STORIES && (
							<div 
								dangerouslySetInnerHTML={{ 
									__html: '<rssapp-wall id="arnV5TgNGBkCNn2x"></rssapp-wall>' 
								}} 
							/>
						)}
						{newsCategory === NewsCategory.BUSINESS && (
							<div 
								dangerouslySetInnerHTML={{ 
									__html: '<rssapp-wall id="t63bdOxjmePNDsMe"></rssapp-wall>' 
								}} 
							/>
						)}
						{newsCategory === NewsCategory.LIFESTYLE && (
							<div 
								dangerouslySetInnerHTML={{ 
									__html: '<rssapp-wall id="tIw28PeZ67ytt9t1"></rssapp-wall>' 
								}} 
							/>
						)}
						{newsCategory === NewsCategory.TECH && (
							<div 
								dangerouslySetInnerHTML={{ 
									__html: '<rssapp-wall id="tV3VFGsnqQkq2lBz"></rssapp-wall>' 
								}} 
							/>
						)}
						{newsCategory === NewsCategory.CELEBRITY && (
							<div 
								dangerouslySetInnerHTML={{ 
									__html: '<rssapp-wall id="tiMZFBEWoB2lAIKp"></rssapp-wall>' 
								}} 
							/>
						)}
						{newsCategory === NewsCategory.CRYPTO && (
							<div 
								dangerouslySetInnerHTML={{ 
									__html: '<rssapp-wall id="62qn2hrRHQlA8BnW"></rssapp-wall>' 
								}} 
							/>
						)}
					</div>
				</div>
			</div>
		</MainLayout>
	);
};

export default NewsPage;