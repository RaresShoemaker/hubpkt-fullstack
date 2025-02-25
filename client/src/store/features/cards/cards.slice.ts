import { InitialState } from "./cards.types";
import { createSlice } from "@reduxjs/toolkit";
import {
  createCard,
  deleteCard,
  fetchCards,
  fetchHomeCards,
  fetchCardsByCategory,
  fetchAvailableCards,
  updateCard,
  updateCardOrder,
} from './cards.thunk';

const initialState: InitialState = {
  cards: [],
  total: 0,
  currentCard: null,
  operations: {
    create: {
      isLoading: false,
      error: null,
    },
    update: {
      isLoading: false,
      error: null,
    },
    delete: {
      isLoading: false,
      error: null,
    },
    reorder: {
      isLoading: false,
      error: null,
    },
    fetchCards: {
      isLoading: false,
      error: null,
    },
    fetchFilteredCards: {
      isLoading: false,
      error: null,
    },
    fetchHomeCards: {
      isLoading: false,
      error: null,
    },
    fetchCardsByCategory: {
      isLoading: false,
      error: null,
    },
    fetchAvailableCards: {
      isLoading: false,
      error: null,
    },
    updateCardOrder: {
      isLoading: false,
      error: null,
    }
  },
};

const cardsSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {
    clearErrors: (state) => {
			Object.keys(state.operations).forEach((key) => {
				state.operations[key as keyof typeof state.operations].error = null;
			});
		},
    selectCard: (state, action) => {
      state.currentCard = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(createCard.pending, (state) => {
      state.operations.create.isLoading = true;
      state.operations.create.error = null;
    })
    .addCase(createCard.rejected, (state, action) => {
      state.operations.create.isLoading = false;
      state.operations.create.error = action.payload as string;
    })
    .addCase(createCard.fulfilled, (state, action) => {
      state.operations.create.isLoading = false;
      state.cards.push(action.payload);
    })
    .addCase(updateCard.pending, (state) => {
      state.operations.update.isLoading = true;
      state.operations.update.error = null;
    })
    .addCase(updateCard.rejected, (state, action) => {
      state.operations.update.isLoading = false;
      state.operations.update.error = action.payload as string;
    })
    .addCase(updateCard.fulfilled, (state, action) => {
      state.operations.update.isLoading = false;
      state.cards = state.cards.map((card) => {
        if (card.id === action.payload.id) {
          return action.payload;
        }
        return card;
      });
    })
    .addCase(deleteCard.pending, (state) => {
      state.operations.delete.isLoading = true;
      state.operations.delete.error = null;
    })
    .addCase(deleteCard.rejected, (state, action) => {
      state.operations.delete.isLoading = false;
      state.operations.delete.error = action.payload as string;
    })
    .addCase(deleteCard.fulfilled, (state, action) => {
      state.operations.delete.isLoading = false;
      state.cards = state.cards.filter((card) => card.id !== action.payload.id);
    })
    .addCase(fetchCards.pending, (state) => {
      state.operations.fetchCards.isLoading = true;
      state.operations.fetchCards.error = null;
    })
    .addCase(fetchCards.rejected, (state, action) => {
      state.operations.fetchCards.isLoading = false;
      state.operations.fetchCards.error = action.payload as string;
    })
    .addCase(fetchCards.fulfilled, (state, action) => {
      state.operations.fetchCards.isLoading = false;
      state.cards = action.payload.cards;
      state.total = action.payload.total;
    })
    .addCase(fetchHomeCards.pending, (state) => {
      state.operations.fetchHomeCards.isLoading = true;
      state.operations.fetchHomeCards.error = null;
    })
    .addCase(fetchHomeCards.rejected, (state, action) => {
      state.operations.fetchHomeCards.isLoading = false;
      state.operations.fetchHomeCards.error = action.payload as string;
    })
    .addCase(fetchHomeCards.fulfilled, (state, action) => {
      state.operations.fetchHomeCards.isLoading = false;
      state.cards = action.payload.cards;
    })
    .addCase(fetchCardsByCategory.pending, (state) => {
      state.operations.fetchCardsByCategory.isLoading = true;
      state.operations.fetchCardsByCategory.error = null;
    })
    .addCase(fetchCardsByCategory.rejected, (state, action) => {
      state.operations.fetchCardsByCategory.isLoading = false;
      state.operations.fetchCardsByCategory.error = action.payload as string;
    })
    .addCase(fetchCardsByCategory.fulfilled, (state, action) => {
      state.operations.fetchCardsByCategory.isLoading = false;
      state.cards = action.payload.cards;
    })
    .addCase(fetchAvailableCards.pending, (state) => {
      state.operations.fetchAvailableCards.isLoading = true;
      state.operations.fetchAvailableCards.error = null;
    })
    .addCase(fetchAvailableCards.rejected, (state, action) => {
      state.operations.fetchAvailableCards.isLoading = false;
      state.operations.fetchAvailableCards.error = action.payload as string;
    })
    .addCase(fetchAvailableCards.fulfilled, (state, action) => {
      state.operations.fetchAvailableCards.isLoading = false;
      state.cards = action.payload.cards;
    })
    .addCase(updateCardOrder.pending, (state) => {
      state.operations.updateCardOrder.isLoading = true;
      state.operations.updateCardOrder.error = null;
    })
    .addCase(updateCardOrder.rejected, (state, action) => {
      state.operations.updateCardOrder.isLoading = false;
      state.operations.updateCardOrder.error = action.payload as string;
    })
    .addCase(updateCardOrder.fulfilled, (state, action) => {
      const { success, affectedCards } = action.payload;
  
      if (success && affectedCards) {
        // Update all affected cards in the main cards array
        state.cards = state.cards.map(card => {
          const affectedCard = affectedCards.find((ac: { id: string; }) => ac.id === card.id);
          if (affectedCard) {
            return { ...card, order: affectedCard.newOrder };
          }
          return card;
        });
      }
      
      state.operations.updateCardOrder.isLoading = false;
    })
    // to add card reorder logic
  },


});

export const { clearErrors, selectCard } = cardsSlice.actions;
export default cardsSlice.reducer;