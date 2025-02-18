import { useMemo } from 'react';
import { useTransitionAnimation } from './TransitionAnimationContext';
import { TRANSITION_ACTIONS } from './constants';

export const useTransitionControl = () => {
    const { dispatch } = useTransitionAnimation();

    return useMemo(() => ({
        setActiveIndex: (index: number) => {
            dispatch({ type: TRANSITION_ACTIONS.SET_ACTIVE_INDEX, payload: index });
        },
        setIsTransitioning: (isTransitioning: boolean) => {
            dispatch({ type: TRANSITION_ACTIONS.SET_IS_TRANSITIONING, payload: isTransitioning });
        },
        resetState: (category: string | null) => {
            dispatch({ type: TRANSITION_ACTIONS.RESET_STATE, payload: { category } });
        }
    }), [dispatch]);
};