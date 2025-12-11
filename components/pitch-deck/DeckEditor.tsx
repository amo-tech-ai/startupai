
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Loader2, Play, Download, Printer } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Deck, Slide } from '../../types';
import { SlideSidebar } from './editor/SlideSidebar';
import { SlideCanvas } from './editor/SlideCanvas';
import { PresentationMode } from './editor/PresentationMode';
import { AICopilotSidebar } from './editor/AICopilotSidebar';
import { useToast } from '../../context/ToastContext';
import { generateUUID } from '../../lib/utils';

interface DeckEditorProps {
  deck: Deck;
  onBack: () => void;
}

export const DeckEditor: React.FC<DeckEditorProps> = ({ deck, onBack }) => {
  const { updateDeck } = useData();
  const { success, toast } = useToast();
  const [slides, setSlides] = useState<Slide[]>(deck.slides);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');
  const [isPresenting, setIsPresenting] = useState(false);
  const [isPrintMode, setIsPrintMode] = useState(false);

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

  // Print Effect
  useEffect(() => {
    if (isPrintMode) {
      // Small delay to ensure DOM is rendered before printing
      const timer = setTimeout(() => {
        window.print();
        // Optional: Exit print mode automatically after print dialog closes? 
        // No, let user exit manually to avoid UI jumping.
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isPrintMode]);

  const handleUpdateSlide = (updatedSlide: Slide) => {
    const newSlides = [...slides];
    newSlides[currentSlideIndex] = updatedSlide;
    setSlides(newSlides);
  };

  const handleAddSlide = () => {
    const newId = generateUUID();
    const newSlide: Slide = {
      id: newId,
      title: "New Slide",
      bullets: ["Add point 1", "Add point 2"],
      visualDescription: "Placeholder visual"
    };
    const newSlides = [...slides];
    newSlides.splice(currentSlideIndex + 1, 0, newSlide);
    setSlides(newSlides);
    setCurrentSlideIndex(currentSlideIndex + 1);
  };

  const handleDuplicateSlide = (index: number) => {
      const sourceSlide = slides[index];
      const newId = generateUUID();
      const newSlide: Slide = {
          ...sourceSlide,
          id: newId,
          title: `${sourceSlide.title} (Copy)`
      };
      
      const newSlides = [...slides];
      newSlides.splice(index + 1, 0, newSlide);
      setSlides(newSlides);
      setCurrentSlideIndex(index + 1);
      success("Slide duplicated");
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

  const togglePrintMode = () => {
    if (!isPrintMode) {
      toast("Preparing PDF view... Use 'Save as PDF' in the print dialog.", "info");
    }
    setIsPrintMode(!isPrintMode);
  };

  // --- PRINT MODE RENDER ---
  if (isPrintMode) {
    return (
      <div className="min-h-screen bg-white text-black p-0">
        <div className="fixed top-4 right-4 z-50 print:hidden flex gap-3">
           <div className="bg-indigo-50 border border-indigo-200 text-indigo-800 px-4 py-2 rounded-lg text-sm font-bold shadow-lg">
              🖨️ Printing Mode Enabled
           </div>
           <button 
             onClick={() => setIsPrintMode(false)}
             className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold shadow-lg hover:bg-slate-800"
           >
             Exit Print Mode
           </button>
        </div>

        {slides.map((slide, idx) => (
          <div key={slide.id} className="w-full h-screen break-after-page flex items-center justify-center p-8 page-break">
             {/* Re-using SlideCanvas logic but simplified for print/read-only */}
             <div className="aspect-video w-full max-w-6xl border border-slate-200 shadow-none p-16 flex flex-col bg-white rounded-none">
                <h1 className="text-5xl font-bold mb-8 text-slate-900">{slide.title}</h1>
                <div className="flex-1 grid grid-cols-2 gap-12">
                   <div className="space-y-6">
                      {slide.bullets.map((b, i) => (
                        <div key={i} className="flex gap-4 items-start">
                           <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 mt-2.5 shrink-0"></div>
                           <p className="text-2xl text-slate-700 leading-snug">{b}</p>
                        </div>
                      ))}
                   </div>
                   <div className="flex items-center justify-center bg-slate-50 rounded-xl overflow-hidden">
                      {slide.imageUrl ? (
                        <img src={slide.imageUrl} className="w-full h-full object-cover" alt="visual" />
                      ) : (
                        <div className="text-slate-300 text-xl font-bold flex flex-col items-center">
                           <span>Visual Placeholder</span>
                           <span className="text-sm font-normal mt-2">({slide.chartType || 'Image'})</span>
                        </div>
                      )}
                   </div>
                </div>
                <div className="mt-auto pt-8 flex justify-between text-slate-400 text-sm border-t border-slate-100">
                   <span>{deck.title}</span>
                   <span>Slide {idx + 1} / {slides.length}</span>
                </div>
             </div>
          </div>
        ))}
      </div>
    );
  }

  // --- EDITOR MODE RENDER ---
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
            onClick={togglePrintMode}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg font-bold text-sm transition-colors border border-slate-700"
          >
            <Printer size={16} /> Export PDF
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
          onDuplicateSlide={handleDuplicateSlide}
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
