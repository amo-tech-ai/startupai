
import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Slide } from '../../../types';
import { Image as ImageIcon } from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip 
} from 'recharts';

// Workaround for strict type checking issues with framer-motion in some environments
const MotionDiv = motion.div as any;

interface PresentationModeProps {
  isOpen: boolean;
  onClose: () => void;
  slides: Slide[];
}

export const PresentationMode: React.FC<PresentationModeProps> = ({ isOpen, onClose, slides }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);
  const currentSlide = slides[currentSlideIndex] || slides[0];

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;
    
    if (e.key === 'ArrowRight' || e.key === 'Space') {
      setCurrentSlideIndex(prev => Math.min(prev + 1, slides.length - 1));
    } else if (e.key === 'ArrowLeft') {
      setCurrentSlideIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Escape') {
      onClose();
    }
  }, [isOpen, slides.length, onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Reset index when opened
  useEffect(() => {
    if (isOpen) setCurrentSlideIndex(0);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <MotionDiv 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center cursor-none"
        >
          <div className="aspect-video w-full h-full md:w-[90%] md:h-auto bg-white flex flex-col p-16 md:p-24 relative overflow-hidden">
            {/* Slide Header */}
            <div className="mb-12">
              <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-8">{currentSlide.title}</h2>
              <div className="h-2 w-32 bg-indigo-600 rounded-full"></div>
            </div>

            <div className="grid grid-cols-2 gap-16 h-full items-center">
              <div className="space-y-8">
                {currentSlide.bullets.map((bullet, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-3 h-3 rounded-full bg-indigo-500 mt-3 shrink-0"></div>
                    <p className="text-3xl text-slate-700 leading-snug">{bullet}</p>
                  </div>
                ))}
              </div>
              <div className="relative h-full max-h-[600px] flex items-center justify-center">
                {currentSlide.chartData && currentSlide.chartType ? (
                  <div className="w-full h-full p-4">
                    <ResponsiveContainer width="100%" height="100%">
                      {currentSlide.chartType === 'line' ? (
                        <LineChart data={currentSlide.chartData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="label" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={4} />
                        </LineChart>
                      ) : currentSlide.chartType === 'pie' ? (
                        <PieChart>
                          <Pie data={currentSlide.chartData} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={120} fill="#4f46e5" label />
                          <Tooltip />
                        </PieChart>
                      ) : (
                        <BarChart data={currentSlide.chartData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="label" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#4f46e5" />
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                ) : currentSlide.imageUrl ? (
                  <img src={currentSlide.imageUrl} alt="" className="rounded-2xl shadow-xl max-h-full object-contain" />
                ) : (
                  <div className="text-slate-300 flex flex-col items-center">
                    <ImageIcon size={64} className="mb-4" />
                    <p className="text-2xl font-bold">Visual Placeholder</p>
                  </div>
                )}
              </div>
            </div>

            {/* Controls Hint */}
            <div className="absolute bottom-8 right-8 text-slate-300 text-sm font-medium flex gap-4 opacity-50 hover:opacity-100 transition-opacity">
              <span>← Prev</span>
              <span>{currentSlideIndex + 1} / {slides.length}</span>
              <span>Next →</span>
              <span className="ml-4">ESC to Exit</span>
            </div>
          </div>
        </MotionDiv>
      )}
    </AnimatePresence>
  );
};
