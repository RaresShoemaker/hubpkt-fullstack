/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useTheme } from '../../../../store/features/ui/useUITheme';
import { useCategoryDesigns } from '../../../../store/features/categoryDesigns/useCategoryDesigns';
import ButtonBase from '../../Buttons/ButtonBase';
import { DeviceSize } from '../../../../store/features/categoryDesigns/categoryDesigns.types';
import { cn } from '../../../../lib/utils';
import { FileUpload } from '../FileUpload';
import { CreateDesignElementRequest, UpdateDesignElementRequest } from '../../../../store/features/categoryDesigns/categoryDesigns.types';

interface CategoryDesignFormProps {
  categoryId?: string;
  elementId?: string;
  onClose: () => void;
  initialDeviceSize?: DeviceSize;
}

export const CategoryDesignForm: React.FC<CategoryDesignFormProps> = ({
  categoryId,
  onClose,
  initialDeviceSize = DeviceSize.desktop
}) => {
  const { isDark } = useTheme();
  const { currentDesign, loading, error, addDesignElement, editDesignElement } = useCategoryDesigns();

  // Form state
  const [formData, setFormData] = useState<Partial<CreateDesignElementRequest | UpdateDesignElementRequest>>({
    categoryId: categoryId || '',
    device: initialDeviceSize,
    order: 1,
    backgroundGradient: '',
    transitionGradient: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [htmlElementsJson, setHtmlElementsJson] = useState<string>('[]');

  // Initialize form with current design element data if editing
  useEffect(() => {
    if (currentDesign) {
      setFormData({
        id: currentDesign.id,
        categoryId: currentDesign.categoryId,
        device: currentDesign.device,
        order: currentDesign.order,
        backgroundGradient: currentDesign.backgroundGradient || '',
        transitionGradient: currentDesign.transitionGradient || ''
      });
      
      if (currentDesign.htmlElements && currentDesign.htmlElements.length > 0) {
        setHtmlElementsJson(JSON.stringify(
          currentDesign.htmlElements.map(el => el.htmlTag), 
          null, 
          2
        ));
      }
    } else {
      // Default values for new element
      setFormData({
        categoryId: categoryId || '',
        device: initialDeviceSize,
        order: 1,
        backgroundGradient: '',
        transitionGradient: ''
      });
      setHtmlElementsJson('[]');
    }
  }, [currentDesign, categoryId, initialDeviceSize]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'order') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
  };

  const validateHtmlElements = () => {
    try {
      if (htmlElementsJson.trim() === '') return [];
      const parsed = JSON.parse(htmlElementsJson);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e: any) {
      console.log(e)
      return null; // Invalid JSON
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate HTML elements
    const htmlElements = validateHtmlElements();
    if (htmlElements === null) {
      alert('Invalid JSON for HTML elements');
      return;
    }

    try {
      if (currentDesign) {
        // Update existing element
        const updateData: UpdateDesignElementRequest = {
          id: currentDesign.id,
          device: formData.device as DeviceSize,
          order: formData.order,
          backgroundGradient: formData.backgroundGradient,
          transitionGradient: formData.transitionGradient,
          htmlElements: htmlElements.length > 0 ? htmlElements : undefined
        };

        if (imageFile) {
          updateData.image = imageFile;
        }

        await editDesignElement(updateData);
      } else {
        // Create new element
        if (!imageFile || !categoryId) {
          alert('Image and category are required');
          return;
        }

        const createData: CreateDesignElementRequest = {
          categoryId,
          device: formData.device as DeviceSize,
          order: formData.order || 1,
          backgroundGradient: formData.backgroundGradient,
          transitionGradient: formData.transitionGradient,
          htmlElements: htmlElements.length > 0 ? htmlElements : undefined,
          image: imageFile
        };

        await addDesignElement(createData);
      }

      onClose();
    } catch (err) {
      console.error('Error saving design element:', err);
    }
  };

  return (
    <div className="p-4">
      {error && (
        <div className={cn(
          "p-3 mb-4 rounded-md",
          isDark ? "bg-red-900/20 text-red-300" : "bg-red-100 text-red-700"
        )}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Device Type Selection */}
        <div className="mb-4">
          <label className={cn(
            "block mb-2 text-sm font-medium",
            isDark ? "text-dark-text-primary" : "text-light-text-primary"
          )}>
            Device Type
          </label>
          <select
            name="device"
            value={formData.device}
            onChange={handleInputChange}
            className={cn(
              "w-full p-2 rounded-md border",
              isDark 
                ? "bg-dark-input border-dark-border text-dark-text-primary" 
                : "bg-light-input border-light-border text-light-text-primary"
            )}
          >
            <option value={DeviceSize.desktop}>Desktop</option>
            <option value={DeviceSize.tablet}>Tablet</option>
            <option value={DeviceSize.mobile}>Mobile</option>
          </select>
        </div>

        {/* Order */}
        <div className="mb-4">
          <label className={cn(
            "block mb-2 text-sm font-medium",
            isDark ? "text-dark-text-primary" : "text-light-text-primary"
          )}>
            Display Order
          </label>
          <input
            type="number"
            name="order"
            value={formData.order}
            onChange={handleInputChange}
            min={1}
            className={cn(
              "w-full p-2 rounded-md border",
              isDark 
                ? "bg-dark-input border-dark-border text-dark-text-primary" 
                : "bg-light-input border-light-border text-light-text-primary"
            )}
          />
        </div>

        {/* Background Gradient */}
        <div className="mb-4">
          <label className={cn(
            "block mb-2 text-sm font-medium",
            isDark ? "text-dark-text-primary" : "text-light-text-primary"
          )}>
            Background Gradient
          </label>
          <input
            type="text"
            name="backgroundGradient"
            value={formData.backgroundGradient}
            onChange={handleInputChange}
            placeholder="e.g., linear-gradient(to bottom, #3498db, #2980b9)"
            className={cn(
              "w-full p-2 rounded-md border",
              isDark 
                ? "bg-dark-input border-dark-border text-dark-text-primary" 
                : "bg-light-input border-light-border text-light-text-primary"
            )}
          />
          {formData.backgroundGradient && (
            <div 
              className="h-8 mt-2 rounded-md"
              style={{ background: formData.backgroundGradient }}
            ></div>
          )}
        </div>

        {/* Transition Gradient */}
        <div className="mb-4">
          <label className={cn(
            "block mb-2 text-sm font-medium",
            isDark ? "text-dark-text-primary" : "text-light-text-primary"
          )}>
            Transition Gradient
          </label>
          <input
            type="text"
            name="transitionGradient"
            value={formData.transitionGradient}
            onChange={handleInputChange}
            placeholder="e.g., linear-gradient(to top, #3498db00, #2980b9)"
            className={cn(
              "w-full p-2 rounded-md border",
              isDark 
                ? "bg-dark-input border-dark-border text-dark-text-primary" 
                : "bg-light-input border-light-border text-light-text-primary"
            )}
          />
          {formData.transitionGradient && (
            <div 
              className="h-8 mt-2 rounded-md"
              style={{ background: formData.transitionGradient }}
            ></div>
          )}
        </div>

        {/* Design Image */}
        <div className="mb-4">
          <FileUpload
            label="Design Image"
            name="designImage"
            required={!currentDesign}
            onChange={handleImageChange}
            preview={currentDesign?.image}
            accept="image/*"
          />
        </div>

        {/* HTML Elements (JSON) */}

        {/* Form Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <ButtonBase
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </ButtonBase>
          <ButtonBase
            type="submit"
            variant="primary"
            disabled={loading || (!imageFile && !currentDesign)}
            isLoading={loading}
          >
            {currentDesign ? 'Update Element' : 'Create Element'}
          </ButtonBase>
        </div>
      </form>
    </div>
  );
};