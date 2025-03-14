/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../api/api';
import { API_ENDPOINTS } from '../../../api/endpoints';
import {
  CreateCategoryDesignRequest,
  UpdateCategoryDesignRequest,
  CreateDesignElementRequest,
  UpdateDesignElementRequest,
  CreateHtmlElementRequest,
  UpdateHtmlElementRequest,
  ReorderDesignElementsRequest,
  CategoryDesign,
  DesignElement,
  HtmlElement
} from './categoryDesigns.types';

// Create Category Design
export const createCategoryDesign = createAsyncThunk(
  'categoryDesigns/create',
  async (data: CreateCategoryDesignRequest, { rejectWithValue }) => {
    try {
      const response = await api.post(API_ENDPOINTS.categoryDesigns.create, data);
      return response.data.data as CategoryDesign;
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
  async (data: UpdateCategoryDesignRequest, { rejectWithValue }) => {
    try {
      const response = await api.patch(API_ENDPOINTS.categoryDesigns.update(data.id), {
        backgroundGradient: data.backgroundGradient,
        transitionGradient: data.transitionGradient
      });
      return response.data.data as CategoryDesign;
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
      return true;
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
      const response = await api.get(API_ENDPOINTS.categoryDesigns.getOne(id));
      return response.data.data as CategoryDesign;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch category design'
      );
    }
  }
);

// Fetch Category Design by Category ID
export const fetchCategoryDesignByCategoryId = createAsyncThunk(
  'categoryDesigns/fetchByCategoryId',
  async (categoryId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.categoryDesigns.getByCategory(categoryId));
      return response.data.data as CategoryDesign;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch category design'
      );
    }
  }
);

// Create Design Element
export const createDesignElement = createAsyncThunk(
  'categoryDesigns/createElement',
  async (data: CreateDesignElementRequest, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('categoryDesignId', data.categoryDesignId);
      formData.append('order', data.order.toString());
      formData.append('deviceSize', data.deviceSize);
      formData.append('image', data.image);
      
      if (data.htmlElements && data.htmlElements.length > 0) {
        formData.append('htmlElements', JSON.stringify(data.htmlElements));
      }

      const response = await api.post(API_ENDPOINTS.categoryDesigns.createElement, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data.data as DesignElement;
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
  async (data: UpdateDesignElementRequest, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      
      if (data.order !== undefined) {
        formData.append('order', data.order.toString());
      }
      
      if (data.deviceSize) {
        formData.append('deviceSize', data.deviceSize);
      }
      
      if (data.image) {
        formData.append('image', data.image);
      }

      const response = await api.patch(
        API_ENDPOINTS.categoryDesigns.updateElement(data.id), 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      return response.data.data as DesignElement;
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
      return true;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete design element'
      );
    }
  }
);

// Reorder Design Elements
export const reorderDesignElements = createAsyncThunk(
  'categoryDesigns/reorderElements',
  async (data: ReorderDesignElementsRequest, { rejectWithValue }) => {
    try {
      const response = await api.post(
        API_ENDPOINTS.categoryDesigns.reorderElements(data.categoryDesignId),
        {
          deviceSize: data.deviceSize,
          elementIds: data.elementIds
        }
      );
      
      return response.data.data as DesignElement[];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to reorder design elements'
      );
    }
  }
);

// Create HTML Element
export const createHtmlElement = createAsyncThunk(
  'categoryDesigns/createHtmlElement',
  async (data: CreateHtmlElementRequest, { rejectWithValue }) => {
    try {
      const response = await api.post(
        API_ENDPOINTS.categoryDesigns.createHtmlElement,
        {
          designElementId: data.designElementId,
          htmlTag: JSON.stringify(data.htmlTag)
        }
      );
      
      return response.data.data as HtmlElement;
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
  async (data: UpdateHtmlElementRequest, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        API_ENDPOINTS.categoryDesigns.updateHtmlElement(data.id),
        {
          htmlTag: JSON.stringify(data.htmlTag)
        }
      );
      
      return response.data.data as HtmlElement;
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
      return true;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete HTML element'
      );
    }
  }
);