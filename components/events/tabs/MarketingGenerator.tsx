
import React, { useState } from 'react';
import { Sparkles, Loader2, ImageIcon } from 'lucide-react';
import { EventData, EventAsset } from '../../../types';
import { API_KEY } from '../../../lib/env';
import { EventAI } from '../../../services/eventAI';
import { EventService } from '../../../services/supabase/events';
import { useToast } from '../../../context/ToastContext';

interface MarketingGeneratorProps {
  event: EventData;
  onAssetCreated: (asset: EventAsset) => void;
}

export const MarketingGenerator: React.FC<MarketingGeneratorProps> = ({ event, onAssetCreated }) => {
  const { toast, success, error } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeType, setActiveType] = useState<'Social' | 'Email' | 'Poster'>('Social');

  const handleGenerate = async () => {
      if (!API_KEY || !event.id) return;
      setIsGenerating(true);
      toast(`Designing ${activeType} asset with Gemini Nano Banana...`, "info");

      try {
          const result = await EventAI.generateMarketingAssets(API_KEY, event, activeType);
          
          if (result) {
              // Save Image
              if (result.imageUrl) {
                  const imgAsset = await EventService.createAsset({
                      eventId: event.id,
                      type: 'image',
                      content: result.imageUrl,
                      title: `${activeType} Visual`
                  });
                  if (imgAsset) onAssetCreated(imgAsset);
              }

              // Save Copy
              if (result.copy) {
                  const textAsset = await EventService.createAsset({
                      eventId: event.id,
                      type: 'copy',
                      content: result.copy,
                      title: `${activeType} Caption`
                  });
                  if (textAsset) onAssetCreated(textAsset);
              }
              success("Assets generated successfully!");
          }
      } catch (e) {
          console.error(e);
          error("Generation failed.");
      } finally {
          setIsGenerating(false);
      }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles size={24} className="text-purple-600" /> Marketing Studio
                </h2>
                <p className="text-slate-500 mt-1">Generate social assets and email copy using Gemini Nano Banana.</p>
            </div>
            
            <div className="flex items-center gap-4 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                {['Social', 'Email', 'Poster'].map((type) => (
                    <button
                        key={type}
                        onClick={() => setActiveType(type as any)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                            activeType === type 
                            ? 'bg-white text-slate-900 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-500/20 transition-all disabled:opacity-70"
            >
                {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} />}
                <span>Generate Bundle</span>
            </button>
        </div>
    </div>
  );
};