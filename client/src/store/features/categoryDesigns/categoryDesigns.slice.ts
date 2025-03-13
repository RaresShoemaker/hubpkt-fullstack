// src/store/features/categoryDesigns/categoryDesigns.slice.ts

import { createSlice } from '@reduxjs/toolkit';
import { InitialState } from './categoryDesigns.types';
import {
  createCategoryDesign,
  updateCategoryDesign,
  deleteCategoryDesign,
  fetchCategoryDesign,
  fetchCategoryDesignByCategory,
  createDesignElement,
  updateDesignElement,
  deleteDesignElement,
  createHtmlElement,
  updateHtmlElement,
  deleteHtmlElement,
  reorderDesignElements
} from './categoryDesigns.thunk'

const initialState: InitialState = {
  designs: [],
  currentDesign: null,
  operations: {
    createDesign: {
      isLoading: false,
      error: null,
    },
    updateDesign: {
      isLoading: false,
      error: null,
    },
    deleteDesign: {
      isLoading: false,
      error: null,
    },
    fetchDesign: {
      isLoading: false,
      error: null,
    },
    fetchDesignByCategory: {
      isLoading: false,
      error: null,
    },
    createElement: {
      isLoading: false,
      error: null,
    },
    updateElement: {
      isLoading: false,
      error: null,
    },
    deleteElement: {
      isLoading: false,
      error: null,
    },
    createHtmlElement: {
      isLoading: false,
      error: null,
    },
    updateHtmlElement: {
      isLoading: false,
      error: null,
    },
    deleteHtmlElement: {
      isLoading: false,
      error: null,
    },
    reorderElements: {
      isLoading: false,
      error: null,
    }
  },
};

