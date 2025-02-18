import { Toast, ToasterBannerState, ToasterBannerAction, TOASTER_ACTIONS } from './constants';

const initialState: ToasterBannerState = {
  toasts: []
};

const generateId = () => Math.random().toString(36).substring(2, 9);

const toasterReducer = (state: ToasterBannerState, action: ToasterBannerAction): ToasterBannerState => {
  switch (action.type) {
    case TOASTER_ACTIONS.ADD_TOAST: {
      const newToast: Toast = {
        ...action.payload,
        id: action.payload.id || generateId()
      };
      
      return {
        ...state,
        toasts: [newToast, ...state.toasts].slice(0, 3) // Keep maximum 3 toasts
      };
    }

    case TOASTER_ACTIONS.REMOVE_TOAST: {
      return {
        ...state,
        toasts: state.toasts.filter(toast => toast.id !== action.payload.id)
      };
    }

    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

export { initialState, toasterReducer };