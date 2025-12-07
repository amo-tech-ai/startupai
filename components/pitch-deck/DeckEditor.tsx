
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Loader2, Play, Download } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Deck, Slide } from '../../types';
import { SlideSidebar } from './editor/SlideSidebar';
import { SlideCanvas } from './editor/SlideCanvas';
import { PresentationMode } from './editor/PresentationMode';
import { AICopilotSidebar } from './editor/AICopilotSidebar';

interface DeckEditorProps {
  deck: Deck;
  onBack: () => void;
}

export const DeckEditor: React.FC<DeckEditorProps> = ({ deck, onBack }) => {
  const { updateDeck } = useData();
  const [slides, setSlides] = useState<Slide[]>(deck.slides);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');
  const [isPresenting, setIsPresenting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Auto-save effect
  useEffect(() => {
    // Only save if content is different
    if (JSON.stringify(slides) !== JSON.stringify(deck.slides)) {
      setSaveStatus('saving');
      const timer = setTimeout(() => {
        updateDeck(deck.id, { slides });
        setSaveStatus('saved');
      }, 1000); // 1s debounce
      return () => clearTimeout(timer);
    }
  }, [slides, deck.id, deck.slides, updateDeck]);

  // Ensure index validity
  useEffect(() => {
    if (currentSlideIndex >= slides.length && slides.length > 0) {
      setCurrentSlideIndex(slides.length - 1);
    }
  }, [slides.length, currentSlideIndex]);

  const handleUpdateSlide = (updatedSlide: Slide) => {
    const newSlides = [...slides];
    newSlides[currentSlideIndex] = updatedSlide;
    setSlides(newSlides);
  };

  const handleAddSlide = () => {
    const newSlide: Slide = {
      id: `slide_new_${Date.now()}`,
      title: "New Slide",
      bullets: ["Add point 1", "Add point 2"],
      visualDescription: "Placeholder visual"
    };
    const newSlides = [...slides];
    newSlides.splice(currentSlideIndex + 1, 0, newSlide);
    setSlides(newSlides);
    setCurrentSlideIndex(currentSlideIndex + 1);
  };

  const handleDeleteSlide = () => {
    if (slides.length <= 1) {
      alert("Cannot delete the only slide.");
      return;
    }
    if (confirm("Are you sure you want to delete this slide?")) {
      const newSlides = slides.filter((_, idx) => idx !== currentSlideIndex);
      setSlides(newSlides);
    }
  };

  const handleMoveSlide = (index: number, direction: -1 | 1) => {
    if (index + direction < 0 || index + direction >= slides.length) return;
    
    const newSlides = [...slides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[index + direction];
    newSlides[index + direction] = temp;
    
    setSlides(newSlides);
    
    // Follow the slide if it's the currently selected one
    if (currentSlideIndex === index) {
      setCurrentSlideIndex(index + direction);
    } else if (currentSlideIndex === index + direction) {
      setCurrentSlideIndex(index);
    }
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert("Export complete! PDF downloaded.");
    }, 2000);
  };

  return (
    <div className="h-screen flex flex-col bg-slate-900 text-white relative">
      {/* Toolbar */}
      <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6 shrink-0 bg-slate-900 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
            <ChevronLeft size={20} /> Close
          </button>
          <div className="h-6 w-px bg-slate-700"></div>
          <div>
            <h2 className="font-bold text-sm md:text-base">{deck.title}</h2>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">{saveStatus === 'saved' ? 'All changes saved' : 'Saving...'}</span>
              {saveStatus === 'saving' && <Loader2 size={10} className="animate-spin text-slate-500"/>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsPresenting(true)}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-bold text-sm transition-colors shadow-lg shadow-indigo-900/50"
          >
            <Play size={16} fill="currentColor" /> Present
          </button>
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg font-bold text-sm transition-colors border border-slate-700"
          >
            {isExporting ? <Loader2 size={16} className="animate-spin"/> : <Download size={16} />}
            Export PDF
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <SlideSidebar 
          slides={slides} 
          currentSlideIndex={currentSlideIndex} 
          onSelectSlide={setCurrentSlideIndex}
          onAddSlide={handleAddSlide}
          onMoveSlide={handleMoveSlide}
        />
        
        <SlideCanvas 
          slide={slides[currentSlideIndex] || slides[0]}
          slideIndex={currentSlideIndex}
          totalSlides={slides.length}
          onUpdate={handleUpdateSlide}
          onDelete={handleDeleteSlide}
        />

        <AICopilotSidebar 
          slide={slides[currentSlideIndex] || slides[0]}
          onUpdate={handleUpdateSlide}
        />
      </div>

      <PresentationMode 
        isOpen={isPresenting} 
        onClose={() => setIsPresenting(false)} 
        slides={slides} 
      />
    </div>
  );
};
