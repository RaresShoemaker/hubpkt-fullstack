import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CategoryDesignsState, DesignElement } from './categoryDesigns.types';
import { 
  createDesignElement, 
  createHtmlElement, 
  deleteDesignElement, 
  deleteHtmlElement, 
  fetchCategoryDesigns, 
  fetchDesignElementsByDevice, 
  reorderDesignElements, 
  updateDesignElement, 
  updateHtmlElement 
} from './categoryDesigns.thunk';
import { DeviceSize } from './categoryDesigns.types';

const initialState: CategoryDesignsState = {
  designs: {
    mobile: [],
    tablet: [],
    desktop: [],
  },
  currentDesign: null,
  loading: false,
  error: null,
};

const categoryDesignsSlice = createSlice({
  name: 'categoryDesigns',
  initialState,
  reducers: {
    setCurrentDesign: (state, action: PayloadAction<DesignElement | null>) => {
      state.currentDesign = action.payload;
    },
    clearCategoryDesigns: (state) => {
      state.designs = initialState.designs;
      state.currentDesign = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch category designs
    builder.addCase(fetchCategoryDesigns.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCategoryDesigns.fulfilled, (state, action) => {
      state.loading = false;
      state.designs = action.payload;
    });
    builder.addCase(fetchCategoryDesigns.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch design elements by device
    builder.addCase(fetchDesignElementsByDevice.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchDesignElementsByDevice.fulfilled, (state, action) => {
      state.loading = false;
      const { device, elements } = action.payload;
      switch (device) {
        case DeviceSize.mobile:
          state.designs.mobile = elements;
          break;
        case DeviceSize.tablet:
          state.designs.tablet = elements;
          break;
        case DeviceSize.desktop:
          state.designs.desktop = elements;
          break;
      }
    });
    builder.addCase(fetchDesignElementsByDevice.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create design element
    builder.addCase(createDesignElement.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createDesignElement.fulfilled, (state, action) => {
      state.loading = false;
      const newElement = action.payload;
      switch (newElement.device) {
        case DeviceSize.mobile:
          state.designs.mobile.push(newElement);
          break;
        case DeviceSize.tablet:
          state.designs.tablet.push(newElement);
          break;
        case DeviceSize.desktop:
          state.designs.desktop.push(newElement);
          break;
      }
    });
    builder.addCase(createDesignElement.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update design element
    builder.addCase(updateDesignElement.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateDesignElement.fulfilled, (state, action) => {
      state.loading = false;
      const updatedElement = action.payload;
      
      // Update in all device arrays in case the device was changed
      ['mobile', 'tablet', 'desktop'].forEach((deviceType) => {
        const deviceKey = deviceType as keyof typeof state.designs;
        const index = state.designs[deviceKey].findIndex(elem => elem.id === updatedElement.id);
        
        if (index !== -1) {
          if (updatedElement.device === deviceType) {
            // Update element in the same device array
            state.designs[deviceKey][index] = updatedElement;
          } else {
            // Remove element from this device array as device has changed
            state.designs[deviceKey].splice(index, 1);
          }
        }
      });
      
      // Add to the correct device array if not already there
      const deviceKey = updatedElement.device as keyof typeof state.designs;
      const exists = state.designs[deviceKey].some(elem => elem.id === updatedElement.id);
      if (!exists) {
        state.designs[deviceKey].push(updatedElement);
      }
      
      // Update currentDesign if it matches the updated element
      if (state.currentDesign && state.currentDesign.id === updatedElement.id) {
        state.currentDesign = updatedElement;
      }
    });
    builder.addCase(updateDesignElement.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete design element
    builder.addCase(deleteDesignElement.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteDesignElement.fulfilled, (state, action) => {
      state.loading = false;
      const deletedId = action.payload;
      
      // Remove from all device arrays
      ['mobile', 'tablet', 'desktop'].forEach((deviceType) => {
        const deviceKey = deviceType as keyof typeof state.designs;
        state.designs[deviceKey] = state.designs[deviceKey].filter(elem => elem.id !== deletedId);
      });
      
      // Clear currentDesign if it was deleted
      if (state.currentDesign && state.currentDesign.id === deletedId) {
        state.currentDesign = null;
      }
    });
    builder.addCase(deleteDesignElement.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Reorder design elements
    builder.addCase(reorderDesignElements.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(reorderDesignElements.fulfilled, (state, action) => {
      state.loading = false;
      const { device, elements } = action.payload;
      switch (device) {
        case DeviceSize.mobile:
          state.designs.mobile = elements;
          break;
        case DeviceSize.tablet:
          state.designs.tablet = elements;
          break;
        case DeviceSize.desktop:
          state.designs.desktop = elements;
          break;
      }
    });
    builder.addCase(reorderDesignElements.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create HTML element
    builder.addCase(createHtmlElement.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createHtmlElement.fulfilled, (state, action) => {
      state.loading = false;
      const newHtmlElement = action.payload;
      
      // Add HTML element to the correct design element
      ['mobile', 'tablet', 'desktop'].forEach((deviceType) => {
        const deviceKey = deviceType as keyof typeof state.designs;
        const designIndex = state.designs[deviceKey].findIndex(
          elem => elem.id === newHtmlElement.designElementId
        );
        
        if (designIndex !== -1) {
          state.designs[deviceKey][designIndex].htmlElements.push(newHtmlElement);
          
          // Update currentDesign if necessary
          if (
            state.currentDesign && 
            state.currentDesign.id === newHtmlElement.designElementId
          ) {
            state.currentDesign.htmlElements.push(newHtmlElement);
          }
        }
      });
    });
    builder.addCase(createHtmlElement.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update HTML element
    builder.addCase(updateHtmlElement.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateHtmlElement.fulfilled, (state, action) => {
      state.loading = false;
      const updatedHtmlElement = action.payload;
      
      // Update HTML element in all relevant design elements
      ['mobile', 'tablet', 'desktop'].forEach((deviceType) => {
        const deviceKey = deviceType as keyof typeof state.designs;
        
        state.designs[deviceKey].forEach((designElement) => {
          const htmlIndex = designElement.htmlElements.findIndex(
            html => html.id === updatedHtmlElement.id
          );
          
          if (htmlIndex !== -1) {
            designElement.htmlElements[htmlIndex] = updatedHtmlElement;
            
            // Update currentDesign if necessary
            if (
              state.currentDesign && 
              state.currentDesign.id === designElement.id
            ) {
              const currentHtmlIndex = state.currentDesign.htmlElements.findIndex(
                html => html.id === updatedHtmlElement.id
              );
              
              if (currentHtmlIndex !== -1) {
                state.currentDesign.htmlElements[currentHtmlIndex] = updatedHtmlElement;
              }
            }
          }
        });
      });
    });
    builder.addCase(updateHtmlElement.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete HTML element
    builder.addCase(deleteHtmlElement.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteHtmlElement.fulfilled, (state, action) => {
      state.loading = false;
      const deletedId = action.payload;
      
      // Remove HTML element from all design elements
      ['mobile', 'tablet', 'desktop'].forEach((deviceType) => {
        const deviceKey = deviceType as keyof typeof state.designs;
        
        state.designs[deviceKey].forEach((designElement) => {
          designElement.htmlElements = designElement.htmlElements.filter(
            html => html.id !== deletedId
          );
        });
      });
      
      // Update currentDesign if necessary
      if (state.currentDesign) {
        state.currentDesign.htmlElements = state.currentDesign.htmlElements.filter(
          html => html.id !== deletedId
        );
      }
    });
    builder.addCase(deleteHtmlElement.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { setCurrentDesign, clearCategoryDesigns } = categoryDesignsSlice.actions;
export default categoryDesignsSlice.reducer;