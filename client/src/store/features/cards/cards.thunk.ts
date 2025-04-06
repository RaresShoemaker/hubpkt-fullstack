/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../api/api';
import { API_ENDPOINTS } from '../../../api/endpoints';
import {
  Card,
  CardFilterParams,
  CardResponse,
  CreateCardRequest,
  ReorderCardsPayload,
  UpdateCardOrderPayload,
  UpdateCardRequest
} from './cards.types';

// Basic CRUD operations
export const createCard = createAsyncThunk(
  'cards/create',
  async (data: CreateCardRequest, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      const response = await api.post(API_ENDPOINTS.cards.create, data, config);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'An error occurred while creating the card'
      );
    }
  }
);

export const updateCard = createAsyncThunk(
  'cards/update',
  async (data: UpdateCardRequest, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };
      const response = await api.put(API_ENDPOINTS.cards.update(data.id), data, config);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'An error occurred while updating the card'
      );
    }
  }
);

// The rest of your thunk functions remain the same
export const deleteCard = createAsyncThunk(
  'cards/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.delete(API_ENDPOINTS.cards.delete(id));
      return { id, success: response.data.success };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'An error occurred while deleting the card'
      );
    }
  }
);

export const fetchCard = createAsyncThunk(
  'cards/fetch',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get<Card>(API_ENDPOINTS.cards.getOne(id));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'An error occurred while fetching the card'
      );
    }
  }
);

export const fetchCards = createAsyncThunk(
  'cards/fetchAll',
  async (params: CardFilterParams = {}, { rejectWithValue }) => {
    try {
      // Convert params to query string parameters
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            // Handle array values (like categoryId or genre)
            value.forEach(item => queryParams.append(key, String(item)));
          } else if (value instanceof Date) {
            // Handle date objects
            queryParams.append(key, value.toISOString());
          } else {
            // Handle primitive values
            queryParams.append(key, String(value));
          }
        }
      });

      const response = await api.get<CardResponse>(`${API_ENDPOINTS.cards.list}?${queryParams}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'An error occurred while fetching cards'
      );
    }
  }
);

// All other thunk functions remain the same
// (omitted for brevity)

export const updateCardOrder = createAsyncThunk(
  'cards/updateOrder',
  async (data: UpdateCardOrderPayload, { rejectWithValue }) => {
    try {
      const payload = {
        order: data.newOrder,
        categoryId: data.categoryId
      };
      
      const response = await api.put(API_ENDPOINTS.cards.updateOrder(data.cardId), payload);
      return { 
        ...data, 
        success: response.data.success,
        affectedCards: response.data.affectedCards,
        data: response.data.data,
        previousPosition: response.data.previousPosition,
        newPosition: response.data.newPosition,
        orderChanges: response.data.orderChanges
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'An error occurred while updating card order'
      );
    }
  }
);

export const reorderCards = createAsyncThunk(
  'cards/reorder',
  async (data: ReorderCardsPayload, { rejectWithValue }) => {
    try {
      const response = await api.post(API_ENDPOINTS.cards.reorder, data);
      return { ...data, success: response.data.success };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'An error occurred while reordering cards'
      );
    }
  }
);

export const fetchFilteredCards = createAsyncThunk(
  'cards/fetchFiltered',
  async (params: CardFilterParams = {}, { rejectWithValue }) => {
    try {
      // Convert params to query string parameters
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(item => queryParams.append(key, String(item)));
          } else if (value instanceof Date) {
            queryParams.append(key, value.toISOString());
          } else {
            queryParams.append(key, String(value));
          }
        }
      });

      const response = await api.get<CardResponse>(`${API_ENDPOINTS.cards.filtered}?${queryParams}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'An error occurred while fetching filtered cards'
      );
    }
  }
);

