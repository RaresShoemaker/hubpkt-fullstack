/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "../../../../lib/utils";
import { useTheme } from "../../../../store/features/ui/useUITheme"; // Assuming your theme provider exports this hook

// Define minimal props needed for both types
type ItemType = { 
  id: string; 
  title: string; 
  [key: string]: any;
};

interface DraggableItemCardProps<T extends ItemType> {
  item: T;
  position: number;
  itemType: 'card' | 'category';
  isDragging: boolean;
  isDraggedOver: boolean;
}

const DraggableItemCard = <T extends ItemType>({
  item,
  position,
  itemType,
  isDragging,
  isDraggedOver
}: DraggableItemCardProps<T>) => {
  const { isDark } = useTheme();
  
  // Colors based on theme
  const colors = isDark 
    ? {
        bg: 'bg-[#141a1f]', // dark.surface
        border: 'border-[#2d3436]', // dark.border
        text: 'text-[#e2e8f0]', // dark.text.primary
        secondaryText: 'text-[#94a3b8]', // dark.text.secondary
        badge: {
          card: 'bg-[#00b894] bg-opacity-20 text-[#00b894]', // dark.accent with opacity
          category: 'bg-[#00b894] bg-opacity-30 text-[#00b894]' // dark.accent with opacity
        },
        dragIndicator: 'border-[#00b894]', // dark.accent
      }
    : {
        bg: 'bg-[#ffffff]', // light.background
        border: 'border-[#e2e8f0]', // light.border
        text: 'text-[#334155]', // light.text.primary
        secondaryText: 'text-[#64748b]', // light.text.secondary
        badge: {
          card: 'bg-[#e11d48] bg-opacity-20 text-[#e11d48]', // light.accent with opacity
          category: 'bg-[#e11d48] bg-opacity-30 text-[#e11d48]' // light.accent with opacity
        },
        dragIndicator: 'border-[#e11d48]', // light.accent
      };
  
  return (
    <div 
      className={cn(
        'flex items-center p-3 rounded-lg border shadow-sm transition-all',
        colors.bg,
        colors.border,
        isDragging && 'opacity-60 shadow-md',
        isDraggedOver && `border-2 border-dashed ${colors.dragIndicator}`
      )}
    >
      {/* Position indicator */}
      <div className={cn(
        'flex items-center justify-center w-8 h-8 rounded-full mr-3 font-semibold',
        isDark ? 'bg-gray-800' : 'bg-gray-100',
        colors.text
      )}>
        {position}
      </div>
      
      {/* Content */}
      <div className="flex-grow">
        <h3 className={cn('font-medium', colors.text)}>
          {item.title}
        </h3>
      </div>
      
      {/* Type badge */}
      <div className={cn(
        'px-2 py-1 text-xs rounded-full ml-2',
        itemType === 'card' ? colors.badge.card : colors.badge.category
      )}>
        {itemType}
      </div>
    </div>
  );
};

export default DraggableItemCard;