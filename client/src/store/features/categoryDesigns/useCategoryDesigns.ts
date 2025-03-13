// src/store/features/categoryDesigns/useCategoryDesigns.ts

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  createCategoryDesign,
  updateCategoryDesign,
  deleteCategoryDesign,
  fetchCategoryDesign,
  fetchCategoryDesignByCategory,
  createDesignElement,
  updateDesignElement,
  deleteDesignElement,
  createHtmlElement,
  updateHtmlElement,
  deleteHtmlElement,
  reorderDesignElements
} from './categoryDesigns.thunk';
import { clearErrors, selectDesign } from './categoryDesigns.slice';
import { 
  CategoryDesign, 
  CreateCategoryDesignInput, 
  CreateDesignElementInput, 
  CreateHtmlElementInput, 
  DesignElement, 
  DeviceSize, 
  // HtmlElement,
  UpdateCategoryDesignInput, 
  UpdateDesignElementInput, 
  UpdateHtmlElementInput 
} from './categoryDesigns.types';

export const useCategoryDesigns = () => {
  const dispatch = useAppDispatch();
  const { designs, currentDesign, operations } = useAppSelector((state) => state.categoryDesigns);

  // Design actions
  const handleCreateDesign = useCallback(
    (data: CreateCategoryDesignInput) => dispatch(createCategoryDesign(data)),
    [dispatch]
  );

  const handleUpdateDesign = useCallback(
    (data: UpdateCategoryDesignInput) => dispatch(updateCategoryDesign(data)),
    [dispatch]
  );

  const handleDeleteDesign = useCallback(
    (id: string) => dispatch(deleteCategoryDesign(id)),
    [dispatch]
  );

  const handleFetchDesign = useCallback(
    (id: string) => dispatch(fetchCategoryDesign(id)),
    [dispatch]
  );

  const handleFetchDesignByCategory = useCallback(
    (categoryId: string) => dispatch(fetchCategoryDesignByCategory(categoryId)),
    [dispatch]
  );

  const handleSelectDesign = useCallback(
    (design: CategoryDesign | null) => dispatch(selectDesign(design)),
    [dispatch]
  );

  // Element actions
  const handleCreateElement = useCallback(
    (data: CreateDesignElementInput) => dispatch(createDesignElement(data)),
    [dispatch]
  );

  const handleUpdateElement = useCallback(
    (data: UpdateDesignElementInput) => dispatch(updateDesignElement(data)),
    [dispatch]
  );

  const handleDeleteElement = useCallback(
    (id: string) => dispatch(deleteDesignElement(id)),
    [dispatch]
  );

  const handleReorderElements = useCallback(
    (categoryDesignId: string, deviceSize: DeviceSize, elementIds: string[]) => 
      dispatch(reorderDesignElements({ categoryDesignId, deviceSize, elementIds })),
    [dispatch]
  );

  // HTML Element actions
  const handleCreateHtmlElement = useCallback(
    (data: CreateHtmlElementInput) => dispatch(createHtmlElement(data)),
    [dispatch]
  );

  const handleUpdateHtmlElement = useCallback(
    (data: UpdateHtmlElementInput) => dispatch(updateHtmlElement(data)),
    [dispatch]
  );

  const handleDeleteHtmlElement = useCallback(
    (id: string) => dispatch(deleteHtmlElement(id)),
    [dispatch]
  );

  const handleClearErrors = useCallback(
    () => dispatch(clearErrors()),
    [dispatch]
  );

  // Helper function to filter design elements by device size
  const getElementsByDeviceSize = useCallback(
    (deviceSize: DeviceSize): DesignElement[] => {
      if (!currentDesign) return [];
      return currentDesign.designElements.filter((element: { deviceSize: string; }) => element.deviceSize === deviceSize);
    },
    [currentDesign]
  );

  return {
    designs,
    currentDesign,
    operations,

    // Loading states
    loading: {
      createDesign: operations.createDesign.isLoading,
      updateDesign: operations.updateDesign.isLoading,
      deleteDesign: operations.deleteDesign.isLoading,
      fetchDesign: operations.fetchDesign.isLoading,
      fetchDesignByCategory: operations.fetchDesignByCategory.isLoading,
      createElement: operations.createElement.isLoading,
      updateElement: operations.updateElement.isLoading,
      deleteElement: operations.deleteElement.isLoading,
      createHtmlElement: operations.createHtmlElement.isLoading,
      updateHtmlElement: operations.updateHtmlElement.isLoading,
      deleteHtmlElement: operations.deleteHtmlElement.isLoading,
      reorderElements: operations.reorderElements.isLoading,
    },

    // Error states
    errors: {
      createDesign: operations.createDesign.error,
      updateDesign: operations.updateDesign.error,
      deleteDesign: operations.deleteDesign.error,
      fetchDesign: operations.fetchDesign.error,
      fetchDesignByCategory: operations.fetchDesignByCategory.error,
      createElement: operations.createElement.error,
      updateElement: operations.updateElement.error,
      deleteElement: operations.deleteElement.error,
      createHtmlElement: operations.createHtmlElement.error,
      updateHtmlElement: operations.updateHtmlElement.error,
      deleteHtmlElement: operations.deleteHtmlElement.error,
      reorderElements: operations.reorderElements.error,
    },

    // Action creators
    handleCreateDesign,
    handleUpdateDesign,
    handleDeleteDesign,
    handleFetchDesign,
    handleFetchDesignByCategory,
    handleSelectDesign,
    handleCreateElement,
    handleUpdateElement,
    handleDeleteElement,
    handleReorderElements,
    handleCreateHtmlElement,
    handleUpdateHtmlElement,
    handleDeleteHtmlElement,
    handleClearErrors,
    
    // Helper functions
    getElementsByDeviceSize,
  };
};