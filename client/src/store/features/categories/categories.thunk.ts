/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
	Category,
	CreateCategoryRequest,
	UpdateCategoryRequest,
	UpdateCategoryOrderPayload
} from './categories.types';
import api from '../../../api/api';
import { API_ENDPOINTS } from '../../../api/endpoints';

export const createCategory = createAsyncThunk(
	'categories/create',
	async (data: CreateCategoryRequest, { rejectWithValue }) => {
		try {
			const response = await api.post<Category>(API_ENDPOINTS.categories.create, data);
			return response.data;
		} catch (error: any) {
			return rejectWithValue(
				error.response?.data?.message || 'An error occurred while creating the category'
			);
		}
	}
);

export const updateCategory = createAsyncThunk(
	'categories/update',
	async (data: UpdateCategoryRequest, { rejectWithValue }) => {
		try {
			const response = await api.put<Category>(API_ENDPOINTS.categories.update(data.id), data);
			return response.data;
		} catch (error: any) {
			return rejectWithValue(
				error.response?.data?.message || 'An error occurred while updating the category'
			);
		}
	}
);

export const deleteCategory = createAsyncThunk(
	'categories/delete',
	async (id: string, { rejectWithValue }) => {
		try {
			const response = await api.delete<boolean>(API_ENDPOINTS.categories.delete(id));
			return response.data;
		} catch (error: any) {
			return rejectWithValue(
				error.response?.data?.message || 'An error occurred while deleting the category'
			);
		}
	}
);

export const fetchCategory = createAsyncThunk(
  'categories/fetch',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get<Category>(API_ENDPOINTS.categories.getOne(id));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'An error occurred while fetching the category'
      );
    }
  });

  export const fetchCategories = createAsyncThunk(
    'categories/fetchAll',
    async (_, { rejectWithValue }) => {
      try {
        const response = await api.get(API_ENDPOINTS.categories.list);
        return response.data.data.categories;
      } catch (error: any) {
        return rejectWithValue(
          error.response?.data?.message || 'An error occurred while fetching the categories'
        );
      }
    }
  )

  export const updateCategoryOrder = createAsyncThunk(
    'categories/updateOrder',
    async (data: UpdateCategoryOrderPayload, { rejectWithValue }) => {
      try {
        const response = await api.put<boolean>(API_ENDPOINTS.categories.updateOrder(data.categoryId), { newOrder: data.newOrder });
        return response.data;
      } catch (error: any) {
        return rejectWithValue(
          error.response?.data?.message || 'An error occurred while updating the category order'
        );
      }
    }
  );

  export const reorderCategories = createAsyncThunk(
    'categories/reorder',
    async (orderedCategoryIds: string[], { rejectWithValue }) => {
      try {
        const response = await api.put<Category[]>(API_ENDPOINTS.categories.reorder, orderedCategoryIds);
        return response.data;
      } catch (error: any) {
        return rejectWithValue(
          error.response?.data?.message || 'An error occurred while reordering the categories'
        );
      }
    }
  )

