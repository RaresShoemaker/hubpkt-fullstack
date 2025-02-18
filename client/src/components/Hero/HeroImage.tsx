import React, { useState, useEffect, useMemo } from 'react';
import { useTransitionAnimation } from '../../context/TransitionAnimationContext/TransitionAnimationContext';
import { TRANSITION_DURATION } from '../../context/TransitionAnimationContext/constants';
import CtaButton from './CtaButton';
import { debounce } from 'lodash';
import { cn } from '../../lib/utils';

const HeroImage: React.FC = () => {
	const { activeIndex, isTransitioning, nextIndex, category } = useTransitionAnimation();
	const [isMobile, setIsMobile] = useState(false);
	const [isTablet, setIsTablet] = useState(false);

	const hrefCta = useMemo(
		() => [
			'https://www.youtube.com/watch?v=pr_nVsfoUm8',
			'https://podcasts.apple.com/us/podcast/the-charlie-shrem-show/id1462346183',
			'https://www.amazon.com/gp/video/detail/amzn1.dv.gti.7d23bc05-bf4e-4427-ac47-79d0d3c0142e?autoplay=0&ref_=atv_cf_strg_wb',
			'https://watch.amazon.com/detail?gti=amzn1.dv.gti.ef87b53e-6595-4fc4-b949-3789a8a39672',
			'https://www.amazon.com/Fire-Peter-Facinelli/dp/B0CHJK71MQ'
		],
		[]
	);

	const ctaLabel = useMemo(() => (activeIndex === 1 ? 'Listen Now' : 'Watch Now'), [activeIndex]);

	useEffect(() => {
		const checkDevice = () => {
			if (window.innerWidth < 768) {
				setIsMobile(true);
				setIsTablet(false);
			} else if (window.innerWidth < 1024 && window.innerWidth >= 769) {
				setIsMobile(false);
				setIsTablet(true);
			} else {
				setIsMobile(false);
				setIsTablet(false);
			}
		};

		const debouncedCheckMobile = debounce(checkDevice, 200);
		checkDevice();
		window.addEventListener('resize', debouncedCheckMobile);
		return () => window.removeEventListener('resize', debouncedCheckMobile);
	}, []);

	const getImagesByCategory = (category: string | null): string[] => {
		const suffix = isMobile ? '-mobile' : isTablet && (category === 'creators' || category === 'news') ? '-tablet' : '';

		switch (category) {
			case 'home':
				return [`/Home1${suffix}.jpg`, `/Home2${suffix}.jpg`, `/Home3${suffix}.jpg`];
			case 'media':
				return [`/Media1${suffix}.jpg`, `/Media2${suffix}.jpg`, `/Media3${suffix}.jpg`];
			case 'music':
				return [`/Music1${suffix}.jpg`, `/Music2${suffix}.jpg`, `/Music3${suffix}.jpg`];
			case 'games':
				return [`/Games1${suffix}.jpg`, `/Games2${suffix}.jpg`, `/Games3${suffix}.jpg`];
			case 'casino':
				return [`/Casino1${suffix}.jpg`, `/Casino2${suffix}.jpg`, `/Casino3${suffix}.jpg`];
			case 'news':
				return [`/News1${suffix}.jpg`, `/News2${suffix}.jpg`, `/News3${suffix}.jpg`];
			case 'creators':
				return [
					`/Creators1${suffix}.jpg`,
					`Creators2${suffix}.jpg`,
					`Creators3${suffix}.jpg`,
					`Creators4${suffix}.jpg`,
					`Creators5${suffix}.jpg`
				];
			case 'technology':
				return [`/Technology1${suffix}.jpg`, `/Technology2${suffix}.jpg`, `/Technology3${suffix}.jpg`];
			default:
				return [`/Home1${suffix}.jpg`, `/Home2${suffix}.jpg`, `/Home3${suffix}.jpg`];
		}
	};

	const images = useMemo(() => getImagesByCategory(category), [category, isMobile, isTablet]);

	useEffect(() => {
		const preloadImages = (images: string[]) => {
			images.forEach((src) => {
				const img = new Image();
				img.src = src;
			});
		};
		preloadImages(images);
	}, [images]);

	if (!images || images.length === 0) return null;

	if (images.length === 1) {
		return (
			<div className='md:relative h-[460px] lg:h-screen w-full'>
				<img
					src={images[0]}
					alt='Hero Background'
					className='absolute h-[460px] md:h-full w-full object-cover'
				/>
			</div>
		);
	}

	const currentImageIndex = activeIndex % images.length;
	const nextImageIndex = nextIndex % images.length;

	const transitionStyle = {
		transition: `opacity ${TRANSITION_DURATION}ms ease-in-out`
	};

	if (images.length === 1) {
		return (
			<div className='md:relative h-[400px] lg:h-screen w-full'>
				<img
					src={images[0]}
					alt='Hero Background'
					className='absolute inset-0 h-[460px] md:h-full w-full object-cover'
				/>
			</div>
		);
	}

	return (
		<div
			className='
          relative h-full lg:max-h-[1256px] w-full lg:max-w-screen-3xl 2xl:h-[130vh] 2xl:max-h-[140%]
        '
		>
			{/* Next image (bottom layer) */}
			<div>
				<img
					key={`next-${nextImageIndex}`}
					src={images[nextImageIndex]}
					loading='lazy'
					alt='Hero Background Next'
					className='absolute md:inset-0 md:h-full w-full object-cover'
				/>

				{/* Current image (top layer) */}
				<img
					key={`active-${currentImageIndex}`}
					src={images[currentImageIndex]}
					alt='Hero Background Current'
					className='absolute md:inset-0 md:h-full w-full object-cover'
					style={{
						...transitionStyle,
						opacity: isTransitioning ? 0 : 1
					}}
				/>
			</div>
			{category === 'creators' && isMobile && (
				<div className='absolute inset-0 w-full h-full flex items-center mt-[450px] md:mt-0'>
					<div className='h-40 relative w-[130%] flex flex-col items-start justify-center'>
						<div className='mt-5'>
							<div className='absolute h-full w-full bg-[#090D23] blur-[54px] z-0' />
							<div className='absolute h-full w-full bg-[#090D23] blur-[54px] z-0' />
							<div className='absolute h-full w-full bg-[#090D23] blur-[50px] z-0' />
							<div className='absolute h-full w-full bg-[#090D23] blur-[25px] z-0 left-20' />
							<div className='absolute h-full w-full bg-[#090D23] blur-[20px] z-0 right-24' />
						</div>
						<div
							className={cn(
								'z-40 mt-5 w-full flex justify-center transition-opacity duration-1000',
								isTransitioning ? 'opacity-0' : 'opacity-100'
							)}
						>
							<CtaButton href={hrefCta[activeIndex]} label={ctaLabel} />
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default React.memo(HeroImage);
