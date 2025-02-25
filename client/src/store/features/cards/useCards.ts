/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  createCard,
  updateCard,
  deleteCard,
  fetchCards,
  fetchHomeCards,
  fetchCardsByCategory,
  fetchAvailableCards,
  updateCardOrder,
  fetchFilteredCards,
  fetchHotCards,
  fetchDiscoverCards,
  fetchActiveCards,
  fetchCardsWithRandomizedOrder,
  reorderCards,
  fetchCard
} from './cards.thunk';
import { selectCard, clearErrors } from './cards.slice';
import { 
  Card, 
  CardFilterParams, 
  CreateCardRequest, 
  UpdateCardRequest, 
  ReorderCardsPayload 
} from './cards.types';

export const useCards = () => {
  const dispatch = useAppDispatch();
  const { cards, total, currentCard, operations } = useAppSelector((state) => state.cards);

  // Action creators
  const handleCreateCard = useCallback(
    (cardData: CreateCardRequest) => dispatch(createCard(cardData)),
    [dispatch]
  );

  const handleUpdateCard = useCallback(
    (cardData: UpdateCardRequest) => dispatch(updateCard(cardData)),
    [dispatch]
  );

  const handleDeleteCard = useCallback(
    (id: string) => dispatch(deleteCard(id)),
    [dispatch]
  );

  const handleFetchCard = useCallback(
    (id: string) => dispatch(fetchCard(id)),
    [dispatch]
  );

  const handleFetchCards = useCallback(
    (params?: CardFilterParams) => dispatch(fetchCards(params || {})),
    [dispatch]
  );

  const handleFetchFilteredCards = useCallback(
    (params?: CardFilterParams) => dispatch(fetchFilteredCards(params || {})),
    [dispatch]
  );

  const handleFetchHomeCards = useCallback(
    () => dispatch(fetchHomeCards()),
    [dispatch]
  );

  const handleFetchCardsByCategory = useCallback(
    (categoryId: string, params?: Omit<CardFilterParams, 'categoryId'>) => 
      dispatch(fetchCardsByCategory({ categoryId, params })),
    [dispatch]
  );

  const handleFetchAvailableCards = useCallback(
    (params?: Omit<CardFilterParams, 'isAvailable'>) => 
      dispatch(fetchAvailableCards(params || {})),
    [dispatch]
  );

  const handleFetchHotCards = useCallback(
    (params?: Omit<CardFilterParams, 'isHot'>) => 
      dispatch(fetchHotCards(params || {})),
    [dispatch]
  );

  const handleFetchDiscoverCards = useCallback(
    (params?: Omit<CardFilterParams, 'isDiscover'>) => 
      dispatch(fetchDiscoverCards(params || {})),
    [dispatch]
  );

  const handleFetchActiveCards = useCallback(
    (params?: Omit<CardFilterParams, 'isAvailable' | 'expirationAfter'>) => 
      dispatch(fetchActiveCards(params || {})),
    [dispatch]
  );

  const handleFetchRandomizedCards = useCallback(
    (params?: CardFilterParams) => 
      dispatch(fetchCardsWithRandomizedOrder(params || {})),
    [dispatch]
  );

  const handleUpdateCardOrder = useCallback(
    (cardId: string, newOrder: number, categoryId: string) => 
      dispatch(updateCardOrder({ cardId, newOrder, categoryId })),
    [dispatch]
  );

  const handleReorderCards = useCallback(
    (payload: ReorderCardsPayload) => dispatch(reorderCards(payload)),
    [dispatch]
  );

  const handleSelectCard = useCallback(
    (card: Card | null) => dispatch(selectCard(card)),
    [dispatch]
  );

  const handleClearErrors = useCallback(
    () => dispatch(clearErrors()),
    [dispatch]
  );

  // Return all the necessary state and methods
  return {
    // State
    cards,
    total,
    currentCard,
    operations,

    loading: {
      createCard: operations.create.isLoading,
      updateCard: operations.update.isLoading,
      deleteCard: operations.delete.isLoading,
      fetchCards: operations.fetchCards.isLoading,
      fetchFilteredCards: operations.fetchFilteredCards.isLoading,
      fetchHomeCards: operations.fetchHomeCards.isLoading,
      fetchCardsByCategory: operations.fetchCardsByCategory.isLoading,
      fetchAvailableCards: operations.fetchAvailableCards.isLoading,
    },

    error: {
      createCard: operations.create.error,
      updateCard: operations.update.error,
      deleteCard: operations.delete.error,
      fetchCards: operations.fetchCards.error,
      fetchFilteredCards: operations.fetchFilteredCards.error,
      fetchHomeCards: operations.fetchHomeCards.error,
      fetchCardsByCategory: operations.fetchCardsByCategory.error,
      fetchAvailableCards: operations.fetchAvailableCards.error
    },
    
    // Actions
    handleCreateCard,
    handleUpdateCard,
    handleDeleteCard,
    handleFetchCard,
    handleFetchCards,
    handleFetchFilteredCards,
    handleFetchHomeCards,
    handleFetchCardsByCategory,
    handleFetchAvailableCards,
    handleFetchHotCards,
    handleFetchDiscoverCards,
    handleFetchActiveCards,
    handleFetchRandomizedCards,
    handleUpdateCardOrder,
    handleReorderCards,
    handleSelectCard,
    handleClearErrors
  };
};