const categoryDesignsSlice = createSlice({
  name: 'categoryDesigns',
  initialState,
  reducers: {
    clearErrors: (state) => {
      Object.keys(state.operations).forEach((key) => {
        state.operations[key as keyof typeof state.operations].error = null;
      });
    },
    selectDesign: (state, action) => {
      state.currentDesign = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Create Category Design
    builder
      .addCase(createCategoryDesign.pending, (state) => {
        state.operations.createDesign.isLoading = true;
        state.operations.createDesign.error = null;
      })
      .addCase(createCategoryDesign.rejected, (state, action) => {
        state.operations.createDesign.isLoading = false;
        state.operations.createDesign.error = action.payload as string;
      })
      .addCase(createCategoryDesign.fulfilled, (state, action) => {
        state.operations.createDesign.isLoading = false;
        state.currentDesign = action.payload;
        state.designs.push(action.payload);
      })

    // Update Category Design
      .addCase(updateCategoryDesign.pending, (state) => {
        state.operations.updateDesign.isLoading = true;
        state.operations.updateDesign.error = null;
      })
      .addCase(updateCategoryDesign.rejected, (state, action) => {
        state.operations.updateDesign.isLoading = false;
        state.operations.updateDesign.error = action.payload as string;
      })
      .addCase(updateCategoryDesign.fulfilled, (state, action) => {
        state.operations.updateDesign.isLoading = false;
        state.currentDesign = action.payload;
        state.designs = state.designs.map(design => 
          design.id === action.payload.id ? action.payload : design
        );
      })

    // Delete Category Design
      .addCase(deleteCategoryDesign.pending, (state) => {
        state.operations.deleteDesign.isLoading = true;
        state.operations.deleteDesign.error = null;
      })
      .addCase(deleteCategoryDesign.rejected, (state, action) => {
        state.operations.deleteDesign.isLoading = false;
        state.operations.deleteDesign.error = action.payload as string;
      })
      .addCase(deleteCategoryDesign.fulfilled, (state, action) => {
        state.operations.deleteDesign.isLoading = false;
        state.designs = state.designs.filter(design => design.id !== action.meta.arg);
        if (state.currentDesign?.id === action.meta.arg) {
          state.currentDesign = null;
        }
      })

    // Fetch Category Design
      .addCase(fetchCategoryDesign.pending, (state) => {
        state.operations.fetchDesign.isLoading = true;
        state.operations.fetchDesign.error = null;
      })
      .addCase(fetchCategoryDesign.rejected, (state, action) => {
        state.operations.fetchDesign.isLoading = false;
        state.operations.fetchDesign.error = action.payload as string;
      })
      .addCase(fetchCategoryDesign.fulfilled, (state, action) => {
        state.operations.fetchDesign.isLoading = false;
        state.currentDesign = action.payload;
        
        // Add to designs array if it doesn't exist
        const existingIndex = state.designs.findIndex(design => design.id === action.payload.id);
        if (existingIndex === -1) {
          state.designs.push(action.payload);
        } else {
          state.designs[existingIndex] = action.payload;
        }
      })

    // Fetch Category Design By Category
      .addCase(fetchCategoryDesignByCategory.pending, (state) => {
        state.operations.fetchDesignByCategory.isLoading = true;
        state.operations.fetchDesignByCategory.error = null;
      })
      .addCase(fetchCategoryDesignByCategory.rejected, (state, action) => {
        state.operations.fetchDesignByCategory.isLoading = false;
        state.operations.fetchDesignByCategory.error = action.payload as string;
      })
      .addCase(fetchCategoryDesignByCategory.fulfilled, (state, action) => {
        state.operations.fetchDesignByCategory.isLoading = false;
        
        if (action.payload) {
          state.currentDesign = action.payload;
          
          // Add to designs array if it doesn't exist
          const existingIndex = state.designs.findIndex(design => design.id === action.payload?.id);
          if (existingIndex === -1) {
            state.designs.push(action.payload);
          } else {
            state.designs[existingIndex] = action.payload;
          }
        } else {
          state.currentDesign = null;
        }
      })

    // Create Design Element
      .addCase(createDesignElement.pending, (state) => {
        state.operations.createElement.isLoading = true;
        state.operations.createElement.error = null;
      })
      .addCase(createDesignElement.rejected, (state, action) => {
        state.operations.createElement.isLoading = false;
        state.operations.createElement.error = action.payload as string;
      })
      .addCase(createDesignElement.fulfilled, (state, action) => {
        state.operations.createElement.isLoading = false;
        
        if (state.currentDesign) {
          state.currentDesign.designElements.push(action.payload);
          
          // Update the design in the designs array
          const designIndex = state.designs.findIndex(design => design.id === state.currentDesign?.id);
          if (designIndex !== -1) {
            state.designs[designIndex] = { ...state.currentDesign };
          }
        }
      })

    // Update Design Element
      .addCase(updateDesignElement.pending, (state) => {
        state.operations.updateElement.isLoading = true;
        state.operations.updateElement.error = null;
      })
      .addCase(updateDesignElement.rejected, (state, action) => {
        state.operations.updateElement.isLoading = false;
        state.operations.updateElement.error = action.payload as string;
      })
      .addCase(updateDesignElement.fulfilled, (state, action) => {
        state.operations.updateElement.isLoading = false;
        
        if (state.currentDesign) {
          // Update the element in the current design
          state.currentDesign.designElements = state.currentDesign.designElements.map(
            element => element.id === action.payload.id ? action.payload : element
          );
          
          // Update the design in the designs array
          const designIndex = state.designs.findIndex(design => design.id === state.currentDesign?.id);
          if (designIndex !== -1) {
            state.designs[designIndex] = { ...state.currentDesign };
          }
        }
      })

    // Delete Design Element
      .addCase(deleteDesignElement.pending, (state) => {
        state.operations.deleteElement.isLoading = true;
        state.operations.deleteElement.error = null;
      })
      .addCase(deleteDesignElement.rejected, (state, action) => {
        state.operations.deleteElement.isLoading = false;
        state.operations.deleteElement.error = action.payload as string;
      })
      .addCase(deleteDesignElement.fulfilled, (state, action) => {
        state.operations.deleteElement.isLoading = false;
        
        if (state.currentDesign) {
          // Remove the element from the current design
          state.currentDesign.designElements = state.currentDesign.designElements.filter(
            element => element.id !== action.meta.arg
          );
          
          // Update the design in the designs array
          const designIndex = state.designs.findIndex(design => design.id === state.currentDesign?.id);
          if (designIndex !== -1) {
            state.designs[designIndex] = { ...state.currentDesign };
          }
        }
      })

    // HTML Element operations (simplified for brevity)
      .addCase(createHtmlElement.pending, (state) => {
        state.operations.createHtmlElement.isLoading = true;
        state.operations.createHtmlElement.error = null;
      })
      .addCase(createHtmlElement.fulfilled, (state, action) => {
        state.operations.createHtmlElement.isLoading = false;
        // Handle updating the HTML elements in the appropriate design element
      })
      .addCase(createHtmlElement.rejected, (state, action) => {
        state.operations.createHtmlElement.isLoading = false;
        state.operations.createHtmlElement.error = action.payload as string;
      })

      .addCase(updateHtmlElement.pending, (state) => {
        state.operations.updateHtmlElement.isLoading = true;
        state.operations.updateHtmlElement.error = null;
      })
      .addCase(updateHtmlElement.fulfilled, (state, action) => {
        state.operations.updateHtmlElement.isLoading = false;
        // Handle updating the HTML elements in the appropriate design element
      })
      .addCase(updateHtmlElement.rejected, (state, action) => {
        state.operations.updateHtmlElement.isLoading = false;
        state.operations.updateHtmlElement.error = action.payload as string;
      })

      .addCase(deleteHtmlElement.pending, (state) => {
        state.operations.deleteHtmlElement.isLoading = true;
        state.operations.deleteHtmlElement.error = null;
      })
      .addCase(deleteHtmlElement.fulfilled, (state) => {
        state.operations.deleteHtmlElement.isLoading = false;
        // Handle removing the HTML element from the appropriate design element
      })
      .addCase(deleteHtmlElement.rejected, (state, action) => {
        state.operations.deleteHtmlElement.isLoading = false;
        state.operations.deleteHtmlElement.error = action.payload as string;
      })

    // Reorder Design Elements
      .addCase(reorderDesignElements.pending, (state) => {
        state.operations.reorderElements.isLoading = true;
        state.operations.reorderElements.error = null;
      })
      .addCase(reorderDesignElements.rejected, (state, action) => {
        state.operations.reorderElements.isLoading = false;
        state.operations.reorderElements.error = action.payload as string;
      })
      .addCase(reorderDesignElements.fulfilled, (state, action) => {
        state.operations.reorderElements.isLoading = false;
        
        if (state.currentDesign) {
          // Replace the elements array with the reordered elements
          state.currentDesign.designElements = action.payload;
          
          // Update the design in the designs array
          const designIndex = state.designs.findIndex(design => design.id === state.currentDesign?.id);
          if (designIndex !== -1) {
            state.designs[designIndex] = { ...state.currentDesign };
          }
        }
      });
  },
});

export const { clearErrors, selectDesign } = categoryDesignsSlice.actions;
export default categoryDesignsSlice.reducer;