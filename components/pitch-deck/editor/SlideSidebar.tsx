
import React from 'react';
import { PlusCircle, ChevronUp, ChevronDown, Copy } from 'lucide-react';
import { Slide } from '../../../types';

interface SlideSidebarProps {
  slides: Slide[];
  currentSlideIndex: number;
  onSelectSlide: (index: number) => void;
  onAddSlide: () => void;
  onMoveSlide: (index: number, direction: -1 | 1) => void;
  onDuplicateSlide?: (index: number) => void;
}

export const SlideSidebar: React.FC<SlideSidebarProps> = ({ 
  slides, 
  currentSlideIndex, 
  onSelectSlide, 
  onAddSlide,
  onMoveSlide,
  onDuplicateSlide
}) => {
  return (
    <div className="w-64 border-r border-slate-800 flex flex-col bg-slate-900 overflow-y-auto p-4 space-y-4 shrink-0 custom-scrollbar">
      {slides.map((slide, idx) => (
        <div 
          key={slide.id}
          className={`group relative cursor-pointer p-2 rounded-lg transition-all ${idx === currentSlideIndex ? 'bg-indigo-900/50 ring-2 ring-indigo-500' : 'hover:bg-slate-800'}`}
        >
          {/* Controls - Visible on Hover */}
          <div className="absolute right-2 top-2 z-10 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={(e) => { e.stopPropagation(); onMoveSlide(idx, -1); }}
              className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded shadow-sm disabled:opacity-30"
              disabled={idx === 0}
              title="Move Up"
            >
              <ChevronUp size={12} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onMoveSlide(idx, 1); }}
              className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded shadow-sm disabled:opacity-30"
              disabled={idx === slides.length - 1}
              title="Move Down"
            >
              <ChevronDown size={12} />
            </button>
            {onDuplicateSlide && (
                <button 
                    onClick={(e) => { e.stopPropagation(); onDuplicateSlide(idx); }}
                    className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded shadow-sm"
                    title="Duplicate"
                >
                    <Copy size={12} />
                </button>
            )}
          </div>

          <div 
            onClick={() => onSelectSlide(idx)}
            className="aspect-video bg-white rounded flex flex-col p-2 overflow-hidden mb-2 relative"
          >
            {slide.imageUrl ? (
              <img src={slide.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-80" />
            ) : (
              <>
                <div className="h-2 w-1/2 bg-slate-300 rounded mb-2"></div>
                <div className="space-y-1">
                  <div className="h-1 w-full bg-slate-100 rounded"></div>
                  <div className="h-1 w-3/4 bg-slate-100 rounded"></div>
                </div>
              </>
            )}
            <div className="absolute bottom-1 right-2 text-[8px] text-slate-400 font-bold bg-white/80 px-1 rounded">{idx + 1}</div>
          </div>
          <div 
            onClick={() => onSelectSlide(idx)}
            className={`text-xs font-medium truncate ${idx === currentSlideIndex ? 'text-indigo-300' : 'text-slate-400 group-hover:text-slate-200'}`}
          >
            {slide.title}
          </div>
        </div>
      ))}
      
      <button 
        onClick={onAddSlide}
        className="w-full py-3 border-2 border-dashed border-slate-700 rounded-xl text-slate-500 text-sm font-bold hover:border-indigo-500 hover:text-indigo-400 hover:bg-indigo-900/10 transition-all flex items-center justify-center gap-2"
      >
        <PlusCircle size={16} /> Add Slide
      </button>
    </div>
  );
};
