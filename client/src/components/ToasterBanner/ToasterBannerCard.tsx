import React from 'react';
import { useToasterState, useToasterDispatch } from '../../context/ToasterBannerContext/hooks';
import { TOASTER_ACTIONS, Toast } from '../../context/ToasterBannerContext/constants';
import ToastContent from './ToasterBannerContent';

const ToasterBanner: React.FC = () => {
	const state = useToasterState();
	const dispatch = useToasterDispatch();

	const handleDismiss = (toast: Toast) => {
		dispatch({
			type: TOASTER_ACTIONS.REMOVE_TOAST,
			payload: toast
		});
	};

	if (!state.toasts.length) {
		return null;
	}

	return (
		<div className='fixed inset-x-0 top-4 mx-auto max-w-md px-4 z-50'>
			{state.toasts.map((toast) => (
				<ToastContent
					key={toast.id}
					message={toast.message}
					type={toast.type}
					duration={toast.duration}
					onDismiss={() => handleDismiss(toast)}
				/>
			))}
		</div>
	);
};

export default ToasterBanner;
