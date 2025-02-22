import { createAsyncThunk } from "@reduxjs/toolkit";
import { UIState } from "./ui.types.ts";

export const initializeTheme = createAsyncThunk(
  'ui/initializeTheme',
  async ( _, { rejectWithValue }) => {
    try {
      const savedTheme = localStorage.getItem('theme');
      
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return systemPrefersDark;
    } catch (error) {
      return rejectWithValue(`Failed to initialize theme: ${error}`);
    }
  }
)

export const toggleTheme = createAsyncThunk(
  'ui/toggleTheme',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { ui: UIState };
      const newTheme = !state.ui.theme.isDark;
      
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
      
      if (newTheme) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      return newTheme;
    } catch (error) {
      return rejectWithValue(`Failed to toggle theme: ${error}`);
    }
  }
);