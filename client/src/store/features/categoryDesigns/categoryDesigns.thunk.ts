/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { 
  ApiResponse, 
  CategoryDesigns, 
  CreateDesignElementRequest, 
  CreateHtmlElementRequest, 
  DesignElement, 
  HtmlElement, 
  ReorderDesignElementsRequest, 
  UpdateDesignElementRequest, 
  UpdateHtmlElementRequest 
} from './categoryDesigns.types';
import { DeviceSize } from './categoryDesigns.types';
import api from '../../../api/api';
import { API_ENDPOINTS } from '../../../api/endpoints';

// Fetch all design elements for a category
export const fetchCategoryDesigns = createAsyncThunk(
  'categoryDesigns/fetchCategoryDesigns',
  async (categoryId: string, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<CategoryDesigns>>(
        API_ENDPOINTS.categoryDesigns.getByCategory(categoryId)
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch category designs');
    }
  }
);

export const fetchDesignById = createAsyncThunk(
  'categoryDesigns/fetchDesignById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(
        API_ENDPOINTS.categoryDesigns.getCategoryDesignById(id)
      );

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch category designs');
    }
  }
);

// Fetch a single design element by ID
export const fetchDesignElementById = createAsyncThunk(
  'categoryDesigns/fetchDesignElementById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<DesignElement>>(
        API_ENDPOINTS.categoryDesigns.getOne(id)
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch design element');
    }
  }
);

// Fetch design elements for a category by device size
export const fetchDesignElementsByDevice = createAsyncThunk(
  'categoryDesigns/fetchDesignElementsByDevice',
  async ({ categoryId, device }: { categoryId: string; device: DeviceSize }, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<DesignElement[]>>(
        `${API_ENDPOINTS.categoryDesigns.getElementsByDeviceSize(categoryId)}?device=${device}`
      );
      return { device, elements: response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch design elements');
    }
  }
);

// Create a new design element
export const createDesignElement = createAsyncThunk(
  'categoryDesigns/createDesignElement',
  async (data: CreateDesignElementRequest, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('categoryId', data.categoryId);
      formData.append('device', data.device);
      formData.append('order', String(data.order));
      
      if (data.backgroundGradient) {
        formData.append('backgroundGradient', data.backgroundGradient);
      }
      
      if (data.transitionGradient) {
        formData.append('transitionGradient', data.transitionGradient);
      }
      
      if (data.htmlElements && data.htmlElements.length > 0) {
        formData.append('htmlElements', JSON.stringify(data.htmlElements));
      }
      
      formData.append('image', data.image);

      const response = await api.post<ApiResponse<DesignElement>>(
        API_ENDPOINTS.categoryDesigns.createElement,
        formData
      );
      
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create design element');
    }
  }
);

// Update a design element
export const updateDesignElement = createAsyncThunk(
  'categoryDesigns/updateDesignElement',
  async (data: UpdateDesignElementRequest, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      
      if (data.device) {
        formData.append('device', data.device);
      }
      
      if (data.order !== undefined) {
        formData.append('order', String(data.order));
      }
      
      if (data.backgroundGradient !== undefined) {
        formData.append('backgroundGradient', data.backgroundGradient);
      }
      
      if (data.transitionGradient !== undefined) {
        formData.append('transitionGradient', data.transitionGradient);
      }
      
      if (data.image) {
        formData.append('image', data.image);
      }

      // Add htmlElements handling - direct update from editor
      if (data.htmlElements !== undefined) {
        formData.append('htmlElements', JSON.stringify(data.htmlElements));
      }

      const response = await api.patch<ApiResponse<DesignElement>>(
        API_ENDPOINTS.categoryDesigns.updateElement(data.id),
        formData
      );
      
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update design element');
    }
  }
);

// Delete a design element
export const deleteDesignElement = createAsyncThunk(
  'categoryDesigns/deleteDesignElement',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(API_ENDPOINTS.categoryDesigns.deleteElement(id));
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete design element');
    }
  }
);

// Reorder design elements
export const reorderDesignElements = createAsyncThunk(
  'categoryDesigns/reorderDesignElements',
  async (data: ReorderDesignElementsRequest, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<DesignElement[]>>(
        `${API_ENDPOINTS.categoryDesigns.getElementsByDeviceSize(data.categoryId)}/reorder`,
        {
          device: data.device,
          elementIds: data.elementIds,
        }
      );
      
      return { device: data.device, elements: response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reorder design elements');
    }
  }
);

// Create a new HTML element
export const createHtmlElement = createAsyncThunk(
  'categoryDesigns/createHtmlElement',
  async (data: CreateHtmlElementRequest, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<HtmlElement>>(
        API_ENDPOINTS.categoryDesigns.createHtmlElement,
        {
          designElementId: data.designElementId,
          htmlTag: data.htmlTag,
        }
      );
      
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create HTML element');
    }
  }
);

// Update an HTML element
export const updateHtmlElement = createAsyncThunk(
  'categoryDesigns/updateHtmlElement',
  async (data: UpdateHtmlElementRequest, { rejectWithValue }) => {
    try {
      const response = await api.patch<ApiResponse<HtmlElement>>(
        API_ENDPOINTS.categoryDesigns.updateHtmlElement(data.id),
        {
          htmlTag: data.htmlTag,
        }
      );
      
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update HTML element');
    }
  }
);

// Delete an HTML element
export const deleteHtmlElement = createAsyncThunk(
  'categoryDesigns/deleteHtmlElement',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(API_ENDPOINTS.categoryDesigns.deleteHtmlElement(id));
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete HTML element');
    }
  }
);