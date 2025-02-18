import { useContext } from 'react';
import { ToasterBannerContext, ToasterBannerDispatchContext } from './ToasterBannerContext';
import { TOASTER_TYPES, TOASTER_ACTIONS } from './constants';

export const useToasterState = () => {
  const context = useContext(ToasterBannerContext);
  if (context === null) {
    throw new Error('useToasterState must be used within a ToasterBannerProvider');
  }
  return context;
};

export const useToasterDispatch = () => {
  const context = useContext(ToasterBannerDispatchContext);
  if (context === null) {
    throw new Error('useToasterDispatch must be used within a ToasterBannerProvider');
  }
  return context;
};

export const useToast = () => {
  const dispatch = useToasterDispatch();
  
  const showToast = (message: string, type: TOASTER_TYPES, duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    
    dispatch({
      type: TOASTER_ACTIONS.ADD_TOAST,
      payload: { id, message, type, duration }
    });
  };

  return { showToast };
};