import React, { useEffect } from 'react';
import MenuButton from './MenuButtons';
import { Link } from 'react-router-dom';
import CreatorHubLogo from '../../assets/CreatorHubMenuLogo.svg?react';
import PktTvLogo from '../../assets/PktTvLogo.svg?react';
import NewsHubLogo from '../../assets/NewsHubLogo.svg?react';
import { useTransitionAnimation } from '../../context/TransitionAnimationContext/TransitionAnimationContext';
import { DiscordIcon, TwitterIcon, TelegramIcon } from '../../assets/icons';
import { useCategories } from '../../store/features/categories/useCategories';

const MenuCategory: React.FC = () => {
	const { category } = useTransitionAnimation();
	const { items, fetchCategoriesClient } = useCategories();

	useEffect(() => {
		const getCategories = async () => {
			await fetchCategoriesClient();
		}
		getCategories();
	}, [fetchCategoriesClient]);


	return (
		<div className='h-full md:hidden lg:w-full rounded-2xl bg-[#1B1B1B] px-4 py-6 lg:flex flex-col justify-between hidden shadow-[0_0_40px_0_rgba(62,74,192,0.24)]'>
			<div className='flex flex-col gap-4 align-middle	'>
				<MenuButton predefined='home' />
				{items.map((item) => {
					return (
						<MenuButton key={item.id} category={item} link={item.title.includes('Creator') ? '/creatorshub' : undefined} />
					);
				})}
			</div>
			{category === 'creators' && (
				<div className='mt-28'>
					<CreatorHubLogo className='w-full' />
				</div>
			)}
			{category === 'news' && (
				<div className='mt-28 mx-auto'>
					<div className='w-[195px]'>
						<NewsHubLogo className='w-full' />
					</div>
				</div>
			)}
			{category !== 'creators' && category !== 'news' && (
				<div className='mt-28 mx-auto'>
					<div className='w-[195px]'>
						<PktTvLogo className='w-full' />
					</div>
				</div>
			)}
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
			<div className='mt-auto'>
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
