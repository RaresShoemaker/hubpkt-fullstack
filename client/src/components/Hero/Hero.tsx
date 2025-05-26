"use client"
import React from 'react';
import HeroImage from './HeroImage';
import HeroContainer from './HeroContainer';
import { useEffect, useState } from 'react';
import { DeviceSize } from '../../store/features/categoryDesigns/categoryDesigns.types';
interface HeroProps {
	image?: string;
	children?: React.ReactNode;
}

const Hero: React.FC<HeroProps> = ({image = "./Home1.jpg", children}) => {
		const [currentDevice, setCurrentDevice] = useState<DeviceSize>(DeviceSize.desktop);

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

	return (
		<HeroContainer
			columns={currentDevice === DeviceSize.desktop ? 12 : currentDevice === DeviceSize.mobile ? 5 : 10}
			rows={6}
			background={<HeroImage src={image} alt='Creator showcase' overlay={true} overlayOpacity={0} />}
		>
				{children}
		</HeroContainer>
	);
};

export default Hero;
