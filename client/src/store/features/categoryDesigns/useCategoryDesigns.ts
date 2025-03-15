import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { DeviceSize } from './categoryDesigns.types';
import { 
  CreateDesignElementRequest, 
  CreateHtmlElementRequest, 
  DesignElement,
  ReorderDesignElementsRequest, 
  UpdateDesignElementRequest, 
  UpdateHtmlElementRequest 
} from './categoryDesigns.types';
import { setCurrentDesign, clearCategoryDesigns } from './categoryDesigns.slice';
import { 
  createDesignElement, 
  createHtmlElement, 
  deleteDesignElement, 
  deleteHtmlElement, 
  fetchCategoryDesigns, 
  fetchDesignElementsByDevice, 
  reorderDesignElements, 
  updateDesignElement, 
  updateHtmlElement,
  fetchDesignElementById 
} from './categoryDesigns.thunk';

export const useCategoryDesigns = () => {
  const dispatch = useAppDispatch();
  const { designs, currentDesign, loading, error } = useAppSelector((state) => state.categoryDesigns);

  // Fetch all design elements for a category
  const fetchDesigns = useCallback(
    (categoryId: string) => {
      return dispatch(fetchCategoryDesigns(categoryId));
    },
    [dispatch]
  );

  // Fetch design elements for a specific device
  const fetchDesignsByDevice = useCallback(
    (categoryId: string, device: DeviceSize) => {
      return dispatch(fetchDesignElementsByDevice({ categoryId, device }));
    },
    [dispatch]
  );

  // Fetch a single design element by ID
  const getDesignElementById = useCallback(  // Renamed this function
    (id: string) => {
      return dispatch(fetchDesignElementById(id));
    },
    [dispatch]
  );

  // Create a new design element
  const addDesignElement = useCallback(
    (data: CreateDesignElementRequest) => {
      return dispatch(createDesignElement(data));
    },
    [dispatch]
  );

  // Update a design element
  const editDesignElement = useCallback(
    (data: UpdateDesignElementRequest) => {  // Fixed the type here
      return dispatch(updateDesignElement(data));
    },
    [dispatch]
  );

  // Delete a design element
  const removeDesignElement = useCallback(
    (id: string) => {
      return dispatch(deleteDesignElement(id));
    },
    [dispatch]
  );

  // Reorder design elements
  const reorderElements = useCallback(
    (data: ReorderDesignElementsRequest) => {
      return dispatch(reorderDesignElements(data));
    },
    [dispatch]
  );

  // Set the current design element
  const selectDesignElement = useCallback(
    (design: DesignElement | null) => {
      dispatch(setCurrentDesign(design));
    },
    [dispatch]
  );

  // Create a new HTML element
  const addHtmlElement = useCallback(
    (data: CreateHtmlElementRequest) => {  // Fixed the type here
      return dispatch(createHtmlElement(data));
    },
    [dispatch]
  );

  // Update an HTML element
  const editHtmlElement = useCallback(
    (data: UpdateHtmlElementRequest) => {  // Fixed the type here
      return dispatch(updateHtmlElement(data));
    },
    [dispatch]
  );

  // Delete an HTML element
  const removeHtmlElement = useCallback(
    (id: string) => {
      return dispatch(deleteHtmlElement(id));
    },
    [dispatch]
  );

  // Clear category designs
  const clearDesigns = useCallback(() => {
    dispatch(clearCategoryDesigns());
  }, [dispatch]);

  return {
    // State
    designs,
    currentDesign,
    loading,
    error,
    
    // Actions
    fetchDesigns,
    fetchDesignsByDevice,
    fetchDesignElementById: getDesignElementById, // Return with the original name but using the new function
    addDesignElement,
    editDesignElement,
    removeDesignElement,
    reorderElements,
    selectDesignElement,
    addHtmlElement,
    editHtmlElement,
    removeHtmlElement,
    clearDesigns
  };
};