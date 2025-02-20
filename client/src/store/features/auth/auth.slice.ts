
import { createSlice } from '@reduxjs/toolkit';
import { loginUser, registerUser, logoutUser, fetchCurrentUser } from './auth.thunk';
import { User } from './auth.types';

// Define the structure of our authentication state
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  operations: {
    login: {
      isLoading: boolean;
      error: string | null;
    };
    register: {
      isLoading: boolean;
      error: string | null;
    };
    logout: {
      isLoading: boolean;
      error: string | null;
    };
    fetch: {
      isLoading: boolean;
      error: string | null;
    };
  };
}

// Set up the initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  operations: {
    login: {
      isLoading: false,
      error: null,
    },
    register: {
      isLoading: false,
      error: null,
    },
    logout: {
      isLoading: false,
      error: null,
    },
    fetch: {
      isLoading: false,
      error: null,
    },
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Regular reducers for direct state updates if needed
    clearErrors: (state) => {
      Object.keys(state.operations).forEach((key) => {
        state.operations[key as keyof typeof state.operations].error = null;
      });
    },
  },
  extraReducers: (builder) => {
    // Handle login states
    builder
      .addCase(loginUser.pending, (state) => {
        state.operations.login.isLoading = true;
        state.operations.login.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.operations.login.isLoading = false;
        state.operations.login.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.operations.login.isLoading = false;
        state.operations.login.error = action.payload as string;
      })

    // Handle register states
      .addCase(registerUser.pending, (state) => {
        state.operations.register.isLoading = true;
        state.operations.register.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.operations.register.isLoading = false;
        state.operations.register.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.operations.register.isLoading = false;
        state.operations.register.error = action.payload as string;
      })

    // Handle logout states
      .addCase(logoutUser.pending, (state) => {
        state.operations.logout.isLoading = true;
        state.operations.logout.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.operations.logout.isLoading = false;
        state.operations.logout.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.operations.logout.isLoading = false;
        state.operations.logout.error = action.payload as string;
      })

    // Handle fetch current user states
      .addCase(fetchCurrentUser.pending, (state) => {
        state.operations.fetch.isLoading = true;
        state.operations.fetch.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
        state.operations.fetch.isLoading = false;
        state.operations.fetch.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.operations.fetch.isLoading = false;
        state.operations.fetch.error = action.payload as string;
      });
  },
});

// Export actions and reducer
export const { clearErrors } = authSlice.actions;
export default authSlice.reducer;