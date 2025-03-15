import React from 'react';
import { cn } from '../../../lib/utils';
import { DesignElement } from '../../../store/features/categoryDesigns/categoryDesigns.types';
import ButtonBase from '../Buttons/ButtonBase';
import { Edit, Trash2, Code } from 'lucide-react';

interface CategoryDesignCardProps {
  designElement: DesignElement;
  onEdit: () => void;
  onDelete: () => void;
  isDark: boolean;
}

const CategoryDesignCard: React.FC<CategoryDesignCardProps> = ({
  designElement,
  onEdit,
  onDelete,
  isDark
}) => {
  const hasHtmlElements = designElement.htmlElements && designElement.htmlElements.length > 0;

  return (
    <div className={cn(
      "rounded-lg overflow-hidden border transition-all",
      isDark 
        ? "bg-dark-surface border-dark-border/30 hover:border-dark-border/50" 
        : "bg-light-surface border-light-border/30 hover:border-light-border/50"
    )}>
      {/* Image preview with order badge */}
      <div className="relative">
        <img
          src={designElement.image}
          alt="Design element"
          className="w-full h-40 object-cover"
        />
        
        {/* Order badge */}
        <div className={cn(
          "absolute top-2 right-2 px-2 py-1 rounded-md text-sm font-medium",
          isDark ? "bg-dark-surface/80 text-dark-text-primary" : "bg-light-surface/80 text-light-text-primary"
        )}>
          Order: {designElement.order}
        </div>
      </div>

      {/* Card content */}
      <div className="p-4">
        {/* Background Gradient */}
        {designElement.backgroundGradient && (
          <div className="mb-3">
            <p className={cn(
              "text-sm font-medium mb-1",
              isDark ? "text-dark-text-secondary" : "text-light-text-secondary"
            )}>
              Background Gradient
            </p>
            <div 
              className="h-8 rounded-md w-full"
              style={{ background: designElement.backgroundGradient }}
            ></div>
          </div>
        )}

        {/* Transition Gradient */}
        {designElement.transitionGradient && (
          <div className="mb-3">
            <p className={cn(
              "text-sm font-medium mb-1",
              isDark ? "text-dark-text-secondary" : "text-light-text-secondary"
            )}>
              Transition Gradient
            </p>
            <div 
              className="h-8 rounded-md w-full"
              style={{ background: designElement.transitionGradient }}
            ></div>
          </div>
        )}

        {/* HTML Elements badge */}
        {hasHtmlElements && (
          <div className={cn(
            "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium mb-3",
            isDark 
              ? "bg-dark-background text-dark-text-accent" 
              : "bg-light-background text-light-text-accent"
          )}>
            <Code size={14} />
            <span>{designElement.htmlElements.length} HTML elements</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-2">
          <ButtonBase
            variant="ghost"
            onClick={onEdit}
            className={cn("px-2 py-1")}
            leftIcon={<Edit size={16} />}
          >
            Edit
          </ButtonBase>

          <ButtonBase
            variant="ghost"
            onClick={onDelete}
            className={cn(
              "px-2 py-1",
              isDark ? "text-red-400 hover:text-red-300" : "text-red-500 hover:text-red-600"
            )}
            leftIcon={<Trash2 size={16} />}
          >
            Delete
          </ButtonBase>
        </div>
      </div>
    </div>
  );
};

export default CategoryDesignCard;