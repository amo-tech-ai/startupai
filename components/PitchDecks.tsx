import React from 'react';
import { Plus } from 'lucide-react';

const PitchDecks: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 px-6 pb-12">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Pitch Decks</h1>
            <button className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors">
                <Plus size={18} /> New Deck
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="h-40 bg-slate-100 rounded-lg mb-4 flex items-center justify-center text-slate-400">Thumbnail</div>
                <h3 className="font-bold text-lg text-slate-900">Series A Deck</h3>
                <p className="text-sm text-slate-500">Edited 2 hours ago</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                 <div className="h-40 bg-slate-100 rounded-lg mb-4 flex items-center justify-center text-slate-400">Thumbnail</div>
                <h3 className="font-bold text-lg text-slate-900">Seed Round</h3>
                <p className="text-sm text-slate-500">Edited 5 days ago</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PitchDecks;