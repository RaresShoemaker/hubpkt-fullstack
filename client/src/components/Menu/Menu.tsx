import React, { useEffect } from 'react';
import MenuButton from './MenuButtons';
import { Link } from 'react-router-dom';
import { DiscordIcon, TwitterIcon, TelegramIcon } from '../../assets/icons';
import { useCategories } from '../../store/features/categories/useCategories';

const MenuCategory: React.FC = () => {
	const { items, fetchCategoriesClient } = useCategories();

	// Fetch categories on mount to ensure we have the data
	useEffect(() => {
		const getCategories = async () => {
			await fetchCategoriesClient();
		};
		getCategories();
	}, [fetchCategoriesClient]);

	return (
		<div className='h-full md:hidden lg:w-full rounded-2xl bg-[#1B1B1B] px-4 py-6 lg:flex flex-col justify-between hidden shadow-[0_0_40px_0_rgba(62,74,192,0.24)]'>
			<div className='flex flex-col gap-4 align-middle	'>
				{/* Home button */}
				<MenuButton predefined='home' />
				
				{/* Category buttons */}
				{items.map((item) => {
					// Special case for Creator Hub
					const specialLink = item.title.includes('Creator') 
					  ? '/creatorshub' 
					  : undefined;
					
					return (
						<MenuButton
							key={item.id}
							category={item}
							link={specialLink}
						/>
					);
				})}
			</div>
			
			{/* Footer section */}
			<div className='mt-auto flex flex-col gap-4'>
				<div className='flex gap-4 mt-4 h-10 mx-auto justify-center items-center'>
					<div className='hover:cursor-pointer flex justify-center items-center'>
						<Link to='https://telegram.me/pktcash' target='_blank'>
							<TelegramIcon />
						</Link>
					</div>
					<div className='hover:cursor-pointer flex justify-center items-center'>
						<Link to='https://discord.com/invite/bjJutHm9CN' target='_blank'>
							<DiscordIcon />
						</Link>
					</div>
					<div className='hover:cursor-pointer flex justify-center items-center'>
						<Link to='https://x.com/pktcash' target='_blank'>
							<TwitterIcon />
						</Link>
					</div>
				</div>
				<Link to='/submission'>
					<button className='rounded-full bg-primary text-white font-medium w-full h-12'>
						Submit Channel
					</button>
				</Link>
			</div>
		</div>
	);
};

export default MenuCategory;