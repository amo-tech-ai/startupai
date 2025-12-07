
import React from 'react';
import { Plus, Presentation, Layers, ChevronRight, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { Deck } from '../../types';

interface PitchDeckGalleryProps {
  decks: Deck[];
  onCreateNew: () => void;
  onOpenDeck: (deck: Deck) => void;
}

export const PitchDeckGallery: React.FC<PitchDeckGalleryProps> = ({ decks, onCreateNew, onOpenDeck }) => {
  return (
    <div className="pt-24 px-6 pb-12 container mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Pitch Decks</h1>
          <p className="text-slate-500 mt-2">Manage your presentations and investor materials.</p>
        </div>
        <button 
          onClick={onCreateNew}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 hover:-translate-y-1"
        >
          <Plus size={20} /> New Deck
        </button>
      </div>

      {/* Deck Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {decks.map((deck) => (
          <motion.div 
            key={deck.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => onOpenDeck(deck)}
            className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all cursor-pointer overflow-hidden flex flex-col h-[400px]"
          >
            {/* Thumbnail Placeholder */}
            <div className="h-48 bg-slate-100 relative overflow-hidden flex items-center justify-center shrink-0">
              {deck.slides[0]?.imageUrl ? (
                <img src={deck.slides[0].imageUrl} alt="Cover" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 opacity-50"></div>
                  <Presentation size={48} className="text-indigo-200 group-hover:scale-110 transition-transform duration-500" />
                </>
              )}
              
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-indigo-900 flex items-center gap-1 shadow-sm">
                <Layers size={12} /> {deck.slides.length} Slides
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors mb-2 line-clamp-2">
                {deck.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
                <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-600">{deck.template}</span>
                <span>•</span>
                <span>Edited {new Date(deck.updatedAt).toLocaleDateString()}</span>
              </div>

              <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                <button className="text-sm font-bold text-indigo-600 flex items-center gap-1 hover:gap-2 transition-all">
                  Edit Slides <ChevronRight size={16} />
                </button>
                <button className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors">
                  <MoreHorizontal size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Create New Placeholder */}
        <button 
          onClick={onCreateNew}
          className="group h-[400px] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-4 text-slate-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all"
        >
          <div className="w-16 h-16 rounded-full bg-slate-50 group-hover:bg-white group-hover:shadow-md flex items-center justify-center transition-all">
            <Plus size={32} />
          </div>
          <span className="font-bold">Create New Deck</span>
        </button>
      </div>
    </div>
  );
};
