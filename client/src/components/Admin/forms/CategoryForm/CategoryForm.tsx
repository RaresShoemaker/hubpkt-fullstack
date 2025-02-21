import React, { useState, useEffect, ChangeEvent } from 'react';
import { useTheme } from '../../../../store/features/ui/useUITheme';
import { useCategories } from '../../../../store/features/categories/useCategories';
import { useAuth } from '../../../../store/features/auth/useAuth';


interface CategoryFormProps {
  categoryId?: string; // If provided, we're updating; if not, we're creating
  onClose: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ categoryId, onClose }) => {
  const { isDark } = useTheme();
  const { 
    items, 
    operations, 
    createNewCategory, 
    updateExistingCategory,
    deleteCategoryById,
  } = useCategories();
  const { user } = useAuth();
  
  // Find max order for new categories
  const maxOrder = items.length > 0 
    ? Math.max(...items.map(item => item.order)) 
    : 0;
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    isAvailable: true,
    hasPreview: false,
    image: null as File | null,
    imagePreview: ''
  });
  const [errors, setErrors] = useState({
    title: '',
    image: ''
  });

  // Load category data if editing
  useEffect(() => {
    if (categoryId) {
      const category = items.find(item => item.id === categoryId);
      if (category) {
        setFormData({
          title: category.title,
          isAvailable: category.isAvailable,
          hasPreview: category.hasPreview,
          image: null, // Can't populate File object from URL
          imagePreview: category.image
        });
      }
    }
  }, [categoryId, items]);

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when user types
    if (name === 'title' && errors.title) {
      setErrors({
        ...errors,
        title: ''
      });
    }
  };

  // Handle file input
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/svg'];
      if (!validTypes.includes(file.type)) {
        setErrors({
          ...errors,
          image: 'Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.'
        });
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({
          ...errors,
          image: 'File is too large. Maximum size is 5MB.'
        });
        return;
      }
      
      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file)
      });
      
      // Clear error when user uploads valid file
      if (errors.image) {
        setErrors({
          ...errors,
          image: ''
        });
      }
    }
  };

  // Form validation
  const validateForm = () => {
    let isValid = true;
    const newErrors = { title: '', image: '' };
    
    if (formData.title.trim() === '') {
      newErrors.title = 'Title is required';
      isValid = false;
    }
    
    // Image is required only for new categories
    if (!categoryId && !formData.image) {
      newErrors.image = 'Image is required';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (categoryId) {
      // Update existing category
      const updateData = {
        id: categoryId,
        title: formData.title,
        isAvailable: formData.isAvailable,
        hasPreview: formData.hasPreview,
        ...(formData.image && { image: formData.image })
      };
      
      await updateExistingCategory(updateData);
      if (!operations.update.error) {
        onClose();
      }
    } else {
      if (!user) return;
      
      const createData = {
        title: formData.title,
        isAvailable: formData.isAvailable,
        hasPreview: formData.hasPreview,
        order: maxOrder + 1,
        userId: user.id,
        image: formData.image as File
      };
      
      await createNewCategory(createData);
      if (!operations.create.error) {
        onClose();
      }
    }
  };

  const handleDeleteCategory = () => {
    if(categoryId) {
      deleteCategoryById(categoryId);
      onClose();
    }
  }

  // Determine if we're in create or update mode
  const isUpdateMode = Boolean(categoryId);
  const isLoading = isUpdateMode ? operations.update.isLoading : operations.create.isLoading;
  const apiError = isUpdateMode ? operations.update.error : operations.create.error;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title input */}
      <div>
        <label 
          className={`block mb-2 ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}
          htmlFor="title"
        >
          Category Title*
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          className={`w-full p-2 rounded border ${
            isDark 
              ? 'bg-dark-surface border-dark-border/50 text-dark-text-primary' 
              : 'bg-light-surface border-light-border/50 text-light-text-primary'
          } ${errors.title ? 'border-red-500' : ''}`}
          placeholder="Enter category title"
        />
        {errors.title && (
          <p className="mt-1 text-red-500 text-sm">{errors.title}</p>
        )}
      </div>
      
      {/* Image upload */}
      <div>
        <label 
          className={`block mb-2 ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}
          htmlFor="image"
        >
          Category Image {!isUpdateMode && '*'}
        </label>
        
        <div className="flex items-center gap-4">
          {/* Image preview */}
          {formData.imagePreview && (
            <div className="w-16 h-16 rounded-md overflow-hidden border border-gray-300">
              <img 
                src={formData.imagePreview} 
                alt="Preview" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {/* File input */}
          <div className="flex-1">
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className={`w-full p-2 rounded border ${
                isDark 
                  ? 'bg-dark-surface border-dark-border/50 text-dark-text-primary' 
                  : 'bg-light-surface border-light-border/50 text-light-text-primary'
              } ${errors.image ? 'border-red-500' : ''}`}
            />
            <p className={`mt-1 text-sm ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
              Accepted formats: JPEG, PNG, GIF, WebP. Max size: 5MB
            </p>
            {errors.image && (
              <p className="mt-1 text-red-500 text-sm">{errors.image}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Checkboxes for isAvailable and hasPreview */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center">
          <input
            id="isAvailable"
            name="isAvailable"
            type="checkbox"
            checked={formData.isAvailable}
            onChange={handleChange}
            className="mr-2"
          />
          <label 
            className={isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}
            htmlFor="isAvailable"
          >
            Available to users
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            id="hasPreview"
            name="hasPreview"
            type="checkbox"
            checked={formData.hasPreview}
            onChange={handleChange}
            className="mr-2"
          />
          <label 
            className={isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}
            htmlFor="hasPreview"
          >
            Show in homepage preview
          </label>
        </div>
      </div>
      
      {/* API Error message */}
      {apiError && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {apiError}
        </div>
      )}
      
      {/* Form buttons */}
      <div className="flex justify-end mt-6 gap-3">
        <button
          type="button"
          onClick={onClose}
          className={`px-4 py-2 rounded ${
            isDark 
              ? 'bg-dark-surface text-dark-text-primary border border-dark-border/50' 
              : 'bg-light-surface text-light-text-primary border border-light-border/50'
          }`}
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`px-4 py-2 rounded ${
            isDark 
              ? 'bg-dark-text-accent text-white' 
              : 'bg-light-text-accent text-white'
          } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : isUpdateMode ? 'Update Category' : 'Create Category'}
        </button>
        {isUpdateMode && (
          <button onClick={handleDeleteCategory} className="text-red-500">
            Delete Category
          </button>
        )}
      </div>
    </form>
  );
};

export default CategoryForm;