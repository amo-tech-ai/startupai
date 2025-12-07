import React, { useState } from 'react';
import { LayoutTemplate, Loader2, Sparkles, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useData } from '../../context/DataContext';
import { generateDeckEdge } from '../../services/edgeFunctions';
import { API_KEY } from '../../lib/env';

interface NewDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const templates = [
  { id: 'Y Combinator', name: 'Y Combinator Seed', desc: 'The gold standard for seed rounds. Clear, concise, problem-focused.', slides: 10 },
  { id: 'Sequoia', name: 'Sequoia Capital', desc: 'Story-driven structure focused on market magnitude and team.', slides: 12 },
  { id: 'Custom', name: 'Custom AI Structure', desc: 'Let Gemini analyze your specific business model to decide structure.', slides: 'Auto' }
];

export const NewDeckModal: React.FC<NewDeckModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { profile, addDeck, addActivity } = useData();
  const [selectedTemplate, setSelectedTemplate] = useState<'Y Combinator' | 'Sequoia' | 'Custom'>('Y Combinator');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCreateDeck = async () => {
    if (!profile) return;
    if (!API_KEY) {
      alert("API Key missing");
      return;
    }

    setIsGenerating(true);

    try {
      const deckData = await generateDeckEdge(API_KEY, profile, selectedTemplate);

      if (deckData) {
        addDeck(deckData);
        addActivity({ 
          type: 'milestone', 
          title: 'Pitch Deck Created', 
          description: `Generated ${deckData.slides.length} slides using ${selectedTemplate} template.` 
        });
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Deck Gen Error", error);
      alert("Failed to generate deck. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden z-50"
      >
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Create New Pitch Deck</h2>
              <p className="text-slate-500">Choose a template structure for your deck.</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="grid gap-4 mb-8">
            {templates.map(t => (
              <div 
                key={t.id}
                onClick={() => setSelectedTemplate(t.id as any)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4 ${selectedTemplate === t.id ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100 hover:border-indigo-200'}`}
              >
                <div className={`mt-1 p-2 rounded-lg ${selectedTemplate === t.id ? 'bg-indigo-200 text-indigo-800' : 'bg-slate-100 text-slate-500'}`}>
                  <LayoutTemplate size={20} />
                </div>
                <div>
                  <h3 className={`font-bold ${selectedTemplate === t.id ? 'text-indigo-900' : 'text-slate-900'}`}>{t.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">{t.desc}</p>
                </div>
                <div className="ml-auto text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded border border-slate-200">
                  {t.slides} Slides
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleCreateDeck}
              disabled={isGenerating}
              className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 disabled:opacity-70 flex items-center gap-2"
            >
              {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
              {isGenerating ? 'Generating...' : 'Generate with AI'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
