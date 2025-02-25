import React, { useState, useEffect, ChangeEvent } from 'react';
import { useTheme } from '../../../../store/features/ui/useUITheme';
import ButtonBase from '../../Buttons/ButtonBase';
import { useCards } from '../../../../store/features/cards/useCards';
import { useCategories } from '../../../../store/features/categories/useCategories';
import { Calendar, Clock } from 'lucide-react';

interface CardFormProps {
  onClose: () => void;
}

const CardForm: React.FC<CardFormProps> = ({ onClose }) => {
  const { isDark } = useTheme();
  const { currentCategory } = useCategories();
  const { 
    currentCard,
    handleCreateCard, 
    handleUpdateCard,
    handleDeleteCard,
    loading,
    error
  } = useCards();
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
    categoryId: currentCategory?.id || '',
    isAvailable: true,
    isDiscover: false,
    isHot: false,
    isPreview: false,
    expirationDate: '',
    expirationTime: '',
    image: null as File | null,
    imagePreview: ''
  });

  const [errors, setErrors] = useState({
    title: '',
    description: '',
    genre: '',
    categoryId: '',
    image: '',
    expiration: ''
  });

  // Load card data if editing
  useEffect(() => {
    if (currentCard) {
      // If we have an expiration date, split it into date and time components
      let expirationDate = '';
      let expirationTime = '';
      
      if (currentCard.expiration) {
        const date = new Date(currentCard.expiration);
        expirationDate = date.toISOString().split('T')[0]; // YYYY-MM-DD format
        expirationTime = date.toTimeString().split(' ')[0].substring(0, 5); // HH:MM format
      }
      
      setFormData({
        title: currentCard.title,
        description: currentCard.description,
        genre: currentCard.genre,
        categoryId: currentCard.categoryId,
        isAvailable: Boolean(currentCard.isAvailable),
        isDiscover: Boolean(currentCard.isDiscover),
        isHot: Boolean(currentCard.isHot),
        isPreview: Boolean(currentCard.isPreview),
        expirationDate,
        expirationTime,
        image: null, // Can't populate File object from URL
        imagePreview: currentCard.image
      });
    } else if (currentCategory) {
      // If creating a new card in a specific category
      setFormData(prevState => ({
        ...prevState,
        categoryId: currentCategory.id
      }));
    }
  }, [currentCard, currentCategory]);

  // Combine date and time to get full expiration datetime
  const getExpirationDateTime = () => {
    if (!formData.expirationDate) return undefined;
    
    const dateTimeStr = `${formData.expirationDate}T${formData.expirationTime || '00:00'}`;
    return new Date(dateTimeStr);
  };

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when user types
    if (name in errors && errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    
    // Clear expiration error when either date or time changes
    if ((name === 'expirationDate' || name === 'expirationTime') && errors.expiration) {
      setErrors({
        ...errors,
        expiration: ''
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
    const newErrors = { 
      title: '', 
      description: '', 
      genre: '', 
      categoryId: '', 
      image: '',
      expiration: ''
    };
    
    if (formData.title.trim() === '') {
      newErrors.title = 'Title is required';
      isValid = false;
    }
    
    if (formData.description.trim() === '') {
      newErrors.description = 'Description is required';
      isValid = false;
    }
    
    if (formData.genre.trim() === '') {
      newErrors.genre = 'Genre is required';
      isValid = false;
    }
    
    if (formData.categoryId === '') {
      newErrors.categoryId = 'Category is required';
      isValid = false;
    }
    
    // Image is required only for new cards
    if (!currentCard && !formData.image) {
      newErrors.image = 'Image is required';
      isValid = false;
    }
    
    // Validate expiration date if provided
    if (formData.expirationDate) {
      const expirationDateTime = getExpirationDateTime();
      const now = new Date();
      
      if (expirationDateTime && expirationDateTime <= now) {
        newErrors.expiration = 'Expiration date must be in the future';
        isValid = false;
      }
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
    
    const expiration = getExpirationDateTime();
    
    if (currentCard) {
      // Update existing card
      await handleUpdateCard({
        id: currentCard.id,
        title: formData.title,
        description: formData.description,
        genre: formData.genre,
        categoryId: formData.categoryId,
        isAvailable: formData.isAvailable,
        isDiscover: formData.isDiscover,
        isHot: formData.isHot,
        isPreview: formData.isPreview,
        expiration,
        ...(formData.image && { image: formData.image })
      });
      
      if (!error.updateCard) {
        onClose();
      }
    } else {
      // Create new card
      await handleCreateCard({
        title: formData.title,
        description: formData.description,
        genre: formData.genre,
        categoryId: formData.categoryId,
        isAvailable: formData.isAvailable,
        isDiscover: formData.isDiscover,
        isHot: formData.isHot,
        isPreview: formData.isPreview,
        expiration,
        image: formData.image as File,
      });
      
      if (!error.createCard) {
        onClose();
      }
    }
  };

  const handleDeleteCardClick = () => {
    if(currentCard) {
      handleDeleteCard(currentCard.id);
      onClose();
    }
  };

  // Determine if we're in create or update mode
  const isUpdateMode = Boolean(currentCard);
  const isLoading = isUpdateMode ? loading.updateCard : loading.createCard;
  const apiError = isUpdateMode ? error.updateCard : error.createCard;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title input */}
      <div>
        <label 
          className={`block mb-2 ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}
          htmlFor="title"
        >
          Card Title*
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
          placeholder="Enter card title"
        />
        {errors.title && (
          <p className="mt-1 text-red-500 text-sm">{errors.title}</p>
        )}
      </div>

      {/* Description textarea */}
      <div>
        <label 
          className={`block mb-2 ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}
          htmlFor="description"
        >
          Description*
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className={`w-full p-2 rounded border ${
            isDark 
              ? 'bg-dark-surface border-dark-border/50 text-dark-text-primary' 
              : 'bg-light-surface border-light-border/50 text-light-text-primary'
          } ${errors.description ? 'border-red-500' : ''}`}
          placeholder="Enter card description"
        />
        {errors.description && (
          <p className="mt-1 text-red-500 text-sm">{errors.description}</p>
        )}
      </div>

      {/* Genre input */}
      <div>
        <label 
          className={`block mb-2 ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}
          htmlFor="genre"
        >
          Genre*
        </label>
        <input
          id="genre"
          name="genre"
          type="text"
          value={formData.genre}
          onChange={handleChange}
          className={`w-full p-2 rounded border ${
            isDark 
              ? 'bg-dark-surface border-dark-border/50 text-dark-text-primary' 
              : 'bg-light-surface border-light-border/50 text-light-text-primary'
          } ${errors.genre ? 'border-red-500' : ''}`}
          placeholder="Enter genre (e.g., Adventure, Mystery, Sci-Fi)"
        />
        {errors.genre && (
          <p className="mt-1 text-red-500 text-sm">{errors.genre}</p>
        )}
      </div>

      {/* Category ID - hidden field */}
      <input 
        type="hidden"
        name="categoryId"
        value={formData.categoryId}
      />

      {/* Expiration date input with datepicker */}
      <div>
        <label 
          className={`block mb-2 ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}
          htmlFor="expirationDate"
        >
          Expiration Date (Optional)
        </label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Date picker */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar size={16} className={isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'} />
            </div>
            <input
              id="expirationDate"
              name="expirationDate"
              type="date"
              value={formData.expirationDate}
              onChange={handleChange}
              className={`w-full pl-10 p-2 rounded border ${
                isDark 
                  ? 'bg-dark-surface border-dark-border/50 text-dark-text-primary' 
                  : 'bg-light-surface border-light-border/50 text-light-text-primary'
              } ${errors.expiration ? 'border-red-500' : ''}`}
            />
          </div>
          
          {/* Time picker */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Clock size={16} className={isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'} />
            </div>
            <input
              id="expirationTime"
              name="expirationTime"
              type="time"
              value={formData.expirationTime}
              onChange={handleChange}
              className={`w-full pl-10 p-2 rounded border ${
                isDark 
                  ? 'bg-dark-surface border-dark-border/50 text-dark-text-primary' 
                  : 'bg-light-surface border-light-border/50 text-light-text-primary'
              } ${errors.expiration ? 'border-red-500' : ''}`}
            />
          </div>
        </div>
        
        {errors.expiration && (
          <p className="mt-1 text-red-500 text-sm">{errors.expiration}</p>
        )}
        <p className={`mt-1 text-sm ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
          If set, card will not be available after this date and time
        </p>
      </div>
      
      {/* Image upload */}
      <div>
        <label 
          className={`block mb-2 ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}
          htmlFor="image"
        >
          Card Image {!isUpdateMode && '*'}
        </label>
        
        <div className="flex items-center gap-4">
          {/* Image preview */}
          {formData.imagePreview && (
            <div className="w-24 h-24 rounded-md overflow-hidden border border-gray-300">
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
      
      {/* Checkboxes section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            id="isDiscover"
            name="isDiscover"
            type="checkbox"
            checked={formData.isDiscover}
            onChange={handleChange}
            className="mr-2"
          />
          <label 
            className={isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}
            htmlFor="isDiscover"
          >
            Add to Discover section
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            id="isHot"
            name="isHot"
            type="checkbox"
            checked={formData.isHot}
            onChange={handleChange}
            className="mr-2"
          />
          <label 
            className={isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}
            htmlFor="isHot"
          >
            Mark as Hot
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            id="isPreview"
            name="isPreview"
            type="checkbox"
            checked={formData.isPreview}
            onChange={handleChange}
            className="mr-2"
          />
          <label 
            className={isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}
            htmlFor="isPreview"
          >
            Show in preview
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
      <div className="flex justify-center mt-6 gap-3">
        <ButtonBase
          type="button"
          variant='secondary'
          onClick={onClose}
          className="font-semibold"
          disabled={isLoading}
        >
          Cancel
        </ButtonBase>
        <ButtonBase
          type="submit"
          className={isDark ? "bg-dark-text-accent text-white font-semibold" : "bg-light-text-accent text-white font-semibold"}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : isUpdateMode ? 'Update Card' : 'Create Card'}
        </ButtonBase>
        {isUpdateMode && (
          <ButtonBase
            onClick={handleDeleteCardClick}
            className="font-semibold"
            variant='ghost'
          >
            Delete Card
          </ButtonBase>
        )}
      </div>
    </form>
  );
};

export default CardForm;