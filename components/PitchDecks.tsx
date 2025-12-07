import React, { useState } from 'react';
import { 
  Plus, 
  Presentation, 
  Loader2, 
  LayoutTemplate, 
  ChevronRight, 
  Play, 
  Download, 
  MoreHorizontal, 
  Sparkles, 
  Layers, 
  Image as ImageIcon,
  RefreshCw,
  Wand2,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';
import { GoogleGenAI } from "@google/genai";
import { Deck, Slide } from '../types';

const PitchDecks: React.FC = () => {
  const { decks, addDeck, profile, addActivity } = useData();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [viewMode, setViewMode] = useState<'gallery' | 'viewer'>('gallery');

  // New Deck Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<'Y Combinator' | 'Sequoia' | 'Custom'>('Y Combinator');

  const templates = [
      { id: 'Y Combinator', name: 'Y Combinator Seed', desc: 'The gold standard for seed rounds. Clear, concise, problem-focused.', slides: 10 },
      { id: 'Sequoia', name: 'Sequoia Capital', desc: 'Story-driven structure focused on market magnitude and team.', slides: 12 },
      { id: 'Custom', name: 'Custom AI Structure', desc: 'Let Gemini analyze your specific business model to decide structure.', slides: 'Auto' }
  ];

  const handleCreateDeck = async () => {
      if (!profile) return;
      if (!process.env.API_KEY) {
          alert("API Key missing");
          return;
      }

      setIsGenerating(true);

      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          
          let templateInstructions = "";
          if (selectedTemplate === 'Y Combinator') {
              templateInstructions = "Strictly follow the Y Combinator Seed Deck structure (approx 10 slides): Title, Problem, Solution, Traction, Unique Insight, Business Model, Market, Competition, Team, Ask.";
          } else if (selectedTemplate === 'Sequoia') {
              templateInstructions = "Strictly follow the Sequoia Capital structure (approx 12 slides): Company Purpose, Problem, Solution, Why Now, Market Potential, Competition, Product, Business Model, Team, Financials, Vision, Ask.";
          } else {
              templateInstructions = "Analyze the startup's specific context (Stage: " + profile.stage + ") to generate a custom, optimal slide flow (10-15 slides).";
          }

          const prompt = `
            Act as a venture capital expert. Create a pitch deck outline for a startup.
            
            Startup Context:
            Name: ${profile.name}
            Problem: ${profile.problemStatement}
            Solution: ${profile.solutionStatement}
            Market: ${profile.targetMarket}
            Stage: ${profile.stage}
            
            Template Request: ${selectedTemplate}
            Instructions: ${templateInstructions}

            Task: Generate a JSON object representing the pitch deck.
            The JSON should be an array of "slides".
            Each slide object must have:
            - "title": string (e.g. "The Problem")
            - "bullets": string[] (3-4 concise, high-impact bullet points for the slide content)
            - "visualDescription": string (detailed description of what image/chart should be on the slide for a designer)

            Output format:
            [
                { "title": "...", "bullets": ["..."], "visualDescription": "..." }
            ]
          `;

          const response = await ai.models.generateContent({
              model: 'gemini-3-pro-preview',
              contents: prompt,
              config: { responseMimeType: 'application/json' }
          });

          const text = response.text;
          if (text) {
              const slides: Slide[] = JSON.parse(text).map((s: any, idx: number) => ({
                  id: `slide_${idx}`,
                  title: s.title,
                  bullets: s.bullets,
                  visualDescription: s.visualDescription
              }));

              const newDeck: Omit<Deck, 'id' | 'startupId'> = {
                  title: `${profile.name} - ${selectedTemplate} Deck`,
                  template: selectedTemplate as any,
                  slides: slides,
                  updatedAt: new Date().toISOString()
              };

              addDeck(newDeck);
              addActivity({ type: 'milestone', title: 'Pitch Deck Created', description: `Generated ${slides.length} slides using ${selectedTemplate} template.` });
              setIsModalOpen(false);
              setIsGenerating(false);
          }
      } catch (error) {
          console.error("Deck Gen Error", error);
          alert("Failed to generate deck. Please try again.");
          setIsGenerating(false);
      }
  };

  const openDeck = (deck: Deck) => {
      setSelectedDeck(deck);
      setViewMode('viewer');
  };

  return (
    <div className="min-h-screen bg-slate-50 relative">
      {viewMode === 'gallery' ? (
          <div className="pt-24 px-6 pb-12 container mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Pitch Decks</h1>
                    <p className="text-slate-500 mt-2">Manage your presentations and investor materials.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
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
                        onClick={() => openDeck(deck)}
                        className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all cursor-pointer overflow-hidden flex flex-col"
                    >
                        {/* Thumbnail Placeholder */}
                        <div className="h-48 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                            {deck.slides[0]?.imageUrl ? (
                                <img src={deck.slides[0].imageUrl} alt="Cover" className="w-full h-full object-cover" />
                            ) : (
                                <>
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 opacity-50"></div>
                                    <Presentation size={48} className="text-indigo-200 group-hover:scale-110 transition-transform duration-500" />
                                </>
                            )}
                            
                            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-indigo-900 flex items-center gap-1">
                                <Layers size={12} /> {deck.slides.length} Slides
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex-1 flex flex-col">
                            <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors mb-2">
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
                                <button className="p-2 hover:bg-slate-50 rounded-full text-slate-400">
                                    <MoreHorizontal size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* Create New Placeholder */}
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="group h-full min-h-[300px] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-4 text-slate-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all"
                >
                    <div className="w-16 h-16 rounded-full bg-slate-50 group-hover:bg-white group-hover:shadow-md flex items-center justify-center transition-all">
                        <Plus size={32} />
                    </div>
                    <span className="font-bold">Create New Deck</span>
                </button>
            </div>
          </div>
      ) : (
          <DeckViewer deck={selectedDeck!} onBack={() => setViewMode('gallery')} />
      )}

      {/* New Deck Modal */}
      <AnimatePresence>
        {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    onClick={() => setIsModalOpen(false)}
                />
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden z-50"
                >
                    <div className="p-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Create New Pitch Deck</h2>
                        <p className="text-slate-500 mb-8">Choose a template structure for your deck.</p>

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
                                onClick={() => setIsModalOpen(false)}
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
        )}
      </AnimatePresence>
    </div>
  );
};

