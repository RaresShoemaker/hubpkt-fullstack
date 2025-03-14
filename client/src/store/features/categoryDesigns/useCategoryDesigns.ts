import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  createCategoryDesign,
  updateCategoryDesign,
  deleteCategoryDesign,
  fetchCategoryDesign,
  fetchCategoryDesignByCategoryId,
  createDesignElement,
  updateDesignElement,
  deleteDesignElement,
  reorderDesignElements,
  createHtmlElement,
  updateHtmlElement,
  deleteHtmlElement
} from './categoryDesigns.thunk';
import { 
  clearErrors, 
  selectDesignElement, 
  clearCurrentDesign 
} from './categoryDesigns.slice';
import {
  CreateCategoryDesignRequest,
  UpdateCategoryDesignRequest,
  CreateDesignElementRequest,
  UpdateDesignElementRequest,
  CreateHtmlElementRequest,
  UpdateHtmlElementRequest,
  ReorderDesignElementsRequest,
  DesignElement
} from './categoryDesigns.types';

// Use string union type instead of enum
type DeviceSize = "mobile" | "tablet" | "desktop";

export const useCategoryDesigns = () => {
  const dispatch = useAppDispatch();
  const { currentDesign, currentElement, operations } = useAppSelector(
    (state) => state.categoryDesigns
  );

  // Clear errors
  const handleClearErrors = useCallback(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  // Clear current design
  const handleClearCurrentDesign = useCallback(() => {
    dispatch(clearCurrentDesign());
  }, [dispatch]);

  // Select design element
  const handleSelectDesignElement = useCallback((element: DesignElement | null) => {
    dispatch(selectDesignElement(element));
  }, [dispatch]);

  // Create category design
  const handleCreateCategoryDesign = useCallback((data: CreateCategoryDesignRequest) => {
    return dispatch(createCategoryDesign(data)).unwrap();
  }, [dispatch]);

  // Update category design
  const handleUpdateCategoryDesign = useCallback((data: UpdateCategoryDesignRequest) => {
    return dispatch(updateCategoryDesign(data)).unwrap();
  }, [dispatch]);

  // Delete category design
  const handleDeleteCategoryDesign = useCallback((id: string) => {
    return dispatch(deleteCategoryDesign(id)).unwrap();
  }, [dispatch]);

  // Fetch category design
  const handleFetchCategoryDesign = useCallback((id: string) => {
    return dispatch(fetchCategoryDesign(id)).unwrap();
  }, [dispatch]);

  // Fetch category design by category ID
  const handleFetchCategoryDesignByCategoryId = useCallback((categoryId: string) => {
    return dispatch(fetchCategoryDesignByCategoryId(categoryId)).unwrap();
  }, [dispatch]);

  // Create design element
  const handleCreateDesignElement = useCallback((data: CreateDesignElementRequest) => {
    return dispatch(createDesignElement(data)).unwrap();
  }, [dispatch]);

  // Update design element
  const handleUpdateDesignElement = useCallback((data: UpdateDesignElementRequest) => {
    return dispatch(updateDesignElement(data)).unwrap();
  }, [dispatch]);

  // Delete design element
  const handleDeleteDesignElement = useCallback((id: string) => {
    return dispatch(deleteDesignElement(id)).unwrap();
  }, [dispatch]);

  // Reorder design elements
  const handleReorderDesignElements = useCallback((data: ReorderDesignElementsRequest) => {
    return dispatch(reorderDesignElements(data)).unwrap();
  }, [dispatch]);

  // Create HTML element
  const handleCreateHtmlElement = useCallback((data: CreateHtmlElementRequest) => {
    return dispatch(createHtmlElement(data)).unwrap();
  }, [dispatch]);

  // Update HTML element
  const handleUpdateHtmlElement = useCallback((data: UpdateHtmlElementRequest) => {
    return dispatch(updateHtmlElement(data)).unwrap();
  }, [dispatch]);

  // Delete HTML element
  const handleDeleteHtmlElement = useCallback((id: string) => {
    return dispatch(deleteHtmlElement(id)).unwrap();
  }, [dispatch]);

  // Helper method to get design elements by device size
  const getDesignElementsByDeviceSize = useCallback((deviceSize: DeviceSize) => {
    if (!currentDesign || !currentDesign.designElements) return [];
    return currentDesign.designElements.filter(element => element.deviceSize === deviceSize)
      .sort((a, b) => a.order - b.order);
  }, [currentDesign]);

  return {
    // State
    currentDesign,
    currentElement,
    operations,
    
    // Loading states
    loading: {
      createDesign: operations.createDesign.isLoading,
      updateDesign: operations.updateDesign.isLoading,
      deleteDesign: operations.deleteDesign.isLoading,
      fetchDesign: operations.fetchDesign.isLoading,
      createElement: operations.createElement.isLoading,
      updateElement: operations.updateElement.isLoading,
      deleteElement: operations.deleteElement.isLoading,
      reorderElements: operations.reorderElements.isLoading,
      createHtmlElement: operations.createHtmlElement.isLoading,
      updateHtmlElement: operations.updateHtmlElement.isLoading,
      deleteHtmlElement: operations.deleteHtmlElement.isLoading
    },
    
    // Error states
    errors: {
      createDesign: operations.createDesign.error,
      updateDesign: operations.updateDesign.error,
      deleteDesign: operations.deleteDesign.error,
      fetchDesign: operations.fetchDesign.error,
      createElement: operations.createElement.error,
      updateElement: operations.updateElement.error,
      deleteElement: operations.deleteElement.error,
      reorderElements: operations.reorderElements.error,
      createHtmlElement: operations.createHtmlElement.error,
      updateHtmlElement: operations.updateHtmlElement.error,
      deleteHtmlElement: operations.deleteHtmlElement.error
    },
    
    // Utility methods
    getDesignElementsByDeviceSize,
    
    // Action methods
    handleClearErrors,
    handleClearCurrentDesign,
    handleSelectDesignElement,
    handleCreateCategoryDesign,
    handleUpdateCategoryDesign,
    handleDeleteCategoryDesign,
    handleFetchCategoryDesign,
    handleFetchCategoryDesignByCategoryId,
    handleCreateDesignElement,
    handleUpdateDesignElement,
    handleDeleteDesignElement,
    handleReorderDesignElements,
    handleCreateHtmlElement,
    handleUpdateHtmlElement,
    handleDeleteHtmlElement
  };
};