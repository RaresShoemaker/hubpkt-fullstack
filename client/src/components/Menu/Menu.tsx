import React, { useMemo } from 'react';
import MenuButton from './MenuButtons';
import { Link } from 'react-router-dom';
import CreatorHubLogo from '../../assets/CreatorHubMenuLogo.svg?react';
// import PacketHubLogo from '../../assets/PacketHubMenuLogo.svg?react';
import PktTvLogo from '../../assets/PktTvLogo.svg?react';
import NewsHubLogo from '../../assets/NewsHubLogo.svg?react';
import { useTransitionAnimation } from '../../context/TransitionAnimationContext/TransitionAnimationContext';
import { DiscordIcon, TwitterIcon, TelegramIcon } from '../../assets/icons';

import {
	HomeIcon,
	MediaIcon,
	MusicIcon,
	GamesIcon,
	CasinoIcon,
	TechnologyIcon,
	CreatorsIcon,
	NewsIcon
} from '../../assets/icons';

const MenuCategory: React.FC = () => {
	const { category } = useTransitionAnimation();
	const menuItems = useMemo(
		() => [
			{ title: 'Packet Hub', icon: <HomeIcon />, query: 'home' },
			{ title: 'Creator Hub', icon: <CreatorsIcon />, query: 'creators', link: '/creatorhub' },
			{ title: 'News Hub', icon: <NewsIcon />, query: 'news', link: '/newshub' },
			{ title: 'Media', icon: <MediaIcon />, query: 'media' },
			{ title: 'Music', icon: <MusicIcon />, query: 'music' },
			{ title: 'Games', icon: <GamesIcon />, query: 'games' },
			{ title: 'Casino', icon: <CasinoIcon />, query: 'casino' },
			{ title: 'Technology', icon: <TechnologyIcon />, query: 'technology' }
		],
		[]
	);

	return (
		<div className='h-full md:hidden lg:w-full rounded-2xl bg-[#1B1B1B] px-4 py-6 lg:flex flex-col justify-between hidden shadow-[0_0_40px_0_rgba(62,74,192,0.24)]'>
			<div className='flex flex-col gap-4 align-middle	'>
				{menuItems.map((item, i) => {
					return (
						<MenuButton key={i} title={item.title} icon={item.icon} query={item.query} link={item.link} />
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
