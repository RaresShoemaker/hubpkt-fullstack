import React from 'react';
import { Link } from 'react-router-dom';

export interface CreatorsCardProps {
	alt: string;
	img?: React.ReactNode | string;
	logo?: React.ReactNode | string;
	description: string;
	title: string;
	genre?: string;
	href: string;
}

const CreatorsCard: React.FC<CreatorsCardProps> = ({ alt, img, logo, description, title, genre, href }) => {
	return (
		<div className='flex flex-col gap-3'>
			{/* Image Container */}
			<div className='relative md:w-64 md:h-60 w-48 h-44 hover:cursor-pointer'>
				{/* Image */}
				<Link to={href || '/'} target='_blank'>
					<div className='rounded-4xl overflow-hidden max-w-[192px] max-h-[180px] md:max-w-[256px] md:max-h-[240px]'>
						{typeof img === 'string' && <img src={img} alt={alt} className='w-full h-full object-cover' />}
						{typeof img === 'object' && img}
						{typeof logo === 'string' && <img src={logo} alt={alt} className='w-full h-full object-cover' />}
						{typeof logo === 'object' && logo}
					</div>
				</Link>
			</div>

			{/* Content */}
			<div className='flex flex-col gap-1'>
				<div>
					<h3 className='text-white text-lg font-semibold md:max-w-64 max-w-48 truncate'>{title}</h3>
				</div>
				<div className='h-auto min-h-[40px] w-auto md:max-w-64 max-w-48'>
					<p className='text-sm text-gray-100 line-clamp-2'>{description}</p>
				</div>
				<div>{genre && <p className='text-sm font-semibold text-gray-300 line-clamp-2'>{genre}</p>}</div>
			</div>
		</div>
	);
};

export default CreatorsCard;
