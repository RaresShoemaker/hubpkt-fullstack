import React, { useState } from 'react';
import { useTheme } from '../../../../store/features/ui/useUITheme';
import ButtonBase from '../../Buttons/ButtonBase';
import { FileUpload } from '../../forms/FileUpload';
import { cn } from '../../../../lib/utils';

interface CategoryDesignFormProps {
  onClose: () => void;
  designId?: string; // If provided, we're editing
  categoryId: string;
  initialData?: {
    backgroundGradient?: string;
    transitionGradient?: string;
  };
  formType: 'design' | 'element';
  deviceSize?: 'mobile' | 'tablet' | 'desktop';
}

const CategoryDesignForm: React.FC<CategoryDesignFormProps> = ({
  onClose,
  designId,
  initialData = {},
  formType,
  deviceSize = 'desktop',
}) => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    backgroundGradient: initialData.backgroundGradient || 'linear-gradient(180deg, #090D23 0%, #1D2343 100%)',
    transitionGradient: initialData.transitionGradient || 'linear-gradient(180deg, rgba(9,13,35,0) 0%, #090D23 100%)',
    htmlElements: '[]',
    imageFile: null as File | null,
    imagePreview: '',
    order: 1,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (file: File | null) => {
    if (file) {
      setFormData(prev => ({
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        imageFile: null,
        imagePreview: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // This is where you'd implement the actual API call
      // For now, we'll just simulate a successful operation
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Close the modal
      onClose();
    } catch (error) {
      console.error('Error saving design:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formType === 'design' && (
        <>
          <div className="space-y-4">
            <div>
              <label
                className={cn(
                  'block mb-2 font-medium',
                  isDark ? 'text-dark-text-primary' : 'text-light-text-primary'
                )}
              >
                Background Gradient
              </label>
              <input
                type="text"
                name="backgroundGradient"
                value={formData.backgroundGradient}
                onChange={handleChange}
                className={cn(
                  'w-full p-2 rounded border',
                  isDark
                    ? 'bg-dark-surface border-dark-border text-dark-text-primary'
                    : 'bg-light-surface border-light-border text-light-text-primary'
                )}
              />
              <div className="mt-2 h-10 rounded" style={{ background: formData.backgroundGradient }} />
            </div>

            <div>
              <label
                className={cn(
                  'block mb-2 font-medium',
                  isDark ? 'text-dark-text-primary' : 'text-light-text-primary'
                )}
              >
                Transition Gradient
              </label>
              <input
                type="text"
                name="transitionGradient"
                value={formData.transitionGradient}
                onChange={handleChange}
                className={cn(
                  'w-full p-2 rounded border',
                  isDark
                    ? 'bg-dark-surface border-dark-border text-dark-text-primary'
                    : 'bg-light-surface border-light-border text-light-text-primary'
                )}
              />
              <div className="mt-2 h-10 rounded" style={{ background: formData.transitionGradient }} />
            </div>
          </div>
        </>
      )}

      {formType === 'element' && (
        <>
          <div>
            <label
              className={cn(
                'block mb-2 font-medium',
                isDark ? 'text-dark-text-primary' : 'text-light-text-primary'
              )}
            >
              Element for {deviceSize.charAt(0).toUpperCase() + deviceSize.slice(1)} View
            </label>

            <div className="mb-4">
              <label
                className={cn(
                  'block mb-2',
                  isDark ? 'text-dark-text-primary' : 'text-light-text-primary'
                )}
              >
                Order
              </label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                min={1}
                className={cn(
                  'w-full p-2 rounded border',
                  isDark
                    ? 'bg-dark-surface border-dark-border text-dark-text-primary'
                    : 'bg-light-surface border-light-border text-light-text-primary'
                )}
              />
            </div>

            <FileUpload
              label="Element Image"
              name="imageFile"
              onChange={handleFileChange}
              preview={formData.imagePreview}
              required={true}
              error={!formData.imageFile ? "Image is required" : ""}
              helperText="Upload an image for this design element"
              accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml,image/svg"
            />

            <div className="mt-4">
              <label
                className={cn(
                  'block mb-2',
                  isDark ? 'text-dark-text-primary' : 'text-light-text-primary'
                )}
              >
                HTML Elements (Advanced)
              </label>
              <textarea
                name="htmlElements"
                value={formData.htmlElements}
                onChange={handleChange}
                rows={5}
                className={cn(
                  'w-full p-2 rounded border',
                  isDark
                    ? 'bg-dark-surface border-dark-border text-dark-text-primary'
                    : 'bg-light-surface border-light-border text-light-text-primary'
                )}
                placeholder='[{"type":"cta","style":"primary","text":"Learn More","link":"#","position":"center"}]'
              />
              <p className={cn(
                'mt-1 text-xs',
                isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'
              )}>
                JSON format for HTML elements (optional)
              </p>
            </div>
          </div>
        </>
      )}

      <div className="flex justify-end space-x-2 pt-4">
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
          disabled={isLoading || (formType === 'element' && !formData.imageFile)}
        >
          {isLoading ? 'Saving...' : (designId ? 'Update' : 'Create')}
        </ButtonBase>
      </div>
    </form>
  );
};

export default CategoryDesignForm;