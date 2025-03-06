import React, { useState } from 'react';
import { useTheme } from '../../../store/features/ui/useUITheme';
import { useCards } from '../../../store/features/cards/useCards';
import CardComponent from './Card';
import ModalPortal from '../Modal';
import CardForm from '../forms/CardForm/CardForm';
import { Card } from '../../../store/features/cards/cards.types';

interface CardListProps {
  cards: Card[];
  isLoading: boolean;
}

const CardList: React.FC<CardListProps> = ({ cards, isLoading }) => {
  const { isDark } = useTheme();
  const { handleSelectCard } = useCards();
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateCard = () => {
    // Clear any currently selected card
    handleSelectCard(null);
    setIsModalOpen(true);
  };

  const handleEditCard = (id: string) => {
    // Find the card to edit
    const cardToEdit = cards.find(card => card.id === id);
    if (cardToEdit) {
      // Set it as the current card in the global state
      handleSelectCard(cardToEdit);
      setIsModalOpen(true);
    }
  };

  const handleCardClick = (id: string) => {
    // You can implement additional card click logic here if needed
    console.log(`Card ${id} clicked`);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Clear selected card after modal is closed (with a delay to prevent flicker)
    setTimeout(() => {
      handleSelectCard(null);
    }, 300);
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-semibold ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
          Cards
        </h2>
      </div>

      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className={`animate-spin rounded-full h-12 w-12 border-t-2 ${
            isDark ? 'border-dark-text-accent' : 'border-light-text-accent'
          }`}></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Create New Card */}
          <CardComponent 
            createNew 
            onClick={handleCreateCard} 
          />

          {/* Display cards */}
          {cards.map(card => (
            <CardComponent 
              key={card.id}
              card={card}
              onClick={() => handleCardClick(card.id)}
              onEdit={() => handleEditCard(card.id)}
            />
          ))}

          {/* Show message if no cards yet */}
          {cards.length === 0 && (
            <div className={`col-span-full text-center py-12 ${
              isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'
            }`}>
              <p className="text-lg">No cards found in this category</p>
              <p className="mt-2">Click the "New Card" button to create your first card</p>
            </div>
          )}
        </div>
      )}

      {/* Modal for Card creation/editing */}
      <ModalPortal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={useCards().currentCard ? 'Edit Card' : 'Create New Card'}
        maxWidth="lg"
      >
        <CardForm onClose={closeModal} />
      </ModalPortal>
    </div>
  );
};

export default CardList;