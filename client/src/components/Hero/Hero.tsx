import React from 'react';
import HeroImage from './HeroImage';
import HeroContainer from './HeroContainer';

interface HeroProps {
	image?: string;
	children?: React.ReactNode;
}

const Hero: React.FC<HeroProps> = ({image = "./Home1.jpg", children}) => {
	return (
		<HeroContainer
			columns={12}
			rows={6}
			gapX={16}
			gapY={12}
			padding={{ x: 16, y: 16 }}
			gridClassName='p-4 md:p-8 lg:p-12'
			background={<HeroImage src={image} alt='Creator showcase' overlay={true} overlayOpacity={0} />}
		>
				{children}
		</HeroContainer>
	);
};

export default Hero;
