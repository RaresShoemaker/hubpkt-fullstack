import React, { useState } from 'react';
import { Plus, Edit } from 'lucide-react';
import { Category } from '../../../store/features/categories/categories.types';
import { useTheme } from '../../../store/features/ui/useUITheme';
import InfoPopup from '../InfoPopup';
import { CategoryIcon } from '../Navigation/CategoryIcon';

// Enhanced props to include optional onEdit callback
type CategoryCardProps = 
  | (Category & { 
      isForCreate?: false; 
      onEdit?: (id: string) => void; 
    }) 
  | { 
      isForCreate: true; 
      onClick: () => void; 
    };

const CategoryCard: React.FC<CategoryCardProps> = (props) => {
  const { isDark } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  // If it's a create card
  if (props.isForCreate) {
    return (
      <button
        onClick={props.onClick}
        className={`p-6 rounded-xl border-2 border-dashed transition-colors duration-300 cursor-pointer w-full
          ${isDark 
            ? 'bg-dark-background border-dark-border/30 hover:border-dark-text-accent hover:bg-dark-surface/50' 
            : 'bg-light-background border-light-border/30 hover:border-light-text-accent hover:bg-light-surface/50'
          }`}
        aria-label="Create new category"
      >
        <div className='flex items-center gap-4 justify-center'>
          <h3 className={`text-lg font-medium ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
            Add Category
          </h3>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center
            ${isDark ? 'bg-dark-surface' : 'bg-light-surface'}`}>
            <Plus 
              size={20} 
              className={isDark ? 'text-dark-text-accent' : 'text-light-text-accent'} 
            />
          </div>
        </div>
        <div className='mt-4 flex justify-center'>
          <p className={`${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
            Click to create a new category
          </p>
        </div>
      </button>
    );
  }

  // Regular category card
  const { id, title, isAvailable, hasPreview, image, onEdit } = props;

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent parent click handlers from firing
    if (onEdit) {
      onEdit(id);
    }
  };

  return (
    <div
      className={`p-6 rounded-xl border transition-colors duration-300 relative
        ${isDark ? 'bg-dark-background border-dark-border/20' : 'bg-light-background border-light-border/20'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Edit overlay that appears on hover */}
      {isHovered && onEdit && (
        <div 
          className={`absolute inset-0 flex items-center justify-center 
            rounded-xl transition-opacity duration-200
            ${isDark ? 'bg-dark-background/70' : 'bg-light-background/70'}`}
          onClick={handleEditClick}
        >
          <div className={`p-3 rounded-full cursor-pointer
            ${isDark ? 'bg-dark-surface hover:bg-dark-surface/80' : 'bg-light-surface hover:bg-light-surface/80'}`}>
            <Edit 
              size={24} 
              className={isDark ? 'text-dark-text-accent' : 'text-light-text-accent'} 
            />
          </div>
        </div>
      )}

      {/* Card content */}
      <div className='flex items-center gap-4 justify-center'>
        <h3 className={`text-lg font-medium ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
          {title}
        </h3>
        <CategoryIcon image={image} title={title} size="md" />
      </div>
      <div className='mt-4 flex gap-4'>
        <div className='flex gap-2'>
          <p className={`${isDark ? 'text-dark-text-accent' : 'text-light-text-accent'}`}>
            {isAvailable ? 'Available' : 'Unavailable'}
          </p>
          <InfoPopup
            content={
              isAvailable
                ? 'This Category will be available for users to interact with.'
                : 'This Category is not available for user to interact with.'
            }
          />
        </div>
        <div className='flex gap-2'>
          <p className={`${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
            {hasPreview ? 'Preview available' : 'No preview available'}
          </p>
          <InfoPopup
            content={
              hasPreview
                ? 'This Category will be rendered on the Packet Hub HomePage'
                : 'This Category will not be rendered on the Packet Hub HomePage'
            }
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;