import React, { useEffect, useState, useCallback } from 'react';
import MenuCategory from '../components/Menu/Menu';
import HeroContainer from '../components/Hero/HeroContainer';
import NavbarMobile from '../components/NavbarMobile';
import Footer from '../components/Footer';
import CategoryBgTransition from '../components/Category/CategoryBgTransition';
import { cn } from '../lib/utils';
import { useTransitionAnimation } from '../context/TransitionAnimationContext/TransitionAnimationContext';

interface CategoryOverviewLayout {
	children: React.ReactNode;
}

const CategoryOverviewLayout: React.FC<CategoryOverviewLayout> = ({ children }) => {
	const [hasScrolled, setHasScrolled] = useState(false);
	const { category } = useTransitionAnimation();

	const handleScroll = useCallback(() => {
		// Only execute on md screens and above (768px is Tailwind's md breakpoint)
		if (window.innerWidth < 1024) return;

		const scrollPosition = window.scrollY;

		// Reset states when user scrolls back to top
		if (scrollPosition === 0) {
			setHasScrolled(false);
			return;
		}

		// Trigger scroll down when user starts scrolling
		if (!hasScrolled && scrollPosition > 30) {
			setHasScrolled(true);
			window.scrollTo({
				top: category !== 'creators' ? 500 : 430,
				behavior: 'smooth'
			});
		}
	}, [category, hasScrolled]);

	useEffect(() => {
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [handleScroll]);

	useEffect(() => {
		const scrollToTop = () => {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		};

		scrollToTop();
	}, [category]);

	return (
		<CategoryBgTransition>
			{/* Main scrollable container */}
			<div className='flex-grow relative'>
				{/* Hero Container */}
				<div className='hidden md:block absolute inset-0 overflow-x-hidden'>
					<HeroContainer />
				</div>

				{/* Overflow wrapper */}
				<div className='relative z-10 overflow-y-auto h-screen md:overflow-y-visible md:h-auto'>
					<NavbarMobile />
					<div className='md:hidden absolute inset-0 overflow-x-hidden'>
						<HeroContainer />
					</div>
					<div className='pl-4 mb-24'>
						<div className='grid lg:grid-cols-[300px_1fr] lg:gap-10'>
							{/* Menu section */}
							<div className='md:block -mb-10 md:mb-0'>
								<div
									className={`lg:sticky lg:top-4 lg:max-h-[800px] max-h-[480px] h-screen transition-transform duration-1000 ease-in-out`}
								>
									<MenuCategory />
								</div>
							</div>

							{/* Main content with overflow control */}
							<div className='overflow-x-hidden z-10 md:z-0 md:mt-0'>
								<div className='flex flex-col'>
									{/* Spacer */}
									<div className={cn(category !== 'creators' ? 'lg:h-[550px]' : 'lg:h-[470px]')} />

									{/* Content */}
									<div className='w-full'>{children}</div>
								</div>
							</div>
						</div>
					</div>
					<Footer />
				</div>
			</div>
		</CategoryBgTransition>
	);
};

export default CategoryOverviewLayout;
