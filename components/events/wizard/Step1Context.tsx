
import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Link as LinkIcon, 
  Plus, 
  X, 
  Search, 
  Globe, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  BrainCircuit, 
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

// Workaround for strict type checking issues
const MotionDiv = motion.div as any;

interface Step1ContextProps {
  data: any;
  updateData: (key: string, value: any) => void;
}

export const Step1Context: React.FC<Step1ContextProps> = ({ data, updateData }) => {
  const [newUrl, setNewUrl] = useState('');
  const [newSearchTerm, setNewSearchTerm] = useState('');

  const handleAddUrl = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newUrl.trim()) {
      e.preventDefault();
      updateData('venueUrls', [...(data.venueUrls || []), newUrl.trim()]);
      setNewUrl('');
    }
  };

  const removeUrl = (idx: number) => {
    const updated = [...(data.venueUrls || [])];
    updated.splice(idx, 1);
    updateData('venueUrls', updated);
  };

  const handleAddSearchTerm = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newSearchTerm.trim()) {
      e.preventDefault();
      updateData('searchTerms', [...(data.searchTerms || []), newSearchTerm.trim()]);
      setNewSearchTerm('');
    }
  };

  const removeSearchTerm = (idx: number) => {
    const updated = [...(data.searchTerms || [])];
    updated.splice(idx, 1);
    updateData('searchTerms', updated);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-32">
      
      {/* LEFT COLUMN: MAIN FORM */}
      <MotionDiv 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-2 space-y-8"
      >
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] p-8">
          <h2 className="text-xl font-bold text-[#1A1A1A] mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
            Event Details
          </h2>

          {/* SECTION 1: BASICS */}
          <div className="space-y-6 mb-10">
            <div>
              <label className="block text-sm font-bold text-[#1A1A1A] mb-2">Event Name</label>
              <input 
                type="text" 
                placeholder="e.g. AI Founders Summit 2025"
                className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-[#1A1A1A] placeholder-[#9CA3AF] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                value={data.name || ''}
                onChange={(e) => updateData('name', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1A1A1A] mb-2">
                Event Description
                <span className="ml-2 text-xs font-normal text-[#6B7280]">Gemini will use this as the primary planning signal</span>
              </label>
              <textarea 
                placeholder="Describe the purpose, audience, and vibe. Be specific about your goals."
                className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-[#1A1A1A] placeholder-[#9CA3AF] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all min-h-[120px] resize-y"
                value={data.description || ''}
                onChange={(e) => updateData('description', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1A1A1A] mb-2">Event Type</label>
              <div className="relative">
                <select 
                  className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-[#1A1A1A] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none"
                  value={data.type || ''}
                  onChange={(e) => updateData('type', e.target.value)}
                >
                  <option value="" disabled>Select a type...</option>
                  <option value="Conference">Conference</option>
                  <option value="Meetup">Meetup</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Product Launch">Product Launch</option>
                  <option value="Fashion Show">Fashion Show</option>
                  <option value="Demo Day">Demo Day</option>
                  <option value="Other">Other</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ArrowRight size={16} className="text-gray-400 rotate-90" />
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-[#E5E5E5] w-full mb-10"></div>

          {/* SECTION 2: DATES & LOCATION */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div>
              <label className="block text-sm font-bold text-[#1A1A1A] mb-2">Event Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="date" 
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-[#1A1A1A] focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={data.date || ''}
                  onChange={(e) => updateData('date', e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1A1A1A] mb-2">Duration (Hours)</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="number" 
                  placeholder="4"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-[#1A1A1A] focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={data.duration || ''}
                  onChange={(e) => updateData('duration', e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1A1A1A] mb-2">City / Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="San Francisco"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-[#1A1A1A] focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={data.city || ''}
                  onChange={(e) => updateData('city', e.target.value)}
                />
              </div>
            </div>
            <div className="md:col-span-3 text-xs text-[#6B7280]">
              Used to validate venue capacity, local costs, and scheduling feasibility.
            </div>
          </div>

          <div className="h-px bg-[#E5E5E5] w-full mb-10"></div>

          {/* SECTION 3: URL CONTEXT */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-bold text-[#1A1A1A]">
                Venue & Inspiration URLs
              </label>
              <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100">
                <Sparkles size={12} /> Gemini URL Context enabled
              </span>
            </div>
            
            <div className="space-y-3">
              {data.venueUrls?.map((url: string, idx: number) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-[#F7F7F5] rounded-xl border border-[#E5E5E5]">
                  <Globe size={16} className="text-indigo-500" />
                  <span className="flex-1 text-sm text-[#1A1A1A] truncate">{url}</span>
                  <button 
                    onClick={() => removeUrl(idx)}
                    className="p-1 hover:bg-white rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="url" 
                  placeholder="Paste URL and press Enter (e.g. https://venue.com)"
                  className="w-full pl-10 pr-12 py-3 bg-white border border-[#E5E5E5] rounded-xl text-[#1A1A1A] focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  onKeyDown={handleAddUrl}
                />
                <button 
                  onClick={() => { if(newUrl) { updateData('venueUrls', [...(data.venueUrls||[]), newUrl]); setNewUrl(''); } }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-gray-100 hover:bg-indigo-100 text-gray-500 hover:text-indigo-600 rounded-lg transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              <p className="text-xs text-[#6B7280]">
                Gemini will extract constraints, pricing signals, and visual style from these links.
              </p>
            </div>
          </div>

          <div className="h-px bg-[#E5E5E5] w-full mb-10"></div>

          {/* SECTION 4: SEARCH INTENT */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-bold text-[#1A1A1A]">
                Search Intent (Grounding)
              </label>
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                <Search size={12} /> Google Search Grounding
              </span>
            </div>

            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Add search terms (e.g. 'Tech meetups San Francisco')..."
                className="w-full pl-10 pr-12 py-3 bg-white border border-[#E5E5E5] rounded-xl text-[#1A1A1A] focus:ring-2 focus:ring-indigo-500 outline-none"
                value={newSearchTerm}
                onChange={(e) => setNewSearchTerm(e.target.value)}
                onKeyDown={handleAddSearchTerm}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {data.searchTerms?.map((term: string, idx: number) => (
                <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E5E5E5] rounded-full text-sm text-[#1A1A1A]">
                  {term}
                  <button onClick={() => removeSearchTerm(idx)} className="hover:text-red-500 transition-colors">
                    <X size={14} />
                  </button>
                </span>
              ))}
              {(!data.searchTerms || data.searchTerms.length === 0) && (
                <span className="text-xs text-[#9CA3AF] italic">No search terms added.</span>
              )}
            </div>
            <p className="text-xs text-[#6B7280] mt-3">
              Used with Google Search grounding to validate assumptions and find conflicts.
            </p>
          </div>

        </div>
      </MotionDiv>

      {/* RIGHT COLUMN: AI EXPLANATION */}
      <MotionDiv 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-1"
      >
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] p-6 sticky top-24">
          <div className="flex items-center gap-2 mb-1">
            <BrainCircuit size={20} className="text-indigo-600" />
            <h3 className="font-bold text-[#1A1A1A]">What AI Will Do Next</h3>
          </div>
          <p className="text-xs text-[#6B7280] font-medium uppercase tracking-wide mb-6">Using Gemini 3 Pro</p>

          <ul className="space-y-4">
            <li className="flex gap-3 text-sm text-[#4B5563]">
              <div className="mt-0.5 p-1 bg-indigo-50 rounded text-indigo-600 shrink-0">
                <Globe size={14} />
              </div>
              <span>Analyze your description and URLs <strong>(URL Context)</strong></span>
            </li>
            <li className="flex gap-3 text-sm text-[#4B5563]">
              <div className="mt-0.5 p-1 bg-emerald-50 rounded text-emerald-600 shrink-0">
                <Search size={14} />
              </div>
              <span>Ground decisions using real-world data <strong>(Google Search)</strong></span>
            </li>
            <li className="flex gap-3 text-sm text-[#4B5563]">
              <div className="mt-0.5 p-1 bg-purple-50 rounded text-purple-600 shrink-0">
                <Zap size={14} />
              </div>
              <span>Initialize a long-running planning session <strong>(Interactions API)</strong></span>
            </li>
            <li className="flex gap-3 text-sm text-[#4B5563]">
              <div className="mt-0.5 p-1 bg-amber-50 rounded text-amber-600 shrink-0">
                <ShieldCheck size={14} />
              </div>
              <span>Generate an event blueprint, tasks, and risks</span>
            </li>
          </ul>

          <div className="my-6 h-px bg-[#E5E5E5]"></div>

          <div className="mb-6">
            <p className="text-xs text-[#6B7280] leading-relaxed">
              The <strong>Interactions API</strong> manages state, tool orchestration, and multi-step reasoning across the entire event lifecycle.
            </p>
          </div>

          <div className="bg-[#F3E8FF] border border-[#E9D5FF] rounded-xl p-4">
            <div className="flex gap-2 text-xs text-[#6B21A8] font-medium leading-relaxed">
              <Sparkles size={16} className="shrink-0 mt-0.5" />
              <p>Adding real URLs dramatically improves accuracy and reduces planning risk.</p>
            </div>
          </div>
        </div>
      </MotionDiv>

    </div>
  );
};