export const fetchHotCards = createAsyncThunk(
  'cards/fetchHot',
  async (params: Omit<CardFilterParams, 'isHot'> = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(item => queryParams.append(key, String(item)));
          } else if (value instanceof Date) {
            queryParams.append(key, value.toISOString());
          } else {
            queryParams.append(key, String(value));
          }
        }
      });

      const response = await api.get<CardResponse>(`${API_ENDPOINTS.cards.hot}?${queryParams}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'An error occurred while fetching hot cards'
      );
    }
  }
);

export const fetchDiscoverCards = createAsyncThunk(
  'cards/fetchDiscover',
  async (params: Omit<CardFilterParams, 'isDiscover'> = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(item => queryParams.append(key, String(item)));
          } else if (value instanceof Date) {
            queryParams.append(key, value.toISOString());
          } else {
            queryParams.append(key, String(value));
          }
        }
      });

      const response = await api.get<CardResponse>(`${API_ENDPOINTS.cards.discover}?${queryParams}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'An error occurred while fetching discover cards'
      );
    }
  }
);

export const fetchAvailableCards = createAsyncThunk(
  'cards/fetchAvailable',
  async (params: Omit<CardFilterParams, 'isAvailable'> = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(item => queryParams.append(key, String(item)));
          } else if (value instanceof Date) {
            queryParams.append(key, value.toISOString());
          } else {
            queryParams.append(key, String(value));
          }
        }
      });

      const response = await api.get<CardResponse>(`${API_ENDPOINTS.cards.available}?${queryParams}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'An error occurred while fetching available cards'
      );
    }
  }
);

export const fetchActiveCards = createAsyncThunk(
  'cards/fetchActive',
  async (params: Omit<CardFilterParams, 'isAvailable' | 'expirationAfter'> = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(item => queryParams.append(key, String(item)));
          } else if (value instanceof Date) {
            queryParams.append(key, value.toISOString());
          } else {
            queryParams.append(key, String(value));
          }
        }
      });

      const response = await api.get<CardResponse>(`${API_ENDPOINTS.cards.active}?${queryParams}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'An error occurred while fetching active cards'
      );
    }
  }
);

export const fetchCardsByCategory = createAsyncThunk(
  'cards/fetchByCategory',
  async ({ 
    categoryId, 
    params = {} 
  }: { 
    categoryId: string, 
    params?: Omit<CardFilterParams, 'categoryId'> 
  }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination parameters
      if (params.skip !== undefined) {
        queryParams.append('skip', String(params.skip));
      }
      if (params.take !== undefined) {
        queryParams.append('take', String(params.take));
      }
      
      // Add any other filter parameters
      Object.entries(params).forEach(([key, value]) => {
        if (key !== 'skip' && key !== 'take' && value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(item => queryParams.append(key, String(item)));
          } else if (value instanceof Date) {
            queryParams.append(key, value.toISOString());
          } else {
            queryParams.append(key, String(value));
          }
        }
      });

      const response = await api.get<CardResponse>(
        `${API_ENDPOINTS.cards.byCategory(categoryId)}?${queryParams}`
      );
      return { ...response.data, categoryId };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'An error occurred while fetching cards by category'
      );
    }
  }
);

export const fetchHomeCards = createAsyncThunk(
  'cards/fetchHome',
  async ( _,{ rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.cards.getHomeCards);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'An error occurred while fetching home cards'
      );
    }
  }
);


export const fetchCardsWithRandomizedOrder = createAsyncThunk(
  'cards/fetchRandomized',
  async (params: CardFilterParams = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(item => queryParams.append(key, String(item)));
          } else if (value instanceof Date) {
            queryParams.append(key, value.toISOString());
          } else {
            queryParams.append(key, String(value));
          }
        }
      });

      const response = await api.get<CardResponse>(`${API_ENDPOINTS.cards.randomized}?${queryParams}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'An error occurred while fetching randomized cards'
      );
    }
  }
);

export const fetchCreatorsCards = createAsyncThunk(
  'cards/fetchCreators',
  async (categoryId:string ,{ rejectWithValue }) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.cards.getCreatorsCards}/${categoryId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'An error occurred while fetching creators cards'
      );
    }
  }
)