import { createSlice } from '@reduxjs/toolkit';
import { CategoryDesignsState } from './categoryDesigns.types';
import {
  createCategoryDesign,
  updateCategoryDesign,
  deleteCategoryDesign,
  fetchCategoryDesign,
  fetchCategoryDesignByCategoryId,
  createDesignElement,
  updateDesignElement,
  deleteDesignElement,
  reorderDesignElements,
  createHtmlElement,
  updateHtmlElement,
  deleteHtmlElement
} from './categoryDesigns.thunk';

const initialState: CategoryDesignsState = {
  designs: {
    desktop: null,
    tablet: null,
    mobile: null,
  },
  currentDesign: null,
  currentElement: null,
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
    reorderElements: {
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
    selectDesignElement: (state, action) => {
      state.currentElement = action.payload;
    },
    clearCurrentDesign: (state) => {
      state.currentDesign = null;
      state.currentElement = null;
    }
  },
  extraReducers: (builder) => {
    // Create Category Design
    builder
      .addCase(createCategoryDesign.pending, (state) => {
        state.operations.createDesign.isLoading = true;
        state.operations.createDesign.error = null;
      })
      .addCase(createCategoryDesign.fulfilled, (state, action) => {
        state.operations.createDesign.isLoading = false;
        state.currentDesign = action.payload;
      })
      .addCase(createCategoryDesign.rejected, (state, action) => {
        state.operations.createDesign.isLoading = false;
        state.operations.createDesign.error = action.payload as string;
      })

    // Update Category Design
      .addCase(updateCategoryDesign.pending, (state) => {
        state.operations.updateDesign.isLoading = true;
        state.operations.updateDesign.error = null;
      })
      .addCase(updateCategoryDesign.fulfilled, (state, action) => {
        state.operations.updateDesign.isLoading = false;
        state.currentDesign = action.payload;
      })
      .addCase(updateCategoryDesign.rejected, (state, action) => {
        state.operations.updateDesign.isLoading = false;
        state.operations.updateDesign.error = action.payload as string;
      })

    // Delete Category Design
      .addCase(deleteCategoryDesign.pending, (state) => {
        state.operations.deleteDesign.isLoading = true;
        state.operations.deleteDesign.error = null;
      })
      .addCase(deleteCategoryDesign.fulfilled, (state) => {
        state.operations.deleteDesign.isLoading = false;
        state.currentDesign = null;
        state.currentElement = null;
      })
      .addCase(deleteCategoryDesign.rejected, (state, action) => {
        state.operations.deleteDesign.isLoading = false;
        state.operations.deleteDesign.error = action.payload as string;
      })

    // Fetch Category Design
      .addCase(fetchCategoryDesign.pending, (state) => {
        state.operations.fetchDesign.isLoading = true;
        state.operations.fetchDesign.error = null;
      })
      .addCase(fetchCategoryDesign.fulfilled, (state, action) => {
        state.operations.fetchDesign.isLoading = false;
        state.currentDesign = action.payload;
      })
      .addCase(fetchCategoryDesign.rejected, (state, action) => {
        state.operations.fetchDesign.isLoading = false;
        state.operations.fetchDesign.error = action.payload as string;
      })

    // Fetch Category Design by Category ID
      .addCase(fetchCategoryDesignByCategoryId.pending, (state) => {
        state.operations.fetchDesign.isLoading = true;
        state.operations.fetchDesign.error = null;
      })
      .addCase(fetchCategoryDesignByCategoryId.fulfilled, (state, action) => {
        state.operations.fetchDesign.isLoading = false;
        state.designs[action.meta.arg.deviceSize] = action.payload[action.meta.arg.deviceSize];
      })
      .addCase(fetchCategoryDesignByCategoryId.rejected, (state, action) => {
        state.operations.fetchDesign.isLoading = false;
        state.operations.fetchDesign.error = action.payload as string;
      })

    // Create Design Element
      .addCase(createDesignElement.pending, (state) => {
        state.operations.createElement.isLoading = true;
        state.operations.createElement.error = null;
      })
      .addCase(createDesignElement.fulfilled, (state, action) => {
        state.operations.createElement.isLoading = false;
        if (state.currentDesign) {
          state.currentDesign.designElements.push(action.payload);
          // Sort design elements by order
          state.currentDesign.designElements.sort((a, b) => a.order - b.order);
        }
      })
      .addCase(createDesignElement.rejected, (state, action) => {
        state.operations.createElement.isLoading = false;
        state.operations.createElement.error = action.payload as string;
      })

    // Update Design Element
      .addCase(updateDesignElement.pending, (state) => {
        state.operations.updateElement.isLoading = true;
        state.operations.updateElement.error = null;
      })
      .addCase(updateDesignElement.fulfilled, (state, action) => {
        state.operations.updateElement.isLoading = false;
        if (state.currentDesign) {
          state.currentDesign.designElements = state.currentDesign.designElements.map(element => 
            element.id === action.payload.id ? action.payload : element
          );
        }
        if (state.currentElement?.id === action.payload.id) {
          state.currentElement = action.payload;
        }
      })
      .addCase(updateDesignElement.rejected, (state, action) => {
        state.operations.updateElement.isLoading = false;
        state.operations.updateElement.error = action.payload as string;
      })

    // Delete Design Element
      .addCase(deleteDesignElement.pending, (state) => {
        state.operations.deleteElement.isLoading = true;
        state.operations.deleteElement.error = null;
      })
      .addCase(deleteDesignElement.fulfilled, (state, action) => {
        state.operations.deleteElement.isLoading = false;
        if (state.currentDesign) {
          state.currentDesign.designElements = state.currentDesign.designElements.filter(
            element => element.id !== action.meta.arg
          );
        }
        if (state.currentElement?.id === action.meta.arg) {
          state.currentElement = null;
        }
      })
      .addCase(deleteDesignElement.rejected, (state, action) => {
        state.operations.deleteElement.isLoading = false;
        state.operations.deleteElement.error = action.payload as string;
      })

    // Reorder Design Elements
      .addCase(reorderDesignElements.pending, (state) => {
        state.operations.reorderElements.isLoading = true;
        state.operations.reorderElements.error = null;
      })
      .addCase(reorderDesignElements.fulfilled, (state, action) => {
        state.operations.reorderElements.isLoading = false;
        if (state.currentDesign) {
          // Replace elements of the specific device size with the reordered ones
          const deviceSize = action.meta.arg.deviceSize;
          const otherElements = state.currentDesign.designElements.filter(
            element => element.deviceSize !== deviceSize
          );
          state.currentDesign.designElements = [...otherElements, ...action.payload];
          // Sort by order
          state.currentDesign.designElements.sort((a, b) => a.order - b.order);
        }
      })
      .addCase(reorderDesignElements.rejected, (state, action) => {
        state.operations.reorderElements.isLoading = false;
        state.operations.reorderElements.error = action.payload as string;
      })

    // Create HTML Element
      .addCase(createHtmlElement.pending, (state) => {
        state.operations.createHtmlElement.isLoading = true;
        state.operations.createHtmlElement.error = null;
      })
      .addCase(createHtmlElement.fulfilled, (state, action) => {
        state.operations.createHtmlElement.isLoading = false;
        if (state.currentDesign) {
          const elementIndex = state.currentDesign.designElements.findIndex(
            element => element.id === action.payload.designElementId
          );
          if (elementIndex !== -1) {
            state.currentDesign.designElements[elementIndex].htmlElements.push(action.payload);
          }
        }
        if (state.currentElement?.id === action.payload.designElementId) {
          state.currentElement.htmlElements.push(action.payload);
        }
      })
      .addCase(createHtmlElement.rejected, (state, action) => {
        state.operations.createHtmlElement.isLoading = false;
        state.operations.createHtmlElement.error = action.payload as string;
      })

    // Update HTML Element
      .addCase(updateHtmlElement.pending, (state) => {
        state.operations.updateHtmlElement.isLoading = true;
        state.operations.updateHtmlElement.error = null;
      })
      .addCase(updateHtmlElement.fulfilled, (state, action) => {
        state.operations.updateHtmlElement.isLoading = false;
        if (state.currentDesign) {
          state.currentDesign.designElements.forEach(element => {
            element.htmlElements = element.htmlElements.map(html => 
              html.id === action.payload.id ? action.payload : html
            );
          });
        }
        if (state.currentElement) {
          state.currentElement.htmlElements = state.currentElement.htmlElements.map(html => 
            html.id === action.payload.id ? action.payload : html
          );
        }
      })
      .addCase(updateHtmlElement.rejected, (state, action) => {
        state.operations.updateHtmlElement.isLoading = false;
        state.operations.updateHtmlElement.error = action.payload as string;
      })

    // Delete HTML Element
      .addCase(deleteHtmlElement.pending, (state) => {
        state.operations.deleteHtmlElement.isLoading = true;
        state.operations.deleteHtmlElement.error = null;
      })
      .addCase(deleteHtmlElement.fulfilled, (state, action) => {
        state.operations.deleteHtmlElement.isLoading = false;
        if (state.currentDesign) {
          state.currentDesign.designElements.forEach(element => {
            element.htmlElements = element.htmlElements.filter(html => html.id !== action.meta.arg);
          });
        }
        if (state.currentElement) {
          state.currentElement.htmlElements = state.currentElement.htmlElements.filter(
            html => html.id !== action.meta.arg
          );
        }
      })
      .addCase(deleteHtmlElement.rejected, (state, action) => {
        state.operations.deleteHtmlElement.isLoading = false;
        state.operations.deleteHtmlElement.error = action.payload as string;
      });
  },
});

export const { clearErrors, selectDesignElement, clearCurrentDesign } = categoryDesignsSlice.actions;
export default categoryDesignsSlice.reducer;