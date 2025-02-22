/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  loginUser,
  registerUser,
  logoutUser,
  fetchCurrentUser,
} from './auth.thunk';
import type { LoginInput, RegisterInput } from './auth.types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, operations } = useAppSelector(
    (state) => state.auth
  );

  const login = useCallback(
    async (credentials: LoginInput) => {
      try {
        const resultAction = await dispatch(loginUser(credentials)).unwrap();
        if (resultAction) {
          await dispatch(fetchCurrentUser());
          return true;
        }
        return false;
      } catch (error) {
        return false;
      }
    },
    [dispatch]
  );

  const register = useCallback(
    async (data: RegisterInput) => {
      try {
        const resultAction = await dispatch(registerUser(data)).unwrap();
        if (resultAction) {
          await dispatch(fetchCurrentUser());
          return true;
        }
        return false;
      } catch (error) {
        return false;
      }
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  }, [dispatch]);

  const refreshUser = useCallback(async () => {
    try {
      const result = await dispatch(fetchCurrentUser()).unwrap();
      return !!result;
    } catch (error) {
      return false;
    }
  }, [dispatch]);

  // Auto-refresh user data when needed
  useEffect(() => {
    if (!user && isAuthenticated) {
      refreshUser();
    }
  }, [user, isAuthenticated, refreshUser]);

  return {
    // Current state
    user,
    isAuthenticated,
    operations,

    // Authentication methods
    login,
    register,
    logout,
    refreshUser,

    // Loading states
    isLoading: {
      login: operations.login.isLoading,
      register: operations.register.isLoading,
      logout: operations.logout.isLoading,
      fetch: operations.fetch.isLoading,
    },

    // Error states
    errors: {
      login: operations.login.error,
      register: operations.register.error,
      logout: operations.logout.error,
      fetch: operations.fetch.error,
    },
  };
};