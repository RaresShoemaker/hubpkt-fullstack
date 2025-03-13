/* eslint-disable @typescript-eslint/no-explicit-any */
// src/store/features/categoryDesigns/categoryDesigns.thunk.ts

import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../api/api';
import { API_ENDPOINTS } from '../../../api/endpoints';
import {
  CategoryDesign,
  CreateCategoryDesignInput,
  CreateDesignElementInput,
  CreateHtmlElementInput,
  DesignElement,
  DeviceSize,
  HtmlElement,
  UpdateCategoryDesignInput,
  UpdateDesignElementInput,
  UpdateHtmlElementInput
} from './categoryDesigns.types';

// Create Category Design
export const createCategoryDesign = createAsyncThunk(
  'categoryDesigns/create',
  async (data: CreateCategoryDesignInput, { rejectWithValue }) => {
    try {
      const response = await api.post<CategoryDesign>(
        API_ENDPOINTS.categoryDesigns.create, 
        data
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create category design'
      );
    }
  }
);

// Update Category Design
export const updateCategoryDesign = createAsyncThunk(
  'categoryDesigns/update',
  async (data: UpdateCategoryDesignInput, { rejectWithValue }) => {
    try {
      const response = await api.patch<CategoryDesign>(
        API_ENDPOINTS.categoryDesigns.update(data.id), 
        data
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update category design'
      );
    }
  }
);

// Delete Category Design
export const deleteCategoryDesign = createAsyncThunk(
  'categoryDesigns/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(API_ENDPOINTS.categoryDesigns.delete(id));
      return { success: true };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete category design'
      );
    }
  }
);

// Fetch Category Design by ID
export const fetchCategoryDesign = createAsyncThunk(
  'categoryDesigns/fetch',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get<CategoryDesign>(
        API_ENDPOINTS.categoryDesigns.getOne(id)
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch category design'
      );
    }
  }
);

// Fetch Category Design by Category ID
export const fetchCategoryDesignByCategory = createAsyncThunk(
  'categoryDesigns/fetchByCategory',
  async (categoryId: string, { rejectWithValue }) => {
    try {
      const response = await api.get<CategoryDesign>(
        API_ENDPOINTS.categoryDesigns.getByCategory(categoryId)
      );
      return response.data;
    } catch (error: any) {
      // If 404, it means the category has no design yet - return null instead of rejecting
      if (error.response?.status === 404) {
        return null;
      }
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch category design'
      );
    }
  }
);

// Create Design Element
export const createDesignElement = createAsyncThunk(
  'categoryDesigns/createElement',
  async (data: CreateDesignElementInput, { rejectWithValue }) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('categoryDesignId', data.categoryDesignId);
      formData.append('order', String(data.order));
      formData.append('deviceSize', data.deviceSize);
      
      if (data.htmlElements) {
        formData.append('htmlElements', JSON.stringify(data.htmlElements));
      }
      
      if (data.imageFile) {
        formData.append('image', data.imageFile);
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      const response = await api.post<DesignElement>(
        API_ENDPOINTS.categoryDesigns.createElement,
        formData,
        config
      );
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create design element'
      );
    }
  }
);

// Update Design Element
export const updateDesignElement = createAsyncThunk(
  'categoryDesigns/updateElement',
  async (data: UpdateDesignElementInput, { rejectWithValue }) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      
      if (data.order !== undefined) {
        formData.append('order', String(data.order));
      }
      
      if (data.deviceSize) {
        formData.append('deviceSize', data.deviceSize);
      }
      
      if (data.imageFile) {
        formData.append('image', data.imageFile);
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      const response = await api.patch<DesignElement>(
        API_ENDPOINTS.categoryDesigns.updateElement(data.id),
        formData,
        config
      );
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update design element'
      );
    }
  }
);

// Delete Design Element
export const deleteDesignElement = createAsyncThunk(
  'categoryDesigns/deleteElement',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(API_ENDPOINTS.categoryDesigns.deleteElement(id));
      return { success: true };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete design element'
      );
    }
  }
);

// Create HTML Element
export const createHtmlElement = createAsyncThunk(
  'categoryDesigns/createHtmlElement',
  async (data: CreateHtmlElementInput, { rejectWithValue }) => {
    try {
      const response = await api.post<HtmlElement>(
        API_ENDPOINTS.categoryDesigns.createHtmlElement,
        data
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create HTML element'
      );
    }
  }
);

// Update HTML Element
export const updateHtmlElement = createAsyncThunk(
  'categoryDesigns/updateHtmlElement',
  async (data: UpdateHtmlElementInput, { rejectWithValue }) => {
    try {
      const response = await api.patch<HtmlElement>(
        API_ENDPOINTS.categoryDesigns.updateHtmlElement(data.id),
        { htmlTag: data.htmlTag }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update HTML element'
      );
    }
  }
);

// Delete HTML Element
export const deleteHtmlElement = createAsyncThunk(
  'categoryDesigns/deleteHtmlElement',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(API_ENDPOINTS.categoryDesigns.deleteHtmlElement(id));
      return { success: true };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete HTML element'
      );
    }
  }
);

// Reorder Design Elements
export const reorderDesignElements = createAsyncThunk(
  'categoryDesigns/reorderElements',
  async (
    { categoryDesignId, deviceSize, elementIds }: { 
      categoryDesignId: string; 
      deviceSize: DeviceSize; 
      elementIds: string[]
    }, 
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post<DesignElement[]>(
        API_ENDPOINTS.categoryDesigns.reorderElements(categoryDesignId),
        { deviceSize, elementIds }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to reorder design elements'
      );
    }
  }
);