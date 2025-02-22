import { createSlice } from '@reduxjs/toolkit';
import { initializeTheme, toggleTheme } from './ui.thunk';
import { UIState } from './ui.types.ts';

const initialState: UIState = {
  theme: {
    isDark: false,
    isLoading: false,
    error: null
  }
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.theme.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeTheme.pending, (state) => {
        state.theme.isLoading = true;
        state.theme.error = null;
      })
      .addCase(initializeTheme.fulfilled, (state, action) => {
        state.theme.isDark = action.payload;
        state.theme.isLoading = false;
      })
      .addCase(initializeTheme.rejected, (state, action) => {
        state.theme.isLoading = false;
        state.theme.error = action.payload as string;
      })
      .addCase(toggleTheme.pending, (state) => {
        state.theme.isLoading = true;
        state.theme.error = null;
      })
      .addCase(toggleTheme.fulfilled, (state, action) => {
        state.theme.isDark = action.payload;
        state.theme.isLoading = false;
      })
      .addCase(toggleTheme.rejected, (state, action) => {
        state.theme.isLoading = false;
        state.theme.error = action.payload as string;
      })
  }
})

export default uiSlice.reducer;