// Sub-component: Slide Viewer/Editor
const DeckViewer: React.FC<{ deck: Deck, onBack: () => void }> = ({ deck, onBack }) => {
    // Local state for slides to handle updates without full DB roundtrip for now
    const [slides, setSlides] = useState<Slide[]>(deck.slides);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [isRefiningText, setIsRefiningText] = useState(false);
    
    const currentSlide = slides[currentSlideIndex];

    const generateSlideImage = async () => {
        if (!process.env.API_KEY) {
            alert("API Key missing");
            return;
        }

        setIsGeneratingImage(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            // Using gemini-2.5-flash-image for generation
            const prompt = `Create a professional, modern flat vector style illustration for a pitch deck slide. 
            Context: ${currentSlide.title}. 
            Description: ${currentSlide.visualDescription || 'A corporate abstract visualization of ' + currentSlide.title}. 
            Colors: Indigo, White, Slate. Minimalist, high quality.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: {
                    parts: [{ text: prompt }]
                }
            });

            // Extract image from response
            // The response structure for image generation often contains inlineData in candidates
            // Or if using generateContent with image model, check parts
            let imageUrl = null;
            
            // Iterate through parts to find image
            if (response.candidates?.[0]?.content?.parts) {
                for (const part of response.candidates[0].content.parts) {
                    if (part.inlineData) {
                        imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                        break;
                    }
                }
            }

            if (imageUrl) {
                const newSlides = [...slides];
                newSlides[currentSlideIndex] = { ...currentSlide, imageUrl };
                setSlides(newSlides);
            } else {
                console.warn("No image data found in response");
                alert("AI generated a response but no image data found. Please try again.");
            }

        } catch (error) {
            console.error("Image Generation Error:", error);
            alert("Failed to generate image.");
        } finally {
            setIsGeneratingImage(false);
        }
    };

    const refineText = async () => {
        if (!process.env.API_KEY) return;
        setIsRefiningText(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Rewrite these bullet points to be more punchy, investor-focused, and quantifiable. Keep the same meaning.
            
            Current bullets:
            ${currentSlide.bullets.join('\n')}
            
            Return ONLY a JSON array of strings. ["bullet 1", "bullet 2"]`;

            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: prompt,
                config: { responseMimeType: 'application/json' }
            });

            const text = response.text;
            if (text) {
                const newBullets = JSON.parse(text);
                const newSlides = [...slides];
                newSlides[currentSlideIndex] = { ...currentSlide, bullets: newBullets };
                setSlides(newSlides);
            }
        } catch (error) {
            console.error("Refine Text Error:", error);
        } finally {
            setIsRefiningText(false);
        }
    };

    return (
        <div className="h-screen flex flex-col bg-slate-900 text-white">
            {/* Toolbar */}
            <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6 shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors">Close</button>
                    <div className="h-6 w-px bg-slate-700"></div>
                    <h2 className="font-bold">{deck.title}</h2>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-bold text-sm transition-colors">
                        <Play size={16} fill="currentColor" /> Present
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg font-bold text-sm transition-colors">
                        <Download size={16} /> Export PDF
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar Slides */}
                <div className="w-64 border-r border-slate-800 flex flex-col bg-slate-900 overflow-y-auto p-4 space-y-4 shrink-0">
                    {slides.map((slide, idx) => (
                        <div 
                            key={slide.id}
                            onClick={() => setCurrentSlideIndex(idx)}
                            className={`group cursor-pointer p-2 rounded-lg transition-all ${idx === currentSlideIndex ? 'bg-indigo-900/50 ring-2 ring-indigo-500' : 'hover:bg-slate-800'}`}
                        >
                            <div className="aspect-video bg-white rounded flex flex-col p-2 overflow-hidden mb-2 relative">
                                {/* Tiny Preview Logic */}
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
                            <div className={`text-xs font-medium truncate ${idx === currentSlideIndex ? 'text-indigo-300' : 'text-slate-400 group-hover:text-slate-200'}`}>
                                {slide.title}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Canvas */}
                <div className="flex-1 bg-slate-950 flex items-center justify-center p-8 overflow-hidden">
                    <div className="aspect-video w-full max-w-5xl bg-white rounded-xl shadow-2xl flex flex-col p-12 md:p-16 relative text-slate-900 transition-all">
                        {/* Slide Header */}
                        <div className="mb-8">
                            <h2 className="text-4xl font-bold text-slate-900 mb-6">{currentSlide.title}</h2>
                            <div className="h-1 w-20 bg-indigo-600 rounded-full mb-8"></div>
                        </div>

                        <div className="grid grid-cols-2 gap-12 h-full">
                            {/* Left Col: Content */}
                            <div className="space-y-4 relative group/text">
                                {currentSlide.bullets.map((bullet, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2.5 shrink-0"></div>
                                        <p className="text-xl text-slate-700 leading-relaxed">{bullet}</p>
                                    </div>
                                ))}
                                
                                {/* Refine Text Overlay */}
                                <div className="absolute -top-4 -right-4 opacity-0 group-hover/text:opacity-100 transition-opacity">
                                    <button 
                                        onClick={refineText}
                                        disabled={isRefiningText}
                                        className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 p-2 rounded-full shadow-sm border border-indigo-200"
                                        title="Magic Rewrite"
                                    >
                                        {isRefiningText ? <Loader2 size={16} className="animate-spin"/> : <Wand2 size={16} />}
                                    </button>
                                </div>
                            </div>
                            
                            {/* Right Col: Visual */}
                            <div className="relative group/image h-full max-h-[400px]">
                                {currentSlide.imageUrl ? (
                                    <div className="relative w-full h-full rounded-xl overflow-hidden shadow-sm border border-slate-100">
                                        <img src={currentSlide.imageUrl} alt="Slide Visual" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center">
                                            <button 
                                                onClick={generateSlideImage}
                                                className="bg-white/90 text-slate-900 px-4 py-2 rounded-lg font-bold shadow-lg flex items-center gap-2 hover:scale-105 transition-transform"
                                            >
                                                <RefreshCw size={16} /> Regenerate
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-center p-6 h-full hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group/placeholder">
                                        {isGeneratingImage ? (
                                            <div className="flex flex-col items-center animate-pulse">
                                                <ImageIcon size={48} className="text-indigo-300 mb-4" />
                                                <p className="text-indigo-600 font-bold">Creating visual...</p>
                                            </div>
                                        ) : (
                                            <>
                                                <ImageIcon size={48} className="text-slate-300 mb-4 group-hover/placeholder:text-indigo-300" />
                                                <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">Suggested Visual</p>
                                                <p className="text-slate-600 italic text-sm mb-6 max-w-xs">"{currentSlide.visualDescription}"</p>
                                                <button 
                                                    onClick={generateSlideImage}
                                                    className="px-6 py-2 bg-white border border-slate-200 shadow-sm rounded-full text-sm font-bold text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 transition-all flex items-center gap-2"
                                                >
                                                    <Sparkles size={14} /> Generate with AI
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Slide Footer */}
                        <div className="absolute bottom-6 left-12 right-12 flex justify-between items-center text-slate-400 text-sm border-t border-slate-100 pt-4">
                            <span>{deck.title}</span>
                            <span>{currentSlideIndex + 1} / {slides.length}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PitchDecks;