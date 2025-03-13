import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../store/features/ui/useUITheme';
import { useCategories } from '../../../store/features/categories/useCategories';
import { useCategoryDesigns } from '../../../store/features/categoryDesigns/useCategoryDesigns';
import ButtonBase from '../Buttons/ButtonBase';
import ModalPortal from '../Modal';
import CategoryDesignForm from '../forms/CategoryForm/CategoryDesignForm';
import { cn } from '../../../lib/utils';
import { PlusCircle, Paintbrush, Layout, Edit, Trash2, ExternalLink } from 'lucide-react';
import { DeviceSize } from '../../../store/features/categoryDesigns/categoryDesigns.types';

const CategoryDesigns: React.FC = () => {
  const { isDark } = useTheme();
  const { currentCategory } = useCategories();
  const { 
    currentDesign, 
    loading, 
    handleFetchDesignByCategory,
    handleCreateDesign,
    getElementsByDeviceSize
  } = useCategoryDesigns();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'design' | 'element'>('design');
  const [activeDeviceSize, setActiveDeviceSize] = useState<DeviceSize>('desktop');

  useEffect(() => {
    // Fetch design data when category changes
    if (currentCategory?.id) {
      handleFetchDesignByCategory(currentCategory.id);
    }
  }, [currentCategory, handleFetchDesignByCategory]);

  const handleOpenModal = (type: 'design' | 'element') => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };



  const getEmptyStateMessage = () => {
    if (!currentCategory) {
      return 'Please select a category to view designs';
    }
    return 'No designs created yet for this category';
  };

  // Get elements filtered by active device size
  const activeElements = currentDesign 
    ? getElementsByDeviceSize(activeDeviceSize)
    : [];

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex justify-between items-center mb-6">
        <h2 className={cn(
          'text-xl font-semibold',
          isDark ? 'text-dark-text-primary' : 'text-light-text-primary'
        )}>
          Category Design
        </h2>
        
        <div className="flex space-x-4">
          {/* Device size selector */}
          <div className={cn(
            'flex p-1 rounded-lg',
            isDark ? 'bg-dark-surface/50' : 'bg-light-surface/50',
          )}>
            <button
              onClick={() => setActiveDeviceSize('mobile')}
              className={cn(
                'p-2 rounded',
                activeDeviceSize === 'mobile' 
                  ? (isDark ? 'bg-dark-border text-dark-text-accent' : 'bg-light-border text-light-text-accent') 
                  : 'text-gray-500'
              )}
              title="Mobile View"
            >
              <Paintbrush size={18} />
            </button>
            <button
              onClick={() => setActiveDeviceSize('tablet')}
              className={cn(
                'p-2 rounded',
                activeDeviceSize === 'tablet' 
                  ? (isDark ? 'bg-dark-border text-dark-text-accent' : 'bg-light-border text-light-text-accent') 
                  : 'text-gray-500'
              )}
              title="Tablet View"
            >
              <Layout size={18} />
            </button>
            <button
              onClick={() => setActiveDeviceSize('desktop')}
              className={cn(
                'p-2 rounded',
                activeDeviceSize === 'desktop' 
                  ? (isDark ? 'bg-dark-border text-dark-text-accent' : 'bg-light-border text-light-text-accent') 
                  : 'text-gray-500'
              )}
              title="Desktop View"
            >
              <Paintbrush size={18} />
            </button>
          </div>
          
          {/* Create new design button */}
          <ButtonBase
            onClick={() => handleOpenModal(currentDesign ? 'element' : 'design')}
            leftIcon={<PlusCircle size={18} />}
          >
            {!currentDesign ? 'Create Design' : 'Add Element'}
          </ButtonBase>
        </div>
      </div>

      {/* Loading state */}
      {loading.fetchDesignByCategory && (
        <div className="flex justify-center my-12">
          <div className={cn(
            `animate-spin rounded-full h-12 w-12 border-t-2`,
            isDark ? 'border-dark-text-accent' : 'border-light-text-accent'
          )}></div>
        </div>
      )}

      {/* Empty state */}
      {!loading.fetchDesignByCategory && !currentDesign && (
        <div className={cn(
          'text-center py-16 rounded-lg border-2 border-dashed',
          isDark 
            ? 'bg-dark-background border-dark-border/30 text-dark-text-secondary' 
            : 'bg-light-background border-light-border/30 text-light-text-secondary'
        )}>
          <p className="text-lg mb-4">{getEmptyStateMessage()}</p>
          {currentCategory && (
            <ButtonBase
              onClick={async () => {
                if (currentCategory) {
                  try {
                    await handleCreateDesign({
                      categoryId: currentCategory.id,
                      backgroundGradient: 'linear-gradient(180deg, #090D23 0%, #1D2343 100%)',
                      transitionGradient: 'linear-gradient(180deg, rgba(9,13,35,0) 0%, #090D23 100%)'
                    });
                  } catch (error) {
                    console.error('Failed to create design:', error);
                  }
                }
              }}
              leftIcon={<PlusCircle size={18} />}
            >
              Create Design
            </ButtonBase>
          )}
        </div>
      )}

      {/* Design Content */}
      {!loading.fetchDesignByCategory && currentDesign && (
        <div className={cn(
          'p-6 rounded-lg border',
          isDark ? 'bg-dark-surface border-dark-border' : 'bg-light-surface border-light-border'
        )}>
          <div className="flex flex-col space-y-6">
            {/* Background settings section */}
            <div className="flex justify-between items-center">
              <h3 className={cn(
                'font-medium',
                isDark ? 'text-dark-text-primary' : 'text-light-text-primary'
              )}>
                Background Settings
              </h3>

              <ButtonBase
                size="sm"
                variant="secondary"
                leftIcon={<Edit size={16} />}
                onClick={() => handleOpenModal('design')}
              >
                Edit Background
              </ButtonBase>
            </div>

            {/* Design Elements section */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className={cn(
                  'font-medium',
                  isDark ? 'text-dark-text-primary' : 'text-light-text-primary'
                )}>
                  Elements ({activeElements.length})
                </h3>

                <ButtonBase
                  size="sm"
                  variant="primary"
                  leftIcon={<PlusCircle size={16} />}
                  onClick={() => handleOpenModal('element')}
                >
                  Add Element
                </ButtonBase>
              </div>
              
              {activeElements.length === 0 ? (
                <div className={cn(
                  'text-center py-8 rounded-lg border-2 border-dashed',
                  isDark 
                    ? 'bg-dark-background border-dark-border/30 text-dark-text-secondary' 
                    : 'bg-light-background border-light-border/30 text-light-text-secondary'
                )}>
                  <p className="mb-2">No elements created for {activeDeviceSize} view</p>
                  <ButtonBase
                    onClick={() => handleOpenModal('element')}
                    leftIcon={<PlusCircle size={18} />}
                  >
                    Add Element
                  </ButtonBase>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Elements would be mapped here when we have real data */}
                  <div className={cn(
                    'p-4 rounded-lg border relative group',
                    isDark ? 'bg-dark-surface border-dark-border' : 'bg-light-surface border-light-border'
                  )}>
                    <div className="mb-2 aspect-video bg-gray-100 rounded overflow-hidden">
                      {/* Element preview image would go here */}
                      <div className="h-full w-full flex items-center justify-center text-gray-400">
                        <span>Element Preview</span>
                      </div>
                    </div>
                    
                    <p className={cn(
                      'font-medium',
                      isDark ? 'text-dark-text-primary' : 'text-light-text-primary'
                    )}>
                      Element #1
                    </p>
                    <p className={cn(
                      'text-xs',
                      isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'
                    )}>
                      Order: 1
                    </p>
                    
                    {/* Hover actions */}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                      <div className="flex gap-2">
                        <button className="p-2 bg-white text-black rounded hover:bg-gray-100">
                          <Edit size={18} />
                        </button>
                        <button className="p-2 bg-white text-black rounded hover:bg-gray-100">
                          <Trash2 size={18} />
                        </button>
                        <button className="p-2 bg-white text-black rounded hover:bg-gray-100">
                          <ExternalLink size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal for creating/editing designs */}
      <ModalPortal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={!currentDesign 
          ? "Create Category Design" 
          : modalType === 'element' 
            ? "Add Design Element" 
            : "Edit Background Settings"
        }
        maxWidth="lg"
      >
        {modalType === 'design' && (
          <CategoryDesignForm
            onClose={handleCloseModal}
            formType="design"
            categoryId={currentCategory?.id || ''}
            designId={currentDesign?.id}
            initialData={currentDesign ? {
              backgroundGradient: currentDesign.backgroundGradient,
              transitionGradient: currentDesign.transitionGradient
            } : undefined}
          />
        )}
        
        {modalType === 'element' && currentDesign && (
          <CategoryDesignForm
            onClose={handleCloseModal}
            formType="element"
            categoryId={currentCategory?.id || ''}
            deviceSize={activeDeviceSize}
          />
        )}
      </ModalPortal>
    </div>
  );
};

export default CategoryDesigns;