import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category, CategoryState } from './categories.types';
import {
	createCategory,
	deleteCategory,
	fetchCategories,
	fetchCategory,
	reorderCategories,
	updateCategory
} from './categories.thunk';

const initialState: CategoryState = {
	items: [],
	total: 0,
	currentCategory: null,
	operations: {
		create: {
			isLoading: false,
			error: null
		},
		update: {
			isLoading: false,
			error: null
		},
		delete: {
			isLoading: false,
			error: null
		},
		fetch: {
			isLoading: false,
			error: null
		},
		list: {
			isLoading: false,
			error: null
		},
		updateOrder: {
			isLoading: false,
			error: null
		},
		reorder: {
			isLoading: false,
			error: null
		}
	}
};

const categoriesSlice = createSlice({
	name: 'categories',
	initialState,
	reducers: {
		clearErrors: (state) => {
			Object.keys(state.operations).forEach((key) => {
				state.operations[key as keyof typeof state.operations].error = null;
			});
		},
		selectCategory: (state, action: PayloadAction<Category | null>) => {
			state.currentCategory = action.payload;
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(createCategory.pending, (state) => {
				state.operations.create.isLoading = true;
				state.operations.create.error = null;
			})
			.addCase(createCategory.rejected, (state, action) => {
				state.operations.create.isLoading = false;
				state.operations.create.error = action.payload as string;
			})
			.addCase(createCategory.fulfilled, (state, action) => {
				state.operations.create.isLoading = false;
				state.items.push(action.payload);
				state.total += 1;
			})
			.addCase(fetchCategories.pending, (state) => {
				state.operations.list.isLoading = true;
				state.operations.list.error = null;
			})
			.addCase(fetchCategories.fulfilled, (state, action) => {
				state.operations.list.isLoading = false;
				state.items = action.payload;
				state.total = action.payload.length;
			})
			.addCase(fetchCategories.rejected, (state, action) => {
				state.operations.list.isLoading = false;
				state.operations.list.error = action.payload as string;
			})
			.addCase(fetchCategory.pending, (state) => {
				state.operations.fetch.isLoading = true;
				state.operations.fetch.error = null;
			})
			.addCase(fetchCategory.fulfilled, (state, action) => {
				state.operations.fetch.isLoading = false;
				state.currentCategory = action.payload;
			})
			.addCase(fetchCategory.rejected, (state, action) => {
				state.operations.fetch.isLoading = false;
				state.operations.fetch.error = action.payload as string;
			})
			.addCase(updateCategory.pending, (state) => {
				state.operations.update.isLoading = true;
				state.operations.update.error = null;
			})
			.addCase(updateCategory.fulfilled, (state, action) => {
				state.operations.update.isLoading = false;
				state.items = state.items.map((category) =>
					category.id === action.payload.id ? action.payload : category
				);
				state.currentCategory = action.payload;
			})
			.addCase(updateCategory.rejected, (state, action) => {
				state.operations.update.isLoading = false;
				state.operations.update.error = action.payload as string;
			})
			.addCase(deleteCategory.pending, (state) => {
				state.operations.delete.isLoading = true;
				state.operations.delete.error = null;
			})
			.addCase(deleteCategory.fulfilled, (state, action) => {
				state.operations.delete.isLoading = false;
				state.items = state.items.filter((category) => category.id !== action.meta.arg);
				state.total -= 1;
				if (state.currentCategory?.id === action.meta.arg) {
					state.currentCategory = null;
				}
			})
			.addCase(deleteCategory.rejected, (state, action) => {
				state.operations.delete.isLoading = false;
				state.operations.delete.error = action.payload as string;
			})
			.addCase(reorderCategories.pending, (state) => {
				state.operations.reorder.isLoading = true;
				state.operations.reorder.error = null;
			})
			.addCase(reorderCategories.fulfilled, (state, action) => {
				state.operations.reorder.isLoading = false;
				state.items = action.payload;
			})
			.addCase(reorderCategories.rejected, (state, action) => {
				state.operations.reorder.isLoading = false;
				state.operations.reorder.error = action.payload as string;
			});
	}
});

export const { clearErrors, selectCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;
