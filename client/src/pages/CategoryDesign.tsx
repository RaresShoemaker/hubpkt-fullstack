import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CategoryDesignLayout from '../layouts/CategoryDesignLayout';
import { useCategoryDesigns } from '../store/features/categoryDesigns/useCategoryDesigns';
import { useTheme } from '../store/features/ui/useUITheme';

const CategoryDesignPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { 
    currentDesign, 
    getDesignById, 
    loading,
    error
  } = useCategoryDesigns();

  // Fetch design element data when component mounts
  useEffect(() => {
    if (id) {
      getDesignById(id);
    }
  }, [id, getDesignById]);

  // Show loading state while fetching design
  if (loading && !currentDesign) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
          isDark ? 'border-dark-text-accent' : 'border-light-text-accent'
        }`}></div>
      </div>
    );
  }

  // Show error state if there's an error
  if (error && !currentDesign) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl text-red-500 mb-4">Error loading design</h2>
        <p className="text-gray-400 mb-6">{error}</p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // If no design found (should not happen if properly linked)
  if (!currentDesign) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl text-gray-300 mb-4">Design not found</h2>
        <button 
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <CategoryDesignLayout 
      backgroundGradient={currentDesign.backgroundGradient}
      heroImage={currentDesign.image}
      transitionGradient={currentDesign.transitionGradient}
      designId={currentDesign.id}
    />
  );
};

export default CategoryDesignPage;