/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useTheme } from '../../../store/features/ui/useUITheme';
import { useCategories } from '../../../store/features/categories/useCategories';
import { useCategoryDesigns } from '../../../store/features/categoryDesigns/useCategoryDesigns';
import { cn } from '../../../lib/utils';
import ButtonBase from '../Buttons/ButtonBase';
import { Monitor, Smartphone, TabletSmartphone, Plus } from 'lucide-react';
// Custom DeviceSize type to replace enum
import { DeviceSize } from '../../../store/features/categoryDesigns/categoryDesigns.types';
import ModalPortal from '../Modal';
import { CategoryDesignForm } from '../forms/CategoryForm/CategoryDesignForm';
import { DesignElement } from '../../../store/features/categoryDesigns/categoryDesigns.types';
import CategoryDesignCard from './CategoryDesignCard';

const CategoryDesign: React.FC = () => {
  const { isDark } = useTheme();
  const { currentCategory } = useCategories();
  const { 
    designs,
    currentDesign,
    loading, 
    error,
    fetchDesigns,
    fetchDesignsByDevice,
    selectDesignElement,
    removeDesignElement
  } = useCategoryDesigns();

  const [selectedDeviceSize, setSelectedDeviceSize] = useState<DeviceSize>(DeviceSize.desktop);
  const [isElementModalOpen, setIsElementModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [elementToDelete, setElementToDelete] = useState<string | null>(null);

  // Fetch category design elements on mount or when category changes
  useEffect(() => {
    if (currentCategory?.id) {
      fetchDesigns(currentCategory.id);
    }
  }, [currentCategory, fetchDesigns]);

  // Handle device size selection
  const handleDeviceSizeChange = (deviceSize: DeviceSize) => {
    setSelectedDeviceSize(deviceSize);
    if (currentCategory?.id) {
      fetchDesignsByDevice(currentCategory.id, deviceSize);
    }
  };

  // Open modal to create a new element
  const handleOpenCreateElementModal = () => {
    selectDesignElement(null);
    setIsElementModalOpen(true);
  };

  // Handle edit element action
  const handleEditElement = (element: DesignElement) => {
    selectDesignElement(element);
    setIsElementModalOpen(true);
  };

  // Handle delete element confirmation
  const handleOpenDeleteModal = (elementId: string) => {
    setElementToDelete(elementId);
    setIsDeleteModalOpen(true);
  };

  // Execute delete element action
  const handleDeleteElement = async () => {
    if (elementToDelete) {
      await removeDesignElement(elementToDelete);
      setIsDeleteModalOpen(false);
      setElementToDelete(null);
    }
  };

  // Modal close handlers
  const closeElementModal = () => {
    setIsElementModalOpen(false);
    setTimeout(() => {
      selectDesignElement(null);
    }, 300);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setElementToDelete(null);
  };

  // Get current device elements
  const getCurrentDeviceElements = (): DesignElement[] => {
    switch (selectedDeviceSize) {
      case DeviceSize.desktop:
        return designs.desktop || [];
      case DeviceSize.tablet:
        return designs.tablet || [];
      case DeviceSize.mobile:
        return designs.mobile || [];
      default:
        return [];
    }
  };

  // Empty state component
  const renderEmptyState = () => (
    <div className={cn(
      "flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl",
      isDark 
        ? "bg-dark-background border-dark-border/30 text-dark-text-secondary" 
        : "bg-light-background border-light-border/30 text-light-text-secondary"
    )}>
      <p className="text-xl mb-4">No design elements found for this device size</p>
      <ButtonBase 
        onClick={handleOpenCreateElementModal}
        leftIcon={<Plus size={16} />}
      >
        Add Design Element
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
            variant={selectedDeviceSize === DeviceSize.desktop ? "primary" : "ghost"}
            onClick={() => handleDeviceSizeChange(DeviceSize.desktop)}
            leftIcon={<Monitor size={16} />}
            className={cn("px-3 py-1.5")}
          >
            Desktop
          </ButtonBase>
          <ButtonBase
            variant={selectedDeviceSize === DeviceSize.tablet ? "primary" : "ghost"}
            onClick={() => handleDeviceSizeChange(DeviceSize.tablet)}
            leftIcon={<TabletSmartphone size={16} />}
            className={cn("px-3 py-1.5")}
          >
            Tablet
          </ButtonBase>
          <ButtonBase
            variant={selectedDeviceSize === DeviceSize.mobile ? "primary" : "ghost"}
            onClick={() => handleDeviceSizeChange(DeviceSize.mobile)}
            leftIcon={<Smartphone size={16} />}
            className={cn("px-3 py-1.5")}
          >
            Mobile
          </ButtonBase>
        </div>
      </div>

      {/* Action button */}
      <div className="mb-6 flex justify-end">
        <ButtonBase
          onClick={handleOpenCreateElementModal}
          leftIcon={<Plus size={16} />}
          variant="primary"
        >
          Add Design Element
        </ButtonBase>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center my-12">
          <div className={cn(
            "animate-spin rounded-full h-12 w-12 border-t-2",
            isDark ? "border-dark-text-accent" : "border-light-text-accent"
          )}></div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className={cn(
          "p-4 rounded-md mb-6",
          isDark ? "bg-red-900/20 text-red-300" : "bg-red-100 text-red-700"
        )}>
          <p>Error loading design: {error}</p>
        </div>
      )}

      {/* Design elements grid */}
      {!loading && designs && (
        <>
          {getCurrentDeviceElements().length === 0 ? (
            renderEmptyState()
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getCurrentDeviceElements().map((element) => (
                <CategoryDesignCard
                  key={element.id}
                  designElement={element}
                  onEdit={() => handleEditElement(element)}
                  onDelete={() => handleOpenDeleteModal(element.id)}
                  isDark={isDark}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Design element form modal */}
      <ModalPortal
        isOpen={isElementModalOpen}
        onClose={closeElementModal}
        title={currentDesign ? "Edit Design Element" : "Create Design Element"}
        maxWidth="lg"
      >
        <CategoryDesignForm 
          categoryId={currentCategory?.id} 
          elementId={currentDesign?.id}
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