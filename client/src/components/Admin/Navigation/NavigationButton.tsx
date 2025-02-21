import React from 'react';
import { CategoryIcon } from './CategoryIcon';
import { useTheme } from '../../../store/features/ui/useUITheme';

interface NavigationButtonProps {
  isSelected: boolean;
  title: string;
  image: string;
  handleCategoryClick: () => void;
}

const NavigationButton: React.FC<NavigationButtonProps> = ({title, image, isSelected, handleCategoryClick}) => {
	const { isDark } = useTheme();

	return (
		<div
			className={`p-2 rounded-lg transition-colors cursor-pointer
                      ${isDark ? 'hover:bg-dark-border/20' : 'hover:bg-light-border/20'},
                      ${isSelected ? 'bg-dark-border/20' : 'bg-transparent'}
                      `}
			onClick={handleCategoryClick}
		>
			<div className='flex items-center gap-3'>
				<CategoryIcon image={image} title={title} />
				<p className={isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}>{title}</p>
			</div>
		</div>
	);
};

export default NavigationButton;
