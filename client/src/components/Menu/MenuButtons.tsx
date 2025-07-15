/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';
import { useCategories } from '../../store/features/categories/useCategories';
import { CategoryIcon } from '../Admin/Navigation/CategoryIcon';
import { HomeIcon } from '../../assets/icons';

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

// Helper function to check if a category is a home category
const isHomeCategory = (category: any): boolean => {
  if (!category) return false;
  return category.title?.toLowerCase().includes('home') || 
         (category.previewTitle && category.previewTitle.toLowerCase().includes('home'));
};

// Use the actual CategoryClient type from your store
interface CategoryData {
  image: string;
  id: string;
  title: string;
  hasPreview: boolean;
  previewTitle?: string;
  isAvailable: boolean;
  order: number;
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
  link, 
  customTitle 
}) => {
  const { clientCategory, changeClientCategory } = useCategories();
  
  // Handle predefined menu items
  if (predefined === 'home') {
    // Check if current category is null OR if it's a home category
    const isSelected = clientCategory === null || isHomeCategory(clientCategory);
    
    return (
      <Link to="/" onClick={() => changeClientCategory(null)}>
        <div
          className={cn(
            'w-full rounded-lg text-white flex gap-2 items-center p-2',
            isSelected && 'bg-white/10 rounded-2xl'
          )}
        >
          <div className="w-9 h-9 flex items-center justify-center">
            <HomeIcon width={36} height={36} />
          </div>
          <p>Packet Hub</p>
        </div>
      </Link>
    );
  }

  // For regular category items
  if (category) {
    // Don't render unavailable categories
    if (!category.isAvailable) {
      return null;
    }
    
    // Check if this category is selected
    // Exclude home categories from showing as selected in the regular menu
    const isSelected = clientCategory?.id === category.id && !isHomeCategory(category);

    // Special route for Creator Hub
    let categoryLink = link;
    
    // If no explicit link is provided, determine based on category title
    if (!categoryLink) {
      if (category.title.toLowerCase().includes('creator')) {
        categoryLink = '/creatorshub';
      } else {
        categoryLink = `/category/${slugify(category.title)}`;
      }

      if (category.title.toLowerCase().includes('news')) {
        categoryLink = '/newshub';
      }
    }

    // Handle click to change the selected category
    const handleCategoryClick = () => {
      changeClientCategory(category);
    };

    return (
      <Link 
        to={categoryLink}
        onClick={handleCategoryClick}
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
            size="md" 
          />
          <p>{customTitle || category.previewTitle || category.title}</p>
        </div>
      </Link>
    );
  }

  return null; // Return null if neither predefined nor category is provided
};

export default MenuButton;