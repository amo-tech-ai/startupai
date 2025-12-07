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
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Founders love us</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative">
               <Quote className="absolute top-8 right-8 text-indigo-100 w-10 h-10" />
               <p className="text-slate-600 text-lg leading-relaxed mb-8 relative z-10 font-medium">
                 "{t.quote}"
               </p>
               <div className="flex items-center gap-4">
                 <img src={t.image} alt={t.author} className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-50" />
                 <div>
                   <div className="text-slate-900 font-bold">{t.author}</div>
                   <div className="text-slate-500 text-sm">{t.role}</div>
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