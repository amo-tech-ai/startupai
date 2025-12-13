
import React from 'react';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "startupAI cut our fundraising time by half. The pitch deck generator is basically magic.",
    author: "Elena R.",
    role: "CEO, FinTech Global",
    image: "https://picsum.photos/100/100?random=10"
  },
  {
    quote: "I was skeptical about AI, but the market analysis tool found a $2B opportunity we missed.",
    author: "Marcus J.",
    role: "Founder, GreenEnergy",
    image: "https://picsum.photos/100/100?random=11"
  },
  {
    quote: "The best investment we made this year. It's like having a McKinsey consultant in your pocket.",
    author: "Sarah L.",
    role: "Director, HealthAI",
    image: "https://picsum.photos/100/100?random=12"
  }
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Founders love us</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-slate-50 p-8 rounded-2xl border border-slate-200 relative hover:border-brand-200 transition-colors">
               <Quote className="absolute top-8 right-8 text-slate-200 w-8 h-8" />
               <p className="text-slate-700 text-lg leading-relaxed mb-8 relative z-10 font-medium">
                 "{t.quote}"
               </p>
               <div className="flex items-center gap-4">
                 <img src={t.image} alt={t.author} className="w-10 h-10 rounded-full object-cover ring-2 ring-white" />
                 <div>
                   <div className="text-slate-900 font-bold text-sm">{t.author}</div>
                   <div className="text-slate-500 text-xs">{t.role}</div>
                 </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
