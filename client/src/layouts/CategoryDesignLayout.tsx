import React from 'react';
import { DeviceSize, HtmlElement } from '../store/features/categoryDesigns/categoryDesigns.types';
import Hero from '../components/Hero/Hero';
import HeroElements from '../components/Hero/HeroElements';
import BlurTransition from '../components/BlurTransition';
import BackgroundTransition from '../components/BackgroundTransition';

interface CategoryDesignLayoutProps {
	heroImage?: string;
	backgroundGradient?: string;
	transitionGradient?: string;
	deviceSize?: DeviceSize;
	htmlElements?: HtmlElement[];
}

const CategoryDesignLayout: React.FC<CategoryDesignLayoutProps> = ({
	heroImage,
	backgroundGradient,
	transitionGradient,
	htmlElements
}) => {
	return (
		<div className='relative'>
			<div className='w-full min-h-screen flex flex-col'>
				{/* Background (covers entire layout) */}
				<div className='fixed inset-0 z-0'>
          <BackgroundTransition backgroundGradient={backgroundGradient} />
				</div>

				{/* Main content wrapper */}
				<div className='flex flex-col flex-grow z-10 overflow-x-hidden'>
					{/* Hero Container (fixed height) */}
          {/* This container here needs to be draggable, elements from HtmlElement Draggable elements will be dragged here */}
					<div className='w-full z-[5] h-[70vh] md:h-[52vh] pt-16 lg:pt-0'>
						<Hero image={heroImage}>{htmlElements && <HeroElements htmlTags={htmlElements} />}</Hero>
					</div>

					{/* Background Transition */}
          {transitionGradient && (
            <div className='w-full z-[5] h-[200px] relative justify-center '>
            <BlurTransition color={transitionGradient} blur={40} className='bottom-0 h-[230px]' />
          </div>
          )}

					{/* Main Content */}
					<div
            className='flex-grow z-[5] pt-16 lg:pt-0 lg:ml-[300px]'
          >
             {/* HtmlElement Draggable elements/menu */}
             {/* 
             Here will be developed a button factory, thatn is created with link, text style: primary or secondary
              When a Button is created and dragged over the HeroContainer, it will be added to the htmlElements array with the following structure:
              {
                "link": "/shop",
                        "text": "Shop Now",
                        "type": "button",
                        "style": "primary",
                        "position": "the position over the hero container"
              }
             */}
          </div>
				</div>
				<div className='fixed top-0 left-0 bottom-0  z-[10] py-4 px-3 hidden lg:block w-[300px]'>
					<div className='h-screen overflow-y-auto pb-48'>
						<div className='h-full md:hidden lg:w-full rounded-2xl bg-[#1B1B1B] px-4 py-6 lg:flex flex-col justify-between hidden shadow-[0_0_40px_0_rgba(62,74,192,0.24)]'>
							
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CategoryDesignLayout;
