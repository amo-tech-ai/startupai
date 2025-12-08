
import React from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight, BarChart3, Users, Globe, Zap } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { PageType } from '../types';

// Workaround for strict type checking issues with framer-motion in some environments
const MotionDiv = motion.div as any;

const data = [
  { name: 'Mon', value: 40 },
  { name: 'Tue', value: 30 },
  { name: 'Wed', value: 60 },
  { name: 'Thu', value: 45 },
  { name: 'Fri', value: 80 },
  { name: 'Sat', value: 70 },
  { name: 'Sun', value: 95 },
];

interface HeroProps {
  setPage?: (page: PageType) => void;
}

const Hero: React.FC<HeroProps> = ({ setPage }) => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/30">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-200/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Content */}
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 bg-white border border-slate-200 shadow-sm rounded-full px-4 py-1.5 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-primary-600 animate-pulse"></span>
              <span className="text-xs font-semibold text-slate-600 tracking-wide uppercase">New Founder Edition 2.0</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-6">
              Turn your vision into <span className="text-primary-600">reality</span> with AI.
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-lg">
              The only platform that transforms raw ideas into full business roadmaps, investor decks, and operational workflows in seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => setPage && setPage('onboarding')}
                className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 hover:-translate-y-1"
              >
                Start Free
                <ArrowRight size={18} />
              </button>
              <button className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-full text-base font-semibold hover:bg-slate-50 transition-all hover:-translate-y-1">
                <Play size={18} fill="currentColor" className="text-slate-900" />
                Watch Demo (2 min)
              </button>
            </div>

            <div className="mt-12 flex items-center gap-6 text-slate-500 text-sm font-medium">
              <div className="flex -space-x-3">
                 {[1,2,3,4].map(i => (
                    <img key={i} src={`https://picsum.photos/40/40?random=${i}`} alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
                 ))}
              </div>
              <p>Trusted by 10,000+ founders</p>
            </div>
          </MotionDiv>

          {/* Right Illustration */}
          <MotionDiv
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative z-10 bg-white rounded-3xl shadow-2xl shadow-indigo-500/10 border border-slate-200 overflow-hidden">
                {/* Window Controls */}
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>

                {/* Dashboard Body */}
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Growth Projection</h3>
                            <p className="text-sm text-slate-500">Real-time market analysis</p>
                        </div>
                        <div className="px-3 py-1 bg-green-50 text-green-700 text-sm font-semibold rounded-full flex items-center gap-1">
                            +124% <ArrowRight size={12} className="-rotate-45" />
                        </div>
                    </div>
                    
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                                <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-xl">
                            <div className="flex items-center gap-2 mb-2 text-slate-500 text-sm font-medium">
                                <Users size={16} />
                                <span>Active Users</span>
                            </div>
                            <div className="text-2xl font-bold text-slate-900">4,289</div>
                        </div>
                         <div className="bg-slate-50 p-4 rounded-xl">
                            <div className="flex items-center gap-2 mb-2 text-slate-500 text-sm font-medium">
                                <Globe size={16} />
                                <span>Regions</span>
                            </div>
                            <div className="text-2xl font-bold text-slate-900">24</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Elements */}
            <MotionDiv 
                className="absolute -right-8 top-20 bg-white p-5 rounded-2xl shadow-xl border border-slate-100 hidden md:block"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-primary-600">
                        <BarChart3 size={20} />
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-slate-800">Insights Ready</div>
                        <div className="text-xs text-slate-500">Just now</div>
                    </div>
                </div>
            </MotionDiv>

             <MotionDiv 
                className="absolute -left-12 bottom-32 bg-slate-900 p-5 rounded-2xl shadow-2xl hidden md:block"
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-green-400">
                        <Zap size={20} />
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-white">Efficiency</div>
                        <div className="text-xs text-slate-400">Boosted by 45%</div>
                    </div>
                </div>
            </MotionDiv>

          </MotionDiv>
        </div>
      </div>
    </section>
  );
};

export default Hero;
