import React, { useReducer } from 'react';
import { ToasterBannerContext, ToasterBannerDispatchContext } from './ToasterBannerContext';
import { toasterReducer, initialState } from './ToasterBannerReducer';
import { ToasterBannerState, ToasterBannerAction } from './constants';

interface ToasterBannerProviderProps {
	children: React.ReactNode;
}

const ToasterBannerProvider: React.FC<ToasterBannerProviderProps> = ({ children }) => {
	const [state, dispatch] = useReducer<React.Reducer<ToasterBannerState, ToasterBannerAction>>(
		toasterReducer,
		initialState
	);

	return (
		<ToasterBannerContext.Provider value={state}>
			<ToasterBannerDispatchContext.Provider value={dispatch}>
				{children}
			</ToasterBannerDispatchContext.Provider>
		</ToasterBannerContext.Provider>
	);
};

export default ToasterBannerProvider;
