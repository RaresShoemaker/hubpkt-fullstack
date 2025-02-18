import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

import MenuButton from './MenuButtons';
import { HomeIcon, MediaIcon, MusicIcon, GamesIcon, CasinoIcon, TechnologyIcon, CreatorsIcon, NewsIcon } from '../../assets/icons';

const MobileMenu = () => {
	const [isOpen, setIsOpen] = useState(false);

	// Lock body scroll when menu is open
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}
		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [isOpen]);

	const menuItems = [
		{ title: 'Packet Hub', icon: <HomeIcon />, query: 'home' },
		{ title: 'Creator Hub', icon: <CreatorsIcon />, link: '/creatorhub', query: 'creators' },
		{ title: 'News Hub', icon: <NewsIcon />, query: 'news', link: '/newshub' },
		{ title: 'Media', icon: <MediaIcon />, query: 'media' },
		{ title: 'Music', icon: <MusicIcon />, query: 'music' },
		{ title: 'Games', icon: <GamesIcon />, query: 'games' },
		{ title: 'Casino', icon: <CasinoIcon />, query: 'casino' },
		{ title: 'Technology', icon: <TechnologyIcon />, query: 'technology' }
	];

	const MenuContent = () => (
		<div className='fixed inset-0 bg-[#1B1B1B] z-50 lg:hidden pt-7'>
			<div className='flex flex-col h-full md:px-5 md:text-xl lg:px-0'>
				<div className='flex justify-end px-5 md:px-0'>
					<button
						onClick={() => setIsOpen(false)}
						className='md:-pr-5 text-white hover:text-gray-300 transition-colors'
						aria-label='Close menu'
					>
						<X size={24} />
					</button>
				</div>

				<div className='flex-1 flex flex-col gap-3'>
					{menuItems.map((item, i) => (
						<div key={i} onClick={() => setIsOpen(false)}>
							<MenuButton title={item.title} icon={item.icon} query={item.query} link={item.link}/>
						</div>
					))}
				</div>

				<div className='mt-auto pb-6 px-6'>
					<Link
						to='/submission'
						onClick={() => setIsOpen(false)}
						className='rounded-full bg-primary text-white font-medium w-full h-12 flex items-center justify-center'
					>
						Submit Channel
					</Link>
				</div>
			</div>
		</div>
	);

	return (
		<>
			<div className='h-12 w-12 bg-white/25 rounded-full p-1 glass-black z-40'>
				<button
					onClick={() => setIsOpen(true)}
					className='p-2 text-white hover:text-gray-300 transition-colors lg:hidden'
					aria-label='Open menu'
				>
					<Menu size={24} />
				</button>
			</div>

			{isOpen && createPortal(<MenuContent />, document.body)}
		</>
	);
};

export default MobileMenu;
