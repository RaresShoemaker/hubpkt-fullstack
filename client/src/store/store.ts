import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./features/ui/ui.slice";
import authReducer from "./features/auth/auth.slice";
import categoriesReducer from "./features/categories/categories.slice";


export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    categories: categoriesReducer,
  },
});


export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
