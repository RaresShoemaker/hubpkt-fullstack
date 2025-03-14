import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./features/ui/ui.slice";
import authReducer from "./features/auth/auth.slice";
import categoriesReducer from "./features/categories/categories.slice";
import cardsReducer from "./features/cards/cards.slice";
import categoryDesignReducer from './features/categoryDesigns/categoryDesigns.slice'

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    categories: categoriesReducer,
    cards: cardsReducer,
    categoryDesigns: categoryDesignReducer
  },
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;