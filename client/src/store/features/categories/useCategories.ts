import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  fetchCategory,
  reorderCategories,
  fetchClientCategories
} from "./categories.thunk";
import { selectCategory, selectClientCategory } from "./categories.slice";

import { Category, CreateCategoryRequest, UpdateCategoryRequest, CategoryClient } from "./categories.types";

export const useCategories = () => {
  const dispatch = useAppDispatch();
  const { items, total, currentCategory, operations, clientCategory } = useAppSelector(
    (state) => state.categories
  );

  const changeCurrentCategory = useCallback((category: Category | null) => {
    dispatch(selectCategory(category));
  }, [dispatch]);

  const changeClientCategory = useCallback((category: CategoryClient | null) => {
    dispatch(selectClientCategory(category));
  }, [dispatch]);

  const fetchCategoriesList = useCallback(async () => {
    try {
      const responseAction = await dispatch(fetchCategories());
      if(fetchCategories.fulfilled.match(responseAction)) {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to fetch categories", error);
      return false;
    }
  }, [dispatch]);

  const fetchCategoryById = useCallback(async (id: string) => {
    try {
      await dispatch(fetchCategory(id)).unwrap();
    } catch (error) {
      console.error("Failed to fetch category", error);
    }
  }, [dispatch]);

  const createNewCategory = useCallback(async (data: CreateCategoryRequest) => {
    try {
      await dispatch(createCategory(data)).unwrap();
    } catch (error) {
      console.error("Failed to create category", error);
    }
  }, [dispatch]);

  const updateExistingCategory = useCallback(async (data: UpdateCategoryRequest) => {
    try {
      await dispatch(updateCategory(data)).unwrap();
    } catch (error) {
      console.error("Failed to update category", error);
    }
  }, [dispatch]);

  const fetchCategoriesClient = useCallback(async () => {
    try {
      await dispatch(fetchClientCategories()).unwrap();
    } catch (error) {
      console.error("Failed to fetch client categories", error);
    }
  }, [dispatch]);

  const reorderCategoriesList = useCallback(async (data: string[]) => {
    try {
      await dispatch(reorderCategories(data)).unwrap();
    } catch (error) {
      console.error("Failed to reorder categories", error);
    }
  }, [dispatch]); 

  const deleteCategoryById = useCallback(async (id: string) => {
    try {
      await dispatch(deleteCategory(id))
    } catch (error) {
      console.error("Failed to delete category", error);
    }
  }, [dispatch]);


  return {
    items,
    total,
    currentCategory,
    clientCategory,
    operations,

    isLoading: {
      list: operations.list.isLoading,
      create: operations.create.isLoading,
      update: operations.update.isLoading,
      delete: operations.delete.isLoading,
      fetch: operations.fetch.isLoading,
      reorder: operations.reorder.isLoading
    },
    errors: {
      list: operations.list.error,
      create: operations.create.error,
      update: operations.update.error,
      delete: operations.delete.error,
      fetch: operations.fetch.error,
      reorder: operations.reorder.error
    },
    fetchCategoriesList,
    fetchCategoriesClient,
    fetchCategoryById,
    createNewCategory,
    updateExistingCategory,
    reorderCategoriesList,
    deleteCategoryById,
    changeCurrentCategory,
    changeClientCategory
  }
}