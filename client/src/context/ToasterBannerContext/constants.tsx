const TOASTER_ACTIONS = {
	ADD_TOAST: 'ADD_TOAST',
	REMOVE_TOAST: 'REMOVE_TOAST'
} as const;

enum TOASTER_TYPES {
	SUCCESS = 'success',
	ERROR = 'error',
	WARNING = 'warning',
	INFO = 'info'
}

interface Toast {
	id: string;
	message: string;
	type: TOASTER_TYPES;
	duration?: number;
}

interface ToasterBannerPayload extends Omit<Toast, 'id'> {
	id?: string;
}

interface ToasterBannerAction {
	type: keyof typeof TOASTER_ACTIONS;
	payload: ToasterBannerPayload;
}

interface ToasterBannerState {
	toasts: Toast[];
}

export { TOASTER_ACTIONS, TOASTER_TYPES };
export type { Toast, ToasterBannerPayload, ToasterBannerAction, ToasterBannerState };
