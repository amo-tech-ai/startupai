
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Deck } from '../types';
import { PitchDeckGallery } from './pitch-deck/PitchDeckGallery';
import { NewDeckModal } from './pitch-deck/NewDeckModal';
import { DeckEditor } from './pitch-deck/DeckEditor';
import { AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';

const PitchDecks: React.FC = () => {
  const { decks } = useData();
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Derive view state from URL parameter
  const selectedDeck = deckId ? decks.find(d => d.id === deckId) : null;

  const handleOpenDeck = (deck: Deck) => {
    navigate(`/pitch-decks/${deck.id}`);
  };

  const handleBack = () => {
    navigate('/pitch-decks');
  };

  const handleDeckCreated = (newId: string) => {
    setIsModalOpen(false);
    navigate(`/pitch-decks/${newId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 relative">
      {deckId && selectedDeck ? (
        <DeckEditor 
          deck={selectedDeck} 
          onBack={handleBack} 
        />
      ) : (
        <PitchDeckGallery 
          decks={decks}
          onCreateNew={() => setIsModalOpen(true)}
          onOpenDeck={handleOpenDeck}
        />
      )}

      <AnimatePresence>
        {isModalOpen && (
          <NewDeckModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)}
            onSuccess={handleDeckCreated}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PitchDecks;
