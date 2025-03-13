import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./features/ui/ui.slice";
import authReducer from "./features/auth/auth.slice";
import categoriesReducer from "./features/categories/categories.slice";
import cardsReducer from "./features/cards/cards.slice";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    categories: categoriesReducer,
    cards: cardsReducer,
  },
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;