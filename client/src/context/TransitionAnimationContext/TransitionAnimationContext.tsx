import { createContext, useContext } from 'react';
import { TransitionState, TransitionAction } from './TransitionAnimationReducer';

interface TransitionContextValue extends TransitionState {
    nextIndex: number;
    dispatch: React.Dispatch<TransitionAction>;
}

export const TransitionAnimationContext = createContext<TransitionContextValue | undefined>(undefined);

export const useTransitionAnimation = () => {
    const context = useContext(TransitionAnimationContext);
    if (context === undefined) {
        throw new Error('useTransitionAnimation must be used within a TransitionAnimationProvider');
    }
    return context;
};