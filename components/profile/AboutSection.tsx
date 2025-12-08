
import React, { useState } from 'react';
import { Sparkles, Loader2, Edit3, Save } from 'lucide-react';

interface AboutSectionProps {
  bio: string;
  onUpdate: (bio: string) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ bio, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(bio);
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  const handleSave = () => {
    onUpdate(text);
    setIsEditing(false);
  };

  const handleAiRewrite = () => {
    setIsAiProcessing(true);
    // Simulate AI Latency
    setTimeout(() => {
      setText((prev) => prev + "\n\n(AI Refined): An experienced founder passionate about building scalable solutions...");
      setIsAiProcessing(false);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative group">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-900">About</h2>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
          >
            <Edit3 size={18} />
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-48 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-slate-700 leading-relaxed"
            placeholder="Tell your story..."
          />
          <div className="flex items-center justify-between">
            <button 
              onClick={handleAiRewrite}
              disabled={isAiProcessing}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            >
              {isAiProcessing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              AI Rewrite
            </button>
            <div className="flex gap-2">
              <button 
                onClick={() => { setText(bio); setIsEditing(false); }}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                <Save size={16} /> Save
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="prose prose-slate max-w-none">
          <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
            {bio || "No bio added yet."}
          </p>
        </div>
      )}
    </div>
  );
};
