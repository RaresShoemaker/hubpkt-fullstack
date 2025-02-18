import { TRANSITION_ACTIONS } from './constants';

export interface TransitionState {
  activeIndex: number;
  isTransitioning: boolean;
  category: string | null;
}

export type TransitionAction =
  | { type: typeof TRANSITION_ACTIONS.SET_ACTIVE_INDEX; payload: number }
  | { type: typeof TRANSITION_ACTIONS.SET_IS_TRANSITIONING; payload: boolean }
  | { type: typeof TRANSITION_ACTIONS.RESET_STATE; payload: { category: string | null } };

export const initialState: TransitionState = {
  activeIndex: 0,
  isTransitioning: false,
  category: null,
};

export const transitionReducer = (state: TransitionState, action: TransitionAction): TransitionState => {
  switch (action.type) {
    case TRANSITION_ACTIONS.SET_ACTIVE_INDEX:
      return {
        ...state,
        activeIndex: action.payload,
      };
    case TRANSITION_ACTIONS.SET_IS_TRANSITIONING:
      return {
        ...state,
        isTransitioning: action.payload,
      };
    case TRANSITION_ACTIONS.RESET_STATE:
      return {
        ...initialState,
        category: action.payload.category,
      };
    default:
      return state;
  }
};