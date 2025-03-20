import React from 'react';

interface BackgroundTransitionProps {
	backgroundGradient?: string;
}

const BackgroundTransition: React.FC<BackgroundTransitionProps> = ({ backgroundGradient }) => {
	return (
		<div
			className='w-full h-full'
			style={{
				background: `${backgroundGradient}`
			}}
		>
			{/* Main background for the entire page */}
		</div>
	);
};

export default BackgroundTransition;
