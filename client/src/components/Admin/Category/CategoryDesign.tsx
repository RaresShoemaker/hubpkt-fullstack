import React, { useEffect, useState } from 'react';
import { useTheme } from '../../../store/features/ui/useUITheme';
import { useCategories } from '../../../store/features/categories/useCategories';
import { useCategoryDesigns } from '../../../store/features/categoryDesigns/useCategoryDesigns';
import { cn } from '../../../lib/utils';
import ButtonBase from '../Buttons/ButtonBase';
import { Monitor, Smartphone, TabletSmartphone, Plus, Edit, Trash2 } from 'lucide-react';
// Custom DeviceSize type to replace enum
type DeviceSize = "mobile" | "tablet" | "desktop";
import ModalPortal from '../Modal';
import { CategoryDesignForm } from '../forms/CategoryForm/CategoryDesignForm';
import { DesignElement } from '../../../store/features/categoryDesigns/categoryDesigns.types';

const CategoryDesign: React.FC = () => {
  const { isDark } = useTheme();
  const { currentCategory } = useCategories();
  const { 
    currentDesign, 
    currentElement,
    loading, 
    errors, 
    getDesignElementsByDeviceSize,
    handleFetchCategoryDesignByCategoryId,
    handleCreateCategoryDesign,
    handleSelectDesignElement,
    handleDeleteDesignElement
  } = useCategoryDesigns();

  const [selectedDeviceSize, setSelectedDeviceSize] = useState<DeviceSize>("desktop");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isElementModalOpen, setIsElementModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [elementToDelete, setElementToDelete] = useState<string | null>(null);

  // Fetch category design on mount or when category changes
  useEffect(() => {
    if (currentCategory?.id) {
      handleFetchCategoryDesignByCategoryId(currentCategory.id);
    }
  }, [currentCategory, handleFetchCategoryDesignByCategoryId]);

  const handleDeviceSizeChange = (deviceSize: DeviceSize) => {
    setSelectedDeviceSize(deviceSize);
  };

  const handleOpenCreateElementModal = () => {
    handleSelectDesignElement(null);
    setIsElementModalOpen(true);
  };

  const handleEditElement = (element: DesignElement) => {
    handleSelectDesignElement(element);
    setIsElementModalOpen(true);
  };

  const handleOpenDeleteModal = (elementId: string) => {
    setElementToDelete(elementId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteElement = async () => {
    if (elementToDelete) {
      await handleDeleteDesignElement(elementToDelete);
      setIsDeleteModalOpen(false);
      setElementToDelete(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeElementModal = () => {
    setIsElementModalOpen(false);
    setTimeout(() => {
      handleSelectDesignElement(null);
    }, 300);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setElementToDelete(null);
  };

  // Get elements filtered by selected device size
  const filteredElements = getDesignElementsByDeviceSize(selectedDeviceSize) || [];

  // Create new design if it doesn't exist yet
  const handleCreateDesign = async () => {
    if (currentCategory?.id && !currentDesign) {
      await handleCreateCategoryDesign({ categoryId: currentCategory.id });
    }
    handleOpenCreateElementModal();
  };

  const renderEmptyState = () => (
    <div className={cn(
      "flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl",
      isDark 
        ? "bg-dark-background border-dark-border/30 text-dark-text-secondary" 
        : "bg-light-background border-light-border/30 text-light-text-secondary"
    )}>
      <p className="text-xl mb-4">No design elements found for this category</p>
      <ButtonBase 
        onClick={handleCreateDesign}
        leftIcon={<Plus size={16} />}
      >
        {currentDesign ? 'Add Design Element' : 'Create Design'}
      </ButtonBase>
    </div>
  );

  return (
    <div className="mt-8">
      {/* Header section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className={cn(
          "text-xl font-semibold",
          isDark ? "text-dark-text-primary" : "text-light-text-primary"
        )}>
          Category Design
        </h2>

        {/* Device size filter buttons */}
        <div className="flex space-x-2">
          <ButtonBase
            variant={selectedDeviceSize === "desktop" ? "primary" : "ghost"}
            onClick={() => handleDeviceSizeChange("desktop")}
            leftIcon={<Monitor size={16} />}
            className={cn("px-3 py-1.5")}
          >
            Desktop
          </ButtonBase>
          <ButtonBase
            variant={selectedDeviceSize === "tablet" ? "primary" : "ghost"}
            onClick={() => handleDeviceSizeChange("tablet")}
            leftIcon={<TabletSmartphone size={16} />}
            className={cn("px-3 py-1.5")}
          >
            Tablet
          </ButtonBase>
          <ButtonBase
            variant={selectedDeviceSize === "mobile" ? "primary" : "ghost"}
            onClick={() => handleDeviceSizeChange("mobile")}
            leftIcon={<Smartphone size={16} />}
            className={cn("px-3 py-1.5")}
          >
            Mobile
          </ButtonBase>
        </div>
      </div>

      {/* Action button */}
      {currentDesign && (
        <div className="mb-6 flex justify-end">
          <ButtonBase
            onClick={handleOpenCreateElementModal}
            leftIcon={<Plus size={16} />}
            variant="primary"
          >
            Add Design Element
          </ButtonBase>
        </div>
      )}

      {/* Loading state */}
      {loading.fetchDesign && (
        <div className="flex justify-center my-12">
          <div className={cn(
            "animate-spin rounded-full h-12 w-12 border-t-2",
            isDark ? "border-dark-text-accent" : "border-light-text-accent"
          )}></div>
        </div>
      )}

      {/* Error state */}
      {errors.fetchDesign && (
        <div className={cn(
          "p-4 rounded-md mb-6",
          isDark ? "bg-red-900/20 text-red-300" : "bg-red-100 text-red-700"
        )}>
          <p>Error loading design: {errors.fetchDesign}</p>
        </div>
      )}

      {/* Empty state */}
      {!loading.fetchDesign && !errors.fetchDesign && (!currentDesign || filteredElements.length === 0) && (
        renderEmptyState()
      )}

      {/* Design elements grid */}
      {!loading.fetchDesign && currentDesign && filteredElements.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredElements.map((element) => (
            <div 
              key={element.id}
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
                    onClick={() => handleEditElement(element)}
                    leftIcon={<Edit size={16} className="text-white" />}
                    className="bg-black/50 text-white hover:bg-black/70"
                  >
                    Edit
                  </ButtonBase>
                  <ButtonBase
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenDeleteModal(element.id)}
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
                    {element.deviceSize}
                  </div>
                </div>
                
                {/* HTML Elements count */}
                {element.htmlElements && element.htmlElements.length > 0 && (
                  <div className="mt-2 text-sm">
                    <span className={isDark ? "text-dark-text-secondary" : "text-light-text-secondary"}>
                      {element.htmlElements.length} HTML elements
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Design form modal */}
      <ModalPortal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Edit Category Design"
        maxWidth="lg"
      >
        <CategoryDesignForm categoryId={currentCategory?.id} onClose={closeModal} />
      </ModalPortal>

      {/* Design element form modal */}
      <ModalPortal
        isOpen={isElementModalOpen}
        onClose={closeElementModal}
        title={currentElement ? "Edit Design Element" : "Create Design Element"}
        maxWidth="lg"
      >
        <CategoryDesignForm 
          categoryId={currentCategory?.id} 
          designId={currentDesign?.id}
          elementId={currentElement?.id}
          onClose={closeElementModal}
          initialDeviceSize={selectedDeviceSize}
        />
      </ModalPortal>

      {/* Delete confirmation modal */}
      <ModalPortal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title="Delete Design Element"
        maxWidth="sm"
      >
        <div className="p-4">
          <p className={isDark ? "text-dark-text-primary" : "text-light-text-primary"}>
            Are you sure you want to delete this design element? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <ButtonBase
              variant="ghost"
              onClick={closeDeleteModal}
            >
              Cancel
            </ButtonBase>
            <ButtonBase
              variant="primary"
              onClick={handleDeleteElement}
              className={isDark ? "bg-red-600 hover:bg-red-700" : "bg-red-500 hover:bg-red-600"}
            >
              Delete
            </ButtonBase>
          </div>
        </div>
      </ModalPortal>
    </div>
  );
};

export default CategoryDesign;