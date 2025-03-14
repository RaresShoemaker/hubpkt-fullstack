/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { cn } from '../../../lib/utils';
import ButtonBase from '../Buttons/ButtonBase';
import { Edit, Trash2 } from 'lucide-react';
import { useTheme } from '../../../store/features/ui/useUITheme';
import { DesignElement } from '../../../store/features/categoryDesigns/categoryDesigns.types';

interface CategoryDesignCardProps {
  element: DesignElement;
  onEdit: (element: DesignElement) => void;
  onDelete: (elementId: string) => void;
}

const CategoryDesignCard: React.FC<CategoryDesignCardProps> = ({
  element,
  onEdit,
  onDelete
}) => {
  const { isDark } = useTheme();
  
  // Determine device size display value
  const deviceSizeDisplay = element.deviceSize || (element as any).device || 'unknown';
  
  return (
    <div 
      className={cn(
        "border rounded-lg overflow-hidden shadow transition-shadow hover:shadow-md",
        isDark ? "bg-dark-surface border-dark-border" : "bg-light-surface border-light-border"
      )}
    >
      {/* Image preview */}
      <div className="relative aspect-video">
        <img 
          src={element.url} 
          alt={`Design element ${element.id}`}
          className="w-full h-full object-cover"
        />
        
        {/* Actions overlay */}
        <div className={cn(
          "absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity",
          "flex items-center justify-center gap-3"
        )}>
          <ButtonBase
            variant="ghost"
            size="sm"
            onClick={() => onEdit(element)}
            leftIcon={<Edit size={16} className="text-white" />}
            className="bg-black/50 text-white hover:bg-black/70"
          >
            Edit
          </ButtonBase>
          <ButtonBase
            variant="ghost"
            size="sm"
            onClick={() => onDelete(element.id)}
            leftIcon={<Trash2 size={16} className="text-white" />}
            className="bg-black/50 text-white hover:bg-black/70"
          >
            Delete
          </ButtonBase>
        </div>
      </div>
      
      {/* Info section */}
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div className={cn(
            "px-2 py-1 rounded-md text-xs",
            isDark ? "bg-dark-border/20" : "bg-light-border/20"
          )}>
            <span className={isDark ? "text-dark-text-secondary" : "text-light-text-secondary"}>
              Order: {element.order}
            </span>
          </div>
          
          <div className={cn(
            "px-2 py-1 rounded-md text-xs",
            isDark 
              ? "bg-dark-accent/10 text-dark-accent" 
              : "bg-light-accent/10 text-light-accent"
          )}>
            {deviceSizeDisplay}
          </div>
        </div>
        
        {/* HTML Elements count */}
        {element.htmlElements && element.htmlElements.length > 0 && (
          <div className="mt-2 text-sm">
            <span className={isDark ? "text-dark-text-secondary" : "text-light-text-secondary"}>
              {element.htmlElements.length} HTML element{element.htmlElements.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDesignCard;