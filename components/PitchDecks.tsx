
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Deck } from '../types';
import { PitchDeckGallery } from './pitch-deck/PitchDeckGallery';
import { NewDeckModal } from './pitch-deck/NewDeckModal';
import { DeckEditor } from './pitch-deck/DeckEditor';
import { AnimatePresence } from 'framer-motion';

const PitchDecks: React.FC = () => {
  const { decks } = useData();
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [viewMode, setViewMode] = useState<'gallery' | 'viewer'>('gallery');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openDeck = (deck: Deck) => {
    setSelectedDeck(deck);
    setViewMode('viewer');
  };

  return (
    <div className="min-h-screen bg-slate-50 relative">
      {viewMode === 'gallery' ? (
        <PitchDeckGallery 
          decks={decks}
          onCreateNew={() => setIsModalOpen(true)}
          onOpenDeck={openDeck}
        />
      ) : (
        <DeckEditor 
          deck={selectedDeck!} 
          onBack={() => setViewMode('gallery')} 
        />
      )}

      <AnimatePresence>
        {isModalOpen && (
          <NewDeckModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)}
            onSuccess={() => setIsModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PitchDecks;
