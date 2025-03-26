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
			background={<HeroImage src={image} alt='Creator showcase' overlay={true} overlayOpacity={0} />}
		>
				{children}
		</HeroContainer>
	);
};

export default Hero;
