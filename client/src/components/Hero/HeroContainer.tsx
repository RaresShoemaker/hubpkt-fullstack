import React, { useMemo } from 'react';
import HeroImage from './HeroImage';
import TransitionGradient from '../TransitionGradient';
import HeroText from './HeroText';
import PktHubLogo from '../../assets/PktHubLogo.svg';
import { Link } from 'react-router-dom';
import { useTransitionAnimation } from '../../context/TransitionAnimationContext/TransitionAnimationContext';
import { cn } from '../../lib/utils';
import CtaButton from './CtaButton';

const HeroContainer: React.FC = () => {
	const { category, activeIndex, isTransitioning } = useTransitionAnimation();

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

	const newsHrefCta = useMemo(
		() => [
			'https://www.msnbc.com/rachel-maddow-show/maddowblog/doge-power-grabs-are-anything-americans-seen-rcna190427',
			'https://youtu.be/z6TpwHFE1AM?si=ADaa0-lq5h8AtOZO',
			'https://www.wired.com/story/true-story-behind-kendrick-lamar-super-bowl-halftime-show/'
		],
		[]
	);

	const ctaLabel = useMemo(() => (activeIndex === 1 ? 'Listen Now' : 'Watch Now'), [activeIndex]);

	return (
		<>
			{category !== 'creators' && category !== 'news' && (
				<div
					className={cn(
						'absolute top-0 left-0 right-0 md:h-[770px] w-full',
						!category
							? 'min-h-[380px] max-h-[450px] md:max-h-none h-full'
							: category !== 'home'
							? 'min-h-[380px] max-h-[450px] md:max-h-none h-full'
							: 'min-h-[380px] max-h-[450px] md:max-h-none h-full'
					)}
				>
					<HeroImage />
					<TransitionGradient />
				</div>
			)}

			{category === 'creators' && (
				<>
					<div className='md:hidden relative max-h-[650px] md:h-[650px] w-full flex flex-col justify-center items-center'>
						<HeroImage />
					</div>

					<div className='hidden md:flex lg:hidden h-full max-h-[650px] md:max-h-[650px] w-full flex-col relative'>
						<HeroImage />
						<div className='flex absolute w-full'>
							<div className='h-56 mt-72 relative w-full flex flex-col justify-end'>
								<div className='-mt-5'>
									<div className='absolute h-full w-full bg-[#090D23] blur-[54px] z-0' />
									<div className='absolute h-full w-full bg-[#090D23] blur-[54px] z-0' />
									<div className='absolute h-full w-full bg-[#090D23] blur-[50px] z-0' />
									<div className='absolute h-full w-full bg-[#090D23] blur-[25px] z-0 left-20' />
									<div className='absolute h-full w-full bg-[#090D23] blur-[20px] z-0 right-24' />
								</div>
								<div
									className={cn(
										'w-full z-40 flex justify-center items-center transition-opacity duration-1000',
										isTransitioning ? 'opacity-0' : 'opacity-100'
									)}
								>
									<CtaButton href={hrefCta[activeIndex]} label={ctaLabel} />
								</div>
							</div>
						</div>
					</div>

					<div className={cn('hidden lg:flex h-full md:max-h-[1000px] w-full flex-col relative')}>
						<HeroImage />
						<div className='absolute h-full w-full flex justify-center items-center'>
							<div className='mt-8'>
								<div className='absolute h-full w-full bg-[#090D23] blur-[24px] z-0' />
								<div className='absolute h-full w-full bg-[#090D23] blur-[24px] z-0' />
								<div className='absolute h-full w-full bg-[#090D23] blur-[30px] z-0' />
								<div className='absolute h-full w-full bg-[#090D23] blur-[25px] z-0 left-20' />
								<div className='absolute h-full w-full bg-[#090D23] blur-[20px] z-0 right-24' />
							</div>
							<div
								className={cn(
									'w-full z-40 flex justify-center items-center transition-opacity duration-1000',
									isTransitioning ? 'opacity-0' : activeIndex === 0 ? 'opacity-0 hidden' : 'opacity-100',
									activeIndex === 1 && 'mb-64 mr-14 2xl:mt-20',
									activeIndex === 2 && 'mb-40 mr-28 2xl:mt-28',
									activeIndex === 3 && 'mb-64 mr-8 2xl:mt-24',
									activeIndex === 4 && 'mb-52 mr-20 2xl:mt-32'
								)}
							>
								<CtaButton href={hrefCta[activeIndex]} label={ctaLabel} />
							</div>
						</div>
						<div className='-mt-52'>
							<TransitionGradient />
						</div>
					</div>
				</>
			)}
			{category === 'news' && (
				<>
					<div className='md:hidden relative max-h-[650px] md:h-[650px] w-full flex flex-col justify-center items-center'>
						<HeroImage />
						<div className='mt-[520px] md:mt-52'>
							<TransitionGradient />
							<div className='md:hidden'>
								<TransitionGradient />
							</div>
						</div>
						<div
							className={cn(
								'z-40 absolute h-full w-full flex justify-center items-end mb-28 transition-opacity duration-1000',
								isTransitioning ? 'opacity-0' : 'opacity-100'
							)}
						>
							<CtaButton href={newsHrefCta[activeIndex]} label='Read Story' />
						</div>
					</div>

					<div className='hidden md:flex lg:hidden h-full max-h-[650px] md:max-h-[650px] w-full flex-col relative'>
						<HeroImage />
						<div className='flex absolute w-full'>
							<div className='h-56 mt-72 relative w-full flex flex-col justify-end'>
								<div className='mt-20'>
									<div className='absolute h-full w-full bg-[#090D23] blur-[54px] z-0' />
									<div className='absolute h-full w-full bg-[#090D23] blur-[54px] z-0' />
									<div className='absolute h-full w-full bg-[#090D23] blur-[50px] z-0' />
									<div className='absolute h-full w-full bg-[#090D23] blur-[25px] z-0 left-20' />
									<div className='absolute h-full w-full bg-[#090D23] blur-[20px] z-0 right-24' />
								</div>
								<div
									className={cn(
										'w-full z-40 flex justify-center items-center transition-opacity duration-1000',
										isTransitioning ? 'opacity-0' : 'opacity-100'
									)}
								>
									<div className='z-40 absolute h-full w-full flex justify-center items-center mb-44'>
										<CtaButton href={newsHrefCta[activeIndex]} label='Read Story' />
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className={cn('hidden lg:flex h-full md:max-h-[1000px] w-full flex-col relative')}>
						<HeroImage />
						<div className='absolute h-full w-full flex justify-center items-center'>
							<div className='mt-8'>
								<div className='absolute h-full w-full bg-[#090D23] blur-[24px] z-0' />
								<div className='absolute h-full w-full bg-[#090D23] blur-[24px] z-0' />
								<div className='absolute h-full w-full bg-[#090D23] blur-[30px] z-0' />
								<div className='absolute h-full w-full bg-[#090D23] blur-[25px] z-0 left-20' />
								<div className='absolute h-full w-full bg-[#090D23] blur-[20px] z-0 right-24' />
							</div>
							<div
								className={cn(
									'w-full z-40 flex justify-center items-center transition-opacity duration-1000',
									isTransitioning ? 'opacity-0' : 'opacity-100',
									activeIndex === 0 && 'mb-52 mr-[5%] 2xl:mt-36',
									activeIndex === 1 && 'mb-52 mr-[5%] 2xl:mt-36',
									activeIndex === 2 && 'mb-52 mr-[5%] 2xl:mt-36'
								)}
							>
								<CtaButton href={newsHrefCta[activeIndex]} label='Read Story' />
							</div>
						</div>
						<div className='-mt-52'>
							<TransitionGradient />
						</div>
					</div>
				</>
			)}
			<div
				className={cn(
					'hidden lg:block z-50 absolute top-0 md:left-auto md:right-10 left-10 transition-all duration-500 ease-in-out transform'
				)}
			>
				<Link to='/'>
					<img src={PktHubLogo} alt='Packet Hub Logo' className='w-14 h-14 mx-auto mt-10 fixed md:static' />
				</Link>
			</div>
			{category !== 'creators' && category !== 'news' && (
				<HeroText description='Discover content platforms from around the world' />
			)}
		</>
	);
};

export default HeroContainer;
