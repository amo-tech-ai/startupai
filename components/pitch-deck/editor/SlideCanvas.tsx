
import React, { useState } from 'react';
import { 
  Trash2, Loader2, Wand2, RefreshCw, Sparkles, Image as ImageIcon,
  LineChart as LineChartIcon, BarChart as BarChartIcon, PieChart as PieChartIcon, Grid,
  Plus, XCircle
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { Slide } from '../../../types';
import { slideAIEdge, imageAIEdge } from '../../../services/edgeFunctions';
import { API_KEY } from '../../../lib/env';
import { useToast } from '../../../context/ToastContext';

interface SlideCanvasProps {
  slide: Slide;
  slideIndex: number;
  totalSlides: number;
  onUpdate: (updatedSlide: Slide) => void;
  onDelete: () => void;
}

export const SlideCanvas: React.FC<SlideCanvasProps> = ({ 
  slide, 
  slideIndex, 
  totalSlides, 
  onUpdate, 
  onDelete 
}) => {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isRefiningText, setIsRefiningText] = useState(false);
  const { toast, error, success } = useToast();

  // --- Helpers ---
  const getChartIcon = (type: string) => {
    switch(type) {
      case 'line': return <LineChartIcon size={24} className="text-indigo-500" />;
      case 'bar': return <BarChartIcon size={24} className="text-indigo-500" />;
      case 'pie': case 'circles': return <PieChartIcon size={24} className="text-indigo-500" />;
      case 'matrix': return <Grid size={24} className="text-indigo-500" />;
      default: return <ImageIcon size={24} className="text-indigo-500" />;
    }
  };

  // --- Actions ---
  const handleGenerateImage = async () => {
    if (!API_KEY) {
      error("API Key missing");
      return;
    }

    setIsGeneratingImage(true);
    toast("Generating image from slide context...", "info");
    
    try {
      const imageUrl = await imageAIEdge(API_KEY, slide.title, slide.visualDescription || '');
      if (imageUrl) {
        onUpdate({ ...slide, imageUrl });
        success("Image generated successfully!");
      } else {
        error("AI generated a response but no image data found. Please try again.");
      }
    } catch (err) {
      console.error("Image Generation Error:", err);
      error("Failed to generate image.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleRefineText = async () => {
    if (!API_KEY) {
      error("API Key missing");
      return;
    }
    setIsRefiningText(true);
    try {
      const newBullets = await slideAIEdge(API_KEY, slide.bullets, 'refine');
      if (newBullets) {
        onUpdate({ ...slide, bullets: newBullets });
        success("Text refined!");
      }
    } catch (err) {
      console.error("Refine Text Error:", err);
      error("Failed to refine text.");
    } finally {
      setIsRefiningText(false);
    }
  };

  const updateBullet = (index: number, value: string) => {
    const newBullets = [...slide.bullets];
    newBullets[index] = value;
    onUpdate({ ...slide, bullets: newBullets });
  };

  const addBullet = () => {
    onUpdate({ ...slide, bullets: [...slide.bullets, "New bullet point"] });
  };

  const deleteBullet = (index: number) => {
    if (slide.bullets.length <= 1) return;
    const newBullets = slide.bullets.filter((_, i) => i !== index);
    onUpdate({ ...slide, bullets: newBullets });
  };

  return (
    <div className="flex-1 bg-slate-950 flex items-center justify-center p-8 overflow-hidden relative">
      <div className="aspect-video w-full max-w-5xl bg-white rounded-xl shadow-2xl flex flex-col p-12 md:p-16 relative text-slate-900 transition-all group/canvas">
        
        {/* Slide Delete Control */}
        <div className="absolute top-4 right-4 opacity-0 group-hover/canvas:opacity-100 transition-opacity">
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(); }} 
            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors" 
            title="Delete Slide"
          >
            <Trash2 size={18} />
          </button>
        </div>

        {/* Slide Header (Editable) */}
        <div className="mb-8">
          <input 
            type="text"
            value={slide.title}
            onChange={(e) => onUpdate({ ...slide, title: e.target.value })}
            className="text-4xl font-bold text-slate-900 w-full bg-transparent border-b border-transparent hover:border-slate-200 focus:border-indigo-500 outline-none pb-1 transition-colors"
          />
          <div className="h-1 w-20 bg-indigo-600 rounded-full mt-6"></div>
        </div>

        <div className="grid grid-cols-2 gap-12 h-full">
          {/* Left Col: Content (Editable) */}
          <div className="relative group/text flex flex-col">
            <div className="space-y-4 flex-1">
                {slide.bullets.map((bullet, i) => (
                <div key={i} className="flex items-start gap-3 group/bullet">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2.5 shrink-0"></div>
                    <textarea
                        value={bullet}
                        onChange={(e) => updateBullet(i, e.target.value)}
                        rows={2}
                        className="text-xl text-slate-700 leading-relaxed w-full bg-transparent border border-transparent hover:border-slate-200 focus:border-indigo-500 rounded p-1 -ml-1 outline-none resize-none transition-colors"
                    />
                    {slide.bullets.length > 1 && (
                      <button 
                          onClick={() => deleteBullet(i)}
                          className="mt-2 text-slate-300 hover:text-red-400 opacity-0 group-hover/bullet:opacity-100 transition-opacity"
                          title="Remove Bullet"
                      >
                          <XCircle size={16} />
                      </button>
                    )}
                </div>
                ))}
            </div>
            
            {/* Action Buttons */}
            <div className="mt-4 flex gap-2 opacity-0 group-hover/text:opacity-100 transition-opacity">
                <button 
                    onClick={addBullet}
                    className="flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-full transition-colors"
                >
                    <Plus size={14} /> Add Point
                </button>
                <button 
                    onClick={handleRefineText}
                    disabled={isRefiningText}
                    className="flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
                >
                    {isRefiningText ? <Loader2 size={14} className="animate-spin"/> : <Wand2 size={14} />}
                    AI Rewrite
                </button>
            </div>
          </div>
          
          {/* Right Col: Visual or Chart */}
          <div className="relative group/image h-full max-h-[400px]">
            {slide.chartData && slide.chartType ? (
              // Chart Rendering
              <div className="w-full h-full rounded-xl bg-slate-50 border border-slate-100 p-4 relative">
                <div className="absolute top-2 right-2 z-10 opacity-0 group-hover/image:opacity-100 transition-opacity">
                  <button className="text-xs bg-white border border-slate-200 px-2 py-1 rounded text-slate-500 shadow-sm">
                    AI Generated Data
                  </button>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  {slide.chartType === 'line' ? (
                    <LineChart data={slide.chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="label" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val >= 1000 ? val/1000 + 'k' : val}`} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} dot={{ fill: '#4f46e5', r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  ) : slide.chartType === 'pie' ? (
                    <PieChart>
                      <Pie 
                        data={slide.chartData} 
                        dataKey="value" 
                        nameKey="label" 
                        cx="50%" 
                        cy="50%" 
                        outerRadius={80} 
                        innerRadius={50}
                        paddingAngle={5}
                      >
                        {slide.chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#4f46e5', '#818cf8', '#c7d2fe', '#e0e7ff'][index % 4]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  ) : (
                    <BarChart data={slide.chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="label" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val >= 1000 ? val/1000 + 'k' : val}`} />
                      <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            ) : slide.imageUrl ? (
              // Image Rendering
              <div className="relative w-full h-full rounded-xl overflow-hidden shadow-sm border border-slate-100 bg-slate-50">
                <img src={slide.imageUrl} alt="Slide Visual" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={handleGenerateImage}
                    className="bg-white/90 text-slate-900 px-4 py-2 rounded-lg font-bold shadow-lg flex items-center gap-2 hover:scale-105 transition-transform"
                  >
                    <RefreshCw size={16} /> Regenerate
                  </button>
                </div>
              </div>
            ) : (
              // Placeholder
              <div 
                className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-center p-6 h-full hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group/placeholder cursor-pointer" 
                onClick={handleGenerateImage}
              >
                {isGeneratingImage ? (
                  <div className="flex flex-col items-center animate-pulse">
                    <ImageIcon size={48} className="text-indigo-300 mb-4" />
                    <p className="text-indigo-600 font-bold">Creating visual...</p>
                  </div>
                ) : (
                  <>
                    {slide.chartType ? (
                      <div className="mb-6 p-4 bg-indigo-50 rounded-full text-indigo-500">
                        {getChartIcon(slide.chartType)}
                      </div>
                    ) : (
                      <ImageIcon size={48} className="text-slate-300 mb-4 group-hover/placeholder:text-indigo-300" />
                    )}
                    
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">
                      {slide.chartType ? `Suggested ${slide.chartType} Chart` : 'Suggested Visual'}
                    </p>
                    <p className="text-slate-600 italic text-sm mb-6 max-w-xs">"{slide.visualDescription}"</p>
                    
                    <button 
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
          <span>Pitch Deck</span>
          <span>{slideIndex + 1} / {totalSlides}</span>
        </div>
      </div>
    </div>
  );
};
