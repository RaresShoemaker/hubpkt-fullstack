import React, { useState } from "react";
import { Plus, Edit } from "lucide-react";
import { cn } from "../../../lib/utils";
import InfoPopup from "../InfoPopup";
import { Card } from "../../../store/features/cards/cards.types";
import { useTheme } from "../../../store/features/ui/useUITheme";
import { useCards } from "../../../store/features/cards/useCards";

type CardComponentProps = 
  | { 
      card: Card; 
      createNew?: false; 
      onEdit?: (id: string) => void;
      onClick?: (id: string) => void;
      className?: string;
    } 
  | { 
      createNew: true; 
      card?: never;
      onClick: () => void;
      className?: string;
    };

const CardComponent: React.FC<CardComponentProps> = (props) => {
  const { isDark } = useTheme();
  const { handleSelectCard } = useCards();
  const [isHovered, setIsHovered] = useState(false);

  // Create new card with dotted border and plus icon
  if (props.createNew) {
    return (
      <button
        onClick={props.onClick}
        className={cn(
          "h-80 p-6 rounded-xl border-2 border-dashed transition-colors duration-300 cursor-pointer w-full",
          isDark 
            ? "bg-dark-background border-dark-border/30 hover:border-dark-text-accent hover:bg-dark-surface/50" 
            : "bg-light-background border-light-border/30 hover:border-light-text-accent hover:bg-light-surface/50",
          props.className
        )}
        aria-label="Create new card"
      >
        <div className="flex flex-col items-center justify-center h-full gap-6">
          <div className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center",
            isDark ? "bg-dark-text-accent" : "bg-light-accent"
          )}>
            <Plus 
              size={24} 
              className="text-white" 
            />
          </div>
          <div className="text-center">
            <h3 className={cn(
              "text-lg font-medium",
              isDark ? "text-dark-text-primary" : "text-light-text-primary"
            )}>
              Add New Card
            </h3>
            <p className={cn(
              "mt-2 text-sm",
              isDark ? "text-dark-text-secondary" : "text-light-text-secondary"
            )}>
              Click to create a new card
            </p>
          </div>
        </div>
      </button>
    );
  }

  // Regular card with image and info
  const card = props.card;
  const { onEdit } = props;

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      // Set the current card before editing
      handleSelectCard(card);
      onEdit(card.id);
    }
  };

  const handleCardClick = () => {
    // Set the current card when clicked
    handleSelectCard(card);
  };

  // Badge component for statuses
  const Badge = ({ active, children }: { active: boolean; children: React.ReactNode }) => {
    if (!active) return null;
    
    return (
      <div className={cn(
        "px-2 py-1 text-xs font-medium rounded-md",
        isDark ? "bg-dark-text-accent text-white" : "bg-light-accent text-white",
      )}>
        {children}
      </div>
    );
  };

  return (
    <div
      className={cn(
        "h-80 rounded-xl border overflow-hidden shadow-sm transition-all duration-300 relative flex flex-col",
        "hover:shadow-md",
        isDark ? "bg-dark-surface border-dark-border" : "bg-light-surface border-light-border",
        props.className
      )}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Edit overlay that appears on hover */}
      {isHovered && onEdit && (
        <div 
          className={cn(
            "absolute inset-0 flex items-center justify-center z-20",
            "rounded-xl transition-opacity duration-200",
            isDark ? "bg-dark-background/70" : "bg-light-background/70"
          )}
          onClick={handleEditClick}
        >
          <div className={cn(
            "p-3 rounded-full cursor-pointer",
            isDark ? "bg-dark-surface hover:bg-dark-surface/80" : "bg-light-surface hover:bg-light-surface/80"
          )}>
            <Edit 
              size={20} 
              className={isDark ? "text-dark-text-accent" : "text-light-text-accent"} 
            />
          </div>
        </div>
      )}

      {/* Image Section (50% instead of 65%) */}
      <div className="relative h-40 overflow-hidden">
        {card.image ? (
          <div className="w-full h-full p-2">
            <img 
              src={card.image} 
              alt={card.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        ) : (
          <div className={cn(
            "w-full h-full flex items-center justify-center",
            isDark ? "bg-dark-surface" : "bg-light-surface"
          )}>
            <span className={isDark ? "text-dark-text-secondary" : "text-light-text-secondary"}>No image</span>
          </div>
        )}
        
        {/* Status Badges - In corners */}
        <div className="absolute top-2 left-2">
          <Badge active={card.isHot}>Hot</Badge>
        </div>
        <div className="absolute top-2 right-2">
          <Badge active={card.isDiscover}>Discover</Badge>
        </div>
        <div className="absolute bottom-2 left-2">
          <Badge active={card.isPreview}>Preview</Badge>
        </div>
      </div>

      {/* Info Section (expanded with more space) */}
      <div className="flex-1 p-4 flex flex-col gap-2">
        <div>
          <h3 className={cn(
            "text-base font-medium line-clamp-1",
            isDark ? "text-dark-text-primary" : "text-light-text-primary"
          )}>
            {card.title}
          </h3>
          
          <div className="flex items-center gap-2 mt-1">
            <span className={cn(
              "text-xs px-2 py-0.5 rounded-full",
              isDark ? "bg-dark-background text-dark-text-secondary" : "bg-light-background text-light-text-secondary"
            )}>
              {card.genre}
            </span>
          </div>
          
          <p className={cn(
            "text-xs line-clamp-3 mt-2",
            isDark ? "text-dark-text-secondary" : "text-light-text-secondary"
          )}>
            {card.description}
          </p>
        </div>
        
        {/* Status indicators with InfoPopup */}
        <div className="mt-auto pt-2 border-t border-opacity-10 border-gray-400">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-1">
              <span className={cn(
                card.isAvailable 
                  ? (isDark ? "text-dark-text-accent" : "text-light-text-accent") 
                  : (isDark ? "text-dark-text-secondary" : "text-light-text-secondary")
              )}>
                {card.isAvailable ? 'Available' : 'Unavailable'}
              </span>
              <InfoPopup
                content={
                  card.isAvailable
                    ? 'This card is available for users to interact with.'
                    : 'This card is not available for users to interact with.'
                }
              />
            </div>
            
            <div className="flex items-center gap-1">
              <span className={isDark ? "text-dark-text-secondary" : "text-light-text-secondary"}>
                {new Date(card.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardComponent;