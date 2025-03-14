/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../../store/features/ui/useUITheme';
import { useCategoryDesigns } from '../../../../store/features/categoryDesigns/useCategoryDesigns';
import ButtonBase from '../../Buttons/ButtonBase';
// Custom DeviceSize type to replace enum
type DeviceSize = "mobile" | "tablet" | "desktop";
import { cn } from '../../../../lib/utils';
import { Monitor, Smartphone, TabletSmartphone } from 'lucide-react';
import { FileUpload } from '../../forms/FileUpload';
import { Input } from '../../forms/CustomInput';
import { TextArea } from '../../forms/CustomTextArea';

interface CategoryDesignFormProps {
  categoryId?: string;
  designId?: string;
  elementId?: string;
  onClose: () => void;
  initialDeviceSize?: DeviceSize;
}

export const CategoryDesignForm: React.FC<CategoryDesignFormProps> = ({
  designId,
  elementId,
  onClose,
  initialDeviceSize = "desktop" as DeviceSize
}) => {
  const { isDark } = useTheme();
  const {
    currentDesign,
    currentElement,
    loading,
    errors,
    handleUpdateCategoryDesign,
    handleCreateDesignElement,
    handleUpdateDesignElement
  } = useCategoryDesigns();

  // Form state for category design
  const [designFormData, setDesignFormData] = useState({
    backgroundGradient: '',
    transitionGradient: ''
  });

  // Form state for design element
  const [elementFormData, setElementFormData] = useState({
    deviceSize: initialDeviceSize,
    order: 1,
    image: null as File | null,
    imagePreview: '',
    htmlContent: ''
  });
  
  const [errors_, setErrors] = useState({
    image: '',
    order: ''
  });

  // Initialize form data from current design/element when available
  useEffect(() => {
    if (currentDesign) {
      setDesignFormData({
        backgroundGradient: currentDesign.backgroundGradient || '',
        transitionGradient: currentDesign.transitionGradient || ''
      });
    }

    if (currentElement) {
      setElementFormData({
        deviceSize: currentElement.deviceSize,
        order: currentElement.order,
        image: null,
        imagePreview: currentElement.url,
        htmlContent: currentElement.htmlElements.length > 0 
          ? JSON.stringify(currentElement.htmlElements[0].htmlTag, null, 2)
          : ''
      });
    } else {
      // Reset to default values for new element
      setElementFormData({
        deviceSize: initialDeviceSize,
        order: 1,
        image: null,
        imagePreview: '',
        htmlContent: ''
      });
    }
  }, [currentDesign, currentElement, initialDeviceSize]);

  // Handle design form changes
  const handleDesignChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDesignFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle element form changes
  const handleElementChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'order') {
      const orderValue = parseInt(value);
      if (isNaN(orderValue) || orderValue < 1) {
        setErrors(prev => ({
          ...prev,
          order: 'Order must be a positive number'
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          order: ''
        }));
      }
    }
    
    setElementFormData(prev => ({
      ...prev,
      [name]: name === 'order' ? parseInt(value) : value
    }));
  };

  // Handle device size selection
  const handleDeviceSizeChange = (deviceSize: DeviceSize) => {
    setElementFormData(prev => ({
      ...prev,
      deviceSize
    }));
  };

  // Handle file change
  const handleFileChange = (file: File | null) => {
    if (file) {
      // Validate file type
      const validTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
        'image/svg'
      ];
      
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          image: 'Invalid file type. Please upload an image.'
        }));
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'File is too large. Maximum size is 5MB.'
        }));
        return;
      }

      setElementFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }));
      
      setErrors(prev => ({
        ...prev,
        image: ''
      }));
    } else {
      setElementFormData(prev => ({
        ...prev,
        image: null,
        imagePreview: currentElement?.url || ''
      }));
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {
      image: '',
      order: ''
    };
    let isValid = true;

    // Validate order
    if (isNaN(elementFormData.order) || elementFormData.order < 1) {
      newErrors.order = 'Order must be a positive number';
      isValid = false;
    }

    // Validate image for new elements
    if (!elementId && !elementFormData.image) {
      newErrors.image = 'Image is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Submit design form
  const handleDesignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (designId) {
      await handleUpdateCategoryDesign({
        id: designId,
        backgroundGradient: designFormData.backgroundGradient,
        transitionGradient: designFormData.transitionGradient
      });
    }
    
    onClose();
  };

  // Submit element form
  const handleElementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Parse HTML content if provided
    let htmlElements;
    if (elementFormData.htmlContent) {
      try {
        const htmlTag = JSON.parse(elementFormData.htmlContent);
        // We need to add designElementId to match CreateHtmlElementRequest interface
        // This is a temporary ID that will be replaced by the backend
        htmlElements = [{ htmlTag, designElementId: 'temp-id' }];
      } catch (error: any) {
        setErrors(prev => ({
          ...prev,
          htmlContent: 'Invalid JSON format'
        }));
        console.log(error)
        return;
      }
    }

    if (elementId && currentElement) {
      // Update existing element
      await handleUpdateDesignElement({
        id: elementId,
        order: elementFormData.order,
        deviceSize: elementFormData.deviceSize,
        image: elementFormData.image || undefined
      });
    } else if (designId) {
      // Create new element
      if (!elementFormData.image) {
        setErrors(prev => ({
          ...prev,
          image: 'Image is required'
        }));
        return;
      }

      await handleCreateDesignElement({
        categoryDesignId: designId,
        order: elementFormData.order,
        deviceSize: elementFormData.deviceSize,
        image: elementFormData.image,
        htmlElements: htmlElements
      });
    }
    
    onClose();
  };

  // Determine if we're editing a design or an element
  const isEditingDesign = designId && !elementId && !currentElement;
  const isLoading = isEditingDesign 
    ? loading.updateDesign 
    : elementId 
      ? loading.updateElement 
      : loading.createElement;

  return (
    <form onSubmit={isEditingDesign ? handleDesignSubmit : handleElementSubmit} className="space-y-4">
      {/* Design form (background gradients) */}
      {isEditingDesign && (
        <>
          <Input
            label="Background Gradient"
            name="backgroundGradient"
            type="text"
            value={designFormData.backgroundGradient}
            onChange={handleDesignChange}
            placeholder="e.g., linear-gradient(to bottom, #123456, #654321)"
            helperText="CSS gradient for the background"
          />
          
          <Input
            label="Transition Gradient"
            name="transitionGradient"
            type="text"
            value={designFormData.transitionGradient}
            onChange={handleDesignChange}
            placeholder="e.g., linear-gradient(to top, rgba(0,0,0,0.8), transparent)"
            helperText="CSS gradient for the transition effect"
          />
        </>
      )}

      {/* Element form */}
      {!isEditingDesign && (
        <>
          {/* Device size selector */}
          <div className="mb-4">
            <label className={cn(
              "block mb-2",
              isDark ? "text-dark-text-primary" : "text-light-text-primary"
            )}>
              Device Size*
            </label>
            <div className="flex space-x-2">
              <ButtonBase
                type="button"
                variant={elementFormData.deviceSize === "desktop" ? "primary" : "secondary"}
                onClick={() => handleDeviceSizeChange("desktop")}
                leftIcon={<Monitor size={16} />}
                className="px-3 py-1.5"
              >
                Desktop
              </ButtonBase>
              <ButtonBase
                type="button"
                variant={elementFormData.deviceSize === "tablet" ? "primary" : "secondary"}
                onClick={() => handleDeviceSizeChange("tablet")}
                leftIcon={<TabletSmartphone size={16} />}
                className="px-3 py-1.5"
              >
                Tablet
              </ButtonBase>
              <ButtonBase
                type="button"
                variant={elementFormData.deviceSize === "mobile" ? "primary" : "secondary"}
                onClick={() => handleDeviceSizeChange("mobile")}
                leftIcon={<Smartphone size={16} />}
                className="px-3 py-1.5"
              >
                Mobile
              </ButtonBase>
            </div>
          </div>
          
          {/* Order input */}
          <Input
            label="Display Order"
            name="order"
            type="number"
            value={elementFormData.order.toString()}
            onChange={handleElementChange}
            min="1"
            required
            error={errors_.order}
            helperText="Position in the layout (1 is first)"
          />
          
          {/* Image upload */}
          <FileUpload
            label="Design Image"
            name="image"
            onChange={handleFileChange}
            preview={elementFormData.imagePreview}
            required={!elementId}
            error={errors_.image}
            helperText="Accepted formats: JPEG, PNG, GIF, WebP, SVG. Max size: 5MB"
            accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml,image/svg"
          />
          
          {/* HTML content (JSON format) */}
          <TextArea
            label="HTML Content (JSON)"
            name="htmlContent"
            value={elementFormData.htmlContent}
            onChange={handleElementChange}
            rows={5}
            placeholder='{"type": "cta", "text": "Call to Action", "link": "#", "style": "primary"}'
            helperText="Optional: Enter HTML content as a JSON object"
          />
        </>
      )}

      {/* Form errors from API */}
      {(errors.createDesign || errors.updateDesign || errors.createElement || errors.updateElement) && (
        <div className={cn(
          "p-3 rounded",
          isDark ? "bg-red-900/20 text-red-300" : "bg-red-100 text-red-700"
        )}>
          <p>{errors.createDesign || errors.updateDesign || errors.createElement || errors.updateElement}</p>
        </div>
      )}

      {/* Form buttons */}
      <div className="flex justify-end gap-3 mt-6">
        <ButtonBase
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </ButtonBase>
        <ButtonBase
          type="submit"
          disabled={isLoading}
          isLoading={isLoading}
        >
          {isEditingDesign 
            ? 'Update Design' 
            : elementId 
              ? 'Update Element' 
              : 'Create Element'
          }
        </ButtonBase>
      </div>
    </form>
  );
};

export default CategoryDesignForm;