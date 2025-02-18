import React from 'react';

const GradientDivider: React.FC = () => {
	return (
		<hr
			className='h-[1px] w-full opacity-40 self-stretch'
			style={{
				background:
					'linear-gradient(90deg, rgba(217, 217, 217, 0.24) 0%, #D9D9D9 32%, rgba(217, 217, 217, 0) 100%)'
			}}
		/>
	);
};

export default GradientDivider;
