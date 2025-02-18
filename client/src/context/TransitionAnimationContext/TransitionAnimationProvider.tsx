import React, { useReducer, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { TransitionAnimationContext } from './TransitionAnimationContext';
import { transitionReducer, initialState } from './TransitionAnimationReducer';
import { TRANSITION_ACTIONS, TRANSITION_DURATION, INTERVAL_DURATION } from './constants';

interface TransitionProviderProps {
    children: React.ReactNode;
}

export const TransitionAnimationProvider: React.FC<TransitionProviderProps> = ({ children }) => {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const [state, dispatch] = useReducer(transitionReducer, initialState);
    // const category = location.pathname.split('/')[1] === 'creatorhub' ? 'creators' : searchParams.get('category') || '';

    const category = useMemo(() => {
        if(location.pathname.split('/')[1] === 'creatorhub') {
            return 'creators';
        }
        if(searchParams.get('category')) {
            return searchParams.get('category');
        }
        if(location.pathname.split('/')[1] === 'newshub') {
            return 'news';
        }
        return '';
    }, [location.pathname, searchParams])

    const nextIndex = useMemo(() => {
        return category === 'creators' ? (state.activeIndex + 1) % 5 : (state.activeIndex + 1) % 3;
    }, [category, state.activeIndex]);

    const transition = useCallback(() => {
        dispatch({ type: TRANSITION_ACTIONS.SET_IS_TRANSITIONING, payload: true });

        setTimeout(() => {
            dispatch({ type: TRANSITION_ACTIONS.SET_ACTIVE_INDEX, payload: nextIndex });
            dispatch({ type: TRANSITION_ACTIONS.SET_IS_TRANSITIONING, payload: false });
        }, TRANSITION_DURATION);
    }, [nextIndex, dispatch]);

    useEffect(() => {
        const intervalId = setInterval(transition, INTERVAL_DURATION);
        return () => clearInterval(intervalId);
    }, [transition, category]);

    useEffect(() => {
        dispatch({
            type: TRANSITION_ACTIONS.RESET_STATE,
            payload: { category }
        });
    }, [category]);

    const contextValue = useMemo(() => ({
        ...state,
        nextIndex,
        dispatch
    }), [state, nextIndex, dispatch]);

    return (
            <TransitionAnimationContext.Provider value={contextValue}>
                {children}
            </TransitionAnimationContext.Provider>
    );
};