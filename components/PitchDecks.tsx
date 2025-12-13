
import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Deck } from '../types';
import { PitchDeckGallery } from './pitch-deck/PitchDeckGallery';
import { NewDeckModal } from './pitch-deck/NewDeckModal';
import { DeckEditor } from './pitch-deck/DeckEditor';
import { AnimatePresence } from 'framer-motion';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const PitchDecks: React.FC = () => {
  const { decks } = useData();
  const { deckId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Auto-open modal if state passed
  useEffect(() => {
      if (location.state && (location.state as any).openNew) {
          setIsModalOpen(true);
          // Clear state so it doesn't reopen on refresh/back
          window.history.replaceState({}, document.title);
      }
  }, [location]);

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

  // If a deckId is present in URL but not found in data (and data is loaded), redirect back
  // Note: We check decks.length to ensure we don't redirect while initial data is loading
  if (deckId && !selectedDeck && decks.length > 0) {
    navigate('/pitch-decks', { replace: true });
    return null;
  }

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
