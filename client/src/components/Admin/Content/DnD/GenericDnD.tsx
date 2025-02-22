/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';

// Using types from the uploaded file
type ItemType = {
  id: string;
  title: string;
  order: number;
  [key: string]: any; // Allow for other properties
};

interface GenericDragDropProps<T extends ItemType> {
  items: T[];
  onReorder: (reorderedItems: T[]) => void;
  renderItem: (item: T, index: number, isDragging: boolean, isDraggedOver: boolean) => React.ReactNode;
}

const GenericDragDrop = <T extends ItemType>({
  items,
  onReorder,
  renderItem
}: GenericDragDropProps<T>) => {
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dragOverItemId, setDragOverItemId] = useState<string | null>(null);
  const [sortedItems, setSortedItems] = useState<T[]>([]);

  // Sort items by order on mount and when items change
  useEffect(() => {
    setSortedItems([...items].sort((a, b) => a.order - b.order));
  }, [items]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    setDraggedItemId(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedItemId(null);
    setDragOverItemId(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.preventDefault();
    
    // Only update if we're dragging over a different item
    if (draggedItemId !== id) {
      setDragOverItemId(id);
    }
  };

  const handleDragLeave = () => {
    setDragOverItemId(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault();
    
    const draggedId = e.dataTransfer.getData('text/plain');
    if (!draggedId || draggedId === targetId) {
      return;
    }
    
    const draggedItem = sortedItems.find(item => item.id === draggedId);
    const targetItem = sortedItems.find(item => item.id === targetId);
    
    if (!draggedItem || !targetItem) {
      return;
    }
    
    // Get indices instead of directly using order
    const draggedIndex = sortedItems.findIndex(item => item.id === draggedId);
    const targetIndex = sortedItems.findIndex(item => item.id === targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) {
      return;
    }
    
    // Create a new array for the reordered items
    const newItems = [...sortedItems];
    
    // Remove the dragged item
    newItems.splice(draggedIndex, 1);
    
    // Insert it at the target position
    newItems.splice(targetIndex, 0, draggedItem);
    
    // Update the order property based on new positions
    const updatedItems = newItems.map((item, index) => ({
      ...item,
      order: index + 1 // Update order to match new position (1-based index)
    }));
    
    setSortedItems(updatedItems);
    onReorder(updatedItems);
    
    setDraggedItemId(null);
    setDragOverItemId(null);
  };

  return (
    <div className="p-4">
      <div className="space-y-3">
        {sortedItems.map((item, index) => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => handleDragStart(e, item.id)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, item.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, item.id)}
            className="relative cursor-move"
          >
            {renderItem(
              item,
              index + 1, // Pass the 1-based index instead of the order property
              item.id === draggedItemId, 
              item.id === dragOverItemId
            )}
            
            {/* Position indicator that appears when dragging over this item */}
            {item.id === dragOverItemId && draggedItemId && (
              <div className="absolute -top-4 left-0 right-0 text-center bg-blue-500 text-white px-2 py-1 rounded-t-md text-sm z-10">
                Move to position: {index + 1}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GenericDragDrop;