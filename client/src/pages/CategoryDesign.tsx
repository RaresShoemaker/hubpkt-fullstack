import React from 'react';
import CategoryDesignLayout from '../layouts/CategoryDesignLayout';
import { useCategoryDesigns } from '../store/features/categoryDesigns/useCategoryDesigns';


const CategoryDesignPage: React.FC = () => {
  const { currentDesign } = useCategoryDesigns();

  return (
    <CategoryDesignLayout 
      backgroundGradient={currentDesign?.backgroundGradient}
      heroImage={currentDesign?.image}
      transitionGradient={currentDesign?.transitionGradient}
      htmlElements={currentDesign?.htmlElements}
    />
  )
};

export default CategoryDesignPage;