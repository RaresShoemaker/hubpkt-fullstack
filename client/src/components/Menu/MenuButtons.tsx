import React from 'react';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';
import { useCategories } from '../../store/features/categories/useCategories';
import { CategoryIcon } from '../Admin/Navigation/CategoryIcon';
import { HomeIcon } from '../../assets/icons';

// New interface for category data based on the provided structure
interface CategoryData {
  id: string;
  title: string;
  image: string;
  order: number;
  hasPreview: boolean;
  isAvailable: boolean;
  previewTitle?: string;
  hasSquareContent: boolean;
}

// Predefined menu item types
type PredefinedMenuType = 'home' | 'category';

interface MenuButtonProps {
  // Either use a predefined type or a regular category
  predefined?: PredefinedMenuType;
  category?: CategoryData;
  link?: string;
  customTitle?: string;
}

const MenuButton: React.FC<MenuButtonProps> = ({ 
  predefined, 
  category, 
  link = '', 
  customTitle 
}) => {
  const { clientCategory, changeClientCategory } = useCategories();

  // Handle predefined menu items
  if (predefined === 'home') {
    const isSelected = clientCategory === null;
    
    return (
      <Link to="/" onClick={() => changeClientCategory(null)}>
        <div
          className={cn(
            'w-full rounded-lg text-white flex gap-2 items-center p-2',
            isSelected && 'bg-white/10 rounded-2xl'
          )}
        >
          <div className="h-10 w-10 flex items-center justify-center">
            <HomeIcon />
          </div>
          <p>Packet Hub</p>
        </div>
      </Link>
    );
  }

  // For regular category items
  if (category) {
    // Check if this category is selected
    const isSelected = clientCategory?.id === category.id;

    return (
      <Link 
        to={link ? link : `/?category=${category.title.toLocaleLowerCase()}`}
        onClick={() => changeClientCategory(category)}
      >
        <div
          className={cn(
            'w-full rounded-lg text-white flex gap-2 items-center p-2',
            isSelected && 'bg-white/10 rounded-2xl [&_rect.icon-bg]:fill-white/50 [&_#icon-bg]:fill-opacity-100'
          )}
        >
          <CategoryIcon 
            title={category.title} 
            image={category.image} 
            size="custom" 
            customSize='h-10 w-10'
          />
          <p>{customTitle || category.previewTitle || category.title}</p>
        </div>
      </Link>
    );
  }

  return null; // Return null if neither predefined nor category is provided
};

export default MenuButton;