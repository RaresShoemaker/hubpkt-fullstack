interface UIState {
  theme: {
    isDark: boolean;
    isLoading: boolean;
    error: string | null;
  }
}

export type {
  UIState
}