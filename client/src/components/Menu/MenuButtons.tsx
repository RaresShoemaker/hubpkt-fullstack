import React, { useCallback } from 'react';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';
import { useTransitionAnimation } from '../../context/TransitionAnimationContext/TransitionAnimationContext';

interface MenuButtonProps {
	title: string;
	icon: React.ReactNode;
	query?: string;
	link?: string;
}

const MenuButton: React.FC<MenuButtonProps> = ({ title, icon, query, link = '' }) => {
	const { category } = useTransitionAnimation();

	const isSelected = category === "" ? query === 'home' : category === query;

	const getImagesByCategory = useCallback((category: string | null): string[] => {
		switch (category) {
			case 'home':
				return ['/Home1.jpg', '/Home2.jpg', '/Home3.jpg'];
			case 'media':
				return ['/Media1.jpg', '/Media2.jpg', '/Media3.jpg'];
			case 'music':
				return ['/Music1.jpg', '/Music2.jpg', '/Music3.jpg'];
			case 'games':
				return ['/Games1.jpg', '/Games2.jpg', '/Games3.jpg'];
			case 'casino':
				return ['/Casino1.jpg', '/Casino2.jpg', '/Casino3.jpg', '/Casino4.jpg'];
			case 'technology':
				return ['/Technology1.jpg', '/Technology2.jpg', '/Technology3.jpg'];
			default:
				return ['/Home1.jpg', '/Home2.jpg', '/Home3.jpg'];
		}
	}, []);

	const handleMouseEnter = useCallback(() => {
		if (!query) return;

		const images = getImagesByCategory(query);

		// Preload images using both Image object and link preload
		images.forEach((src) => {
			// Method 1: Create new Image object
			const img = new Image();
			img.src = src;

			// Method 2: Add preload link
			const link = document.createElement('link');
			link.rel = 'preload';
			link.as = 'image';
			link.href = src;

			// Remove existing preload link for this image if it exists
			const existingLink = document.head.querySelector(`link[href="${src}"]`);
			if (existingLink) {
				document.head.removeChild(existingLink);
			}

			document.head.appendChild(link);
		});
	}, [query, getImagesByCategory]);

	return (
		<Link to={link ? link :  `/?category=${query}`} onMouseEnter={handleMouseEnter}>
			<div
				className={cn(
					'w-full rounded-lg text-white flex gap-2 items-center p-2',
					isSelected && 'bg-white/10 rounded-2xl [&_rect.icon-bg]:fill-white/50 [&_#icon-bg]:fill-opacity-100'
				)}
			>
				{icon}
				<p>{title}</p>
			</div>
		</Link>
	);
};

export default MenuButton;
