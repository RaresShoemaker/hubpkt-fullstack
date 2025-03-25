import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useCategories } from '../../store/features/categories/useCategories';

const MobileMenu = () => {
	const [isOpen, setIsOpen] = useState(false);
	const { items, changeClientCategory } = useCategories();

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

	// Helper function to generate a URL-friendly slug
	const slugify = (text: string): string => {
		if (!text) return '';
		
		return text
			.toString()
			.toLowerCase()
			.trim()
			.replace(/\s+/g, '-')      // Replace spaces with -
			.replace(/[^\w-]+/g, '')   // Remove all non-word chars
			.replace(/--+/g, '-')      // Replace multiple - with single -
			.replace(/^-+/, '')        // Trim - from start of text
			.replace(/-+$/, '');       // Trim - from end of text
	};

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

				<div className='flex-1 flex flex-col gap-3 p-4'>
					{/* Home Button */}
					<Link 
						to="/" 
						onClick={() => {
							setIsOpen(false);
							changeClientCategory(null);
						}}
						className='flex items-center p-2 gap-2 text-white hover:bg-white/10 rounded-lg'
					>
						<span>Packet Hub</span>
					</Link>

					{/* Categories */}
					{items.map((category) => {
						let categoryLink;
						
						// Check if this is the Creator Hub item
						if (category.title.toLowerCase().includes('creator')) {
							categoryLink = '/creatorshub';
						} else {
							categoryLink = `/category/${slugify(category.title)}`;
						}

						return (
							<Link
								key={category.id}
								to={categoryLink}
								onClick={() => {
									setIsOpen(false);
									changeClientCategory(category);
								}}
								className='flex items-center p-2 gap-2 text-white hover:bg-white/10 rounded-lg'
							>
								<span>{category.title}</span>
							</Link>
						);
					})}
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