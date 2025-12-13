
import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Play, CheckCircle2, FileText, BarChart3, 
  Layout, PieChart, Share2, 
  Briefcase, Search, PenTool, Download, Star, Sparkles, Clock, Database
} from 'lucide-react';
import FinalCTA from './FinalCTA';

// Workaround for strict type checking issues with framer-motion in some environments
const MotionDiv = motion.div as any;

const HowItWorks: React.FC = () => {
  return (
    <div className="bg-white">
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-50">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Text Content */}
            <MotionDiv
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-6">
                Your AI Co-Founder for <span className="text-brand-500">Fundraising.</span>
              </h1>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-lg">
                The all-in-one AI platform that helps founders raise funding, close deals, and scale faster. Stop wasting months on prep.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 hover:-translate-y-1">
                  Start Free
                  <ArrowRight size={18} />
                </button>
                <button className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-full text-base font-semibold hover:bg-slate-50 transition-all hover:-translate-y-1">
                  <Play size={18} fill="currentColor" className="text-slate-900" />
                  Watch Demo (2 min)
                </button>
              </div>

              {/* Stat Strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 border-t border-slate-200 pt-8">
                <div>
                  <div className="text-2xl font-bold text-slate-900">10k+</div>
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Decks Generated</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">60h+</div>
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Saved / Founder</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">$1.2M</div>
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Avg Raise</div>
                </div>
                 <div>
                  <div className="flex items-center gap-1 text-2xl font-bold text-slate-900">4.9 <Star size={16} fill="#fbbf24" className="text-amber-400" /></div>
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Founder Rating</div>
                </div>
              </div>
            </MotionDiv>

            {/* Illustration */}
            <MotionDiv
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-[500px] w-full"
            >
               {/* Abstract Card Stack */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md h-96">
                  {/* Card 3 (Back) */}
                  <div className="absolute top-0 left-10 w-full h-full bg-slate-100 rounded-3xl border border-slate-200 transform -rotate-6 scale-90 opacity-60"></div>
                  {/* Card 2 (Middle) */}
                  <div className="absolute top-4 left-4 w-full h-full bg-brand-50 rounded-3xl border border-brand-100 transform -rotate-3 scale-95 opacity-80"></div>
                  {/* Card 1 (Front) */}
                  <div className="absolute top-8 left-0 w-full h-full bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 flex flex-col">
                     <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600">
                             <Sparkles size={20} />
                           </div>
                           <div>
                              <div className="font-bold text-slate-800">Series A Deck</div>
                              <div className="text-xs text-slate-500">Generated 2m ago</div>
                           </div>
                        </div>
                        <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">READY</div>
                     </div>
                     
                     <div className="space-y-3 mb-6">
                        <div className="h-2 bg-slate-100 rounded-full w-3/4"></div>
                        <div className="h-2 bg-slate-100 rounded-full w-full"></div>
                        <div className="h-2 bg-slate-100 rounded-full w-5/6"></div>
                     </div>

                     <div className="grid grid-cols-2 gap-4 mt-auto">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                           <PieChart className="text-brand-500 mb-2" size={20} />
                           <div className="text-sm font-bold text-slate-900">Market Size</div>
                           <div className="text-xs text-slate-500">$45.2B TAM</div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                           <BarChart3 className="text-emerald-500 mb-2" size={20} />
                           <div className="text-sm font-bold text-slate-900">Growth</div>
                           <div className="text-xs text-slate-500">+12% MoM</div>
                        </div>
                     </div>
                  </div>
                  
                  {/* Floating elements */}
                  <MotionDiv 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -right-8 top-1/4 bg-slate-900 text-white p-4 rounded-xl shadow-xl z-20"
                  >
                    <div className="flex items-center gap-3">
                       <CheckCircle2 size={20} className="text-green-400" />
                       <div className="font-medium text-sm">Financials: Validated</div>
                    </div>
                  </MotionDiv>
               </div>
            </MotionDiv>
          </div>
        </div>
      </section>

      {/* 2. SCROLL STORY */}
      <div className="py-20 container mx-auto px-6">
         <div className="text-center mb-24">
            <span className="text-brand-600 font-bold tracking-wider uppercase text-sm">How It Works</span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mt-3">From idea to investor-ready<br/>in 3 simple steps</h2>
         </div>

         <div className="space-y-32 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-100 -translate-x-1/2 z-0"></div>

            {/* STEP 1 */}
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
               <MotionDiv 
                 initial={{ opacity: 0, x: -50 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true, margin: "-100px" }}
                 className="order-2 lg:order-1"
               >
                  <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-full h-1 bg-brand-500"></div>
                     <div className="space-y-6">
                        <div className="flex gap-4 items-start">
                           <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-500">1</div>
                           <div className="space-y-2 w-full">
                              <div className="h-4 bg-slate-100 rounded w-1/3"></div>
                              <div className="h-10 bg-slate-50 border border-slate-200 rounded-lg w-full"></div>
                           </div>
                        </div>
                        
                        <div className="bg-brand-50 p-4 rounded-lg flex items-center gap-3">
                           <Sparkles size={16} className="text-brand-600" />
                           <span className="text-sm text-brand-700 font-medium">Auto-filling from your URL...</span>
                        </div>
                     </div>
                  </div>
               </MotionDiv>
               <MotionDiv 
                 initial={{ opacity: 0, x: 50 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true, margin: "-100px" }}
                 className="order-1 lg:order-2 lg:pl-16"
               >
                  <div className="flex items-center gap-3 mb-4">
                     <span className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold">1</span>
                     <span className="text-brand-600 font-bold tracking-wide uppercase text-sm">Input</span>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-4">Tell Us About Your Startup</h3>
                  <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                     Paste your website URL or answer 5 simple questions. Our engine instantly extracts context, detects your industry, and sets the stage for success.
                  </p>
               </MotionDiv>
            </div>

            {/* STEP 2 */}
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
               <MotionDiv 
                 initial={{ opacity: 0, x: -50 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true, margin: "-100px" }}
                 className="lg:pr-16"
               >
                  <div className="flex items-center gap-3 mb-4">
                     <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">2</span>
                     <span className="text-slate-900 font-bold tracking-wide uppercase text-sm">Generate</span>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-4">AI Generates Everything</h3>
                  <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                     Watch as our neural core weaves your inputs into a complete fundraising kit. From financial models to board-ready decks.
                  </p>
               </MotionDiv>
               
               <MotionDiv 
                 initial={{ opacity: 0, x: 50 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true, margin: "-100px" }}
                 className="relative h-80 flex items-center justify-center"
               >
                   <div className="absolute inset-0 bg-brand-50 rounded-full blur-3xl opacity-50"></div>
                   
                   {/* Core Orb */}
                   <div className="relative z-20 w-24 h-24 bg-gradient-to-br from-brand-500 to-orange-600 rounded-full shadow-lg shadow-brand-500/30 flex items-center justify-center">
                      <Sparkles className="text-white w-10 h-10 animate-pulse" />
                   </div>

                   {/* Orbiting Docs */}
                   {[0, 72, 144, 216, 288].map((deg, i) => (
                      <MotionDiv
                        key={i}
                        className="absolute w-12 h-12 bg-white rounded-xl shadow-md border border-slate-100 flex items-center justify-center z-10"
                        animate={{ 
                            rotate: 360,
                            x: [Math.cos(deg * Math.PI / 180) * 120, Math.cos((deg + 360) * Math.PI / 180) * 120],
                            y: [Math.sin(deg * Math.PI / 180) * 120, Math.sin((deg + 360) * Math.PI / 180) * 120]
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      >
                         <FileText size={20} className="text-slate-400" />
                      </MotionDiv>
                   ))}
               </MotionDiv>
            </div>

            {/* STEP 3 */}
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
               <MotionDiv 
                 initial={{ opacity: 0, x: -50 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true, margin: "-100px" }}
                 className="order-2 lg:order-1"
               >
                  <div className="bg-slate-900 rounded-2xl shadow-2xl p-2 border border-slate-800">
                     <div className="bg-slate-800 rounded-xl p-6 flex gap-6">
                        {/* Sidebar */}
                        <div className="w-16 space-y-4">
                           <div className="w-10 h-10 rounded-lg bg-brand-600 flex items-center justify-center"><Layout size={20} className="text-white"/></div>
                           <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center"><FileText size={20} className="text-slate-400"/></div>
                        </div>
                        {/* Content */}
                        <div className="flex-1 space-y-4">
                           <div className="flex justify-between items-center">
                              <div className="h-6 bg-slate-700 rounded w-1/3"></div>
                              <div className="px-3 py-1 bg-brand-600 text-white text-xs rounded-md">Export PDF</div>
                           </div>
                           <div className="h-32 bg-slate-700/30 rounded-lg border-2 border-dashed border-slate-700 flex items-center justify-center text-slate-500 text-sm">
                              Slide Preview
                           </div>
                        </div>
                     </div>
                  </div>
               </MotionDiv>
               <MotionDiv 
                 initial={{ opacity: 0, x: 50 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true, margin: "-100px" }}
                 className="order-1 lg:order-2 lg:pl-16"
               >
                  <div className="flex items-center gap-3 mb-4">
                     <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-900 flex items-center justify-center font-bold">3</span>
                     <span className="text-slate-900 font-bold tracking-wide uppercase text-sm">Refine</span>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-4">Edit, Export, and Raise</h3>
                  <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                     Fine-tune your narrative with our intuitive editor. Use AI to rewrite sections, adjust financial assumptions, and export to any format.
                  </p>
                  <div className="mt-8 inline-flex items-center gap-2 bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full text-sm font-medium">
                     <Clock size={14} /> Ready to send
                  </div>
               </MotionDiv>
            </div>
         </div>
      </div>

      {/* 5. FINAL CTA */}
      <FinalCTA 
         headline="Ready to Raise Faster?"
         subheadline="Join 10,000+ founders who've saved 60+ hours on fundraising prep."
         primaryCta="Generate Your Pitch Deck Free"
         secondaryCta="Book a Demo"
      />
    </div>
  );
};

export default HowItWorks;
