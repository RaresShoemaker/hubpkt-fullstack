import React from 'react';
import HeroGridItem from './HeroGridItem';
import HeroImage from './HeroImage';
import HeroContainer from './HeroContainer';

const Hero: React.FC = () => {
	return (
		<HeroContainer
			columns={12}
			rows={6}
			gapX={16}
			gapY={12}
			padding={{ x: 16, y: 16 }}
			gridClassName='p-4 md:p-8 lg:p-12'
			background={<HeroImage src='./Home1.jpg' alt='Creator showcase' overlay={true} overlayOpacity={0} />}
		>
			<HeroGridItem
				gridClasses='col-start-4 col-span-2 col-end-6 row-start-4 row-span-2 row-end-6'
				align='center'
			>
				<button className='bg-transparent border-2 border-white text-white font-bold py-3 px-6 rounded-full hover:bg-white hover:text-purple-600 transition duration-300 w-full'>
					Learn More
				</button>
			</HeroGridItem>
		</HeroContainer>
	);
};

export default Hero;
