/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { LoginInput, RegisterInput, User } from './auth.types';
import api from '../../../api/api';
import { API_ENDPOINTS } from '../../../api/endpoints';

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginInput, { rejectWithValue }) => {
    try {
      const response = await api.post<User>(API_ENDPOINTS.auth.login, credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'An error occurred during login'
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: RegisterInput, { rejectWithValue }) => {
    try {
      const response = await api.post<User>(API_ENDPOINTS.auth.register, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'An error occurred during registration'
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await api.post(API_ENDPOINTS.auth.logout);
      return null;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'An error occurred during logout'
      );
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<User>(API_ENDPOINTS.auth.me);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'An error occurred while fetching user'
      );
    }
  }
);