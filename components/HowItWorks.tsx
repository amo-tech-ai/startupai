
import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Play, CheckCircle2, FileText, BarChart3, 
  Users, Database, Cpu, Layout, PieChart, Share2, 
  Briefcase, Layers, Settings, Search, PenTool, Download, Star, Sparkles, Clock
} from 'lucide-react';
import FinalCTA from './FinalCTA';

// Workaround for strict type checking issues with framer-motion in some environments
const MotionDiv = motion.div as any;

const HowItWorks: React.FC = () => {
  return (
    <div className="bg-white">
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-50">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Text Content */}
            <MotionDiv
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-6">
                Your AI Co-Founder for <span className="text-primary-600">Fundraising.</span>
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
                  <div className="absolute top-4 left-4 w-full h-full bg-indigo-50 rounded-3xl border border-indigo-100 transform -rotate-3 scale-95 opacity-80"></div>
                  {/* Card 1 (Front) */}
                  <div className="absolute top-8 left-0 w-full h-full bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 flex flex-col">
                     <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-primary-600">
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
                           <PieChart className="text-primary-500 mb-2" size={20} />
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
            <span className="text-primary-600 font-bold tracking-wider uppercase text-sm">How It Works</span>
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
                     <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
                     <div className="space-y-6">
                        <div className="flex gap-4 items-start">
                           <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-500">1</div>
                           <div className="space-y-2 w-full">
                              <div className="h-4 bg-slate-100 rounded w-1/3"></div>
                              <div className="h-10 bg-slate-50 border border-slate-200 rounded-lg w-full"></div>
                           </div>
                        </div>
                        <div className="flex gap-4 items-start opacity-50">
                           <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-500">2</div>
                           <div className="space-y-2 w-full">
                              <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                              <div className="h-10 bg-slate-50 border border-slate-200 rounded-lg w-full"></div>
                           </div>
                        </div>
                        
                        <div className="bg-indigo-50 p-4 rounded-lg flex items-center gap-3">
                           <Sparkles size={16} className="text-primary-600" />
                           <span className="text-sm text-primary-700 font-medium">Auto-filling from your URL...</span>
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
                     <span className="w-8 h-8 rounded-full bg-indigo-100 text-primary-600 flex items-center justify-center font-bold">1</span>
                     <span className="text-primary-600 font-bold tracking-wide uppercase text-sm">Input</span>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-4">Tell Us About Your Startup</h3>
                  <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                     Paste your website URL or answer 5 simple questions. Our engine instantly extracts context, detects your industry, and sets the stage for success.
                  </p>
                  <ul className="space-y-3">
                     {[
                        "Smart form with auto-fill",
                        "URL context extraction",
                        "Industry detection",
                        "Stage-appropriate hints"
                     ].map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-slate-700">
                           <CheckCircle2 size={18} className="text-green-500" />
                           {item}
                        </li>
                     ))}
                  </ul>
                  <div className="mt-8 inline-flex items-center gap-2 bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full text-sm font-medium">
                     <Clock size={14} /> 5 minutes
                  </div>
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
                     <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">2</span>
                     <span className="text-purple-600 font-bold tracking-wide uppercase text-sm">Generate</span>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-4">AI Generates Everything</h3>
                  <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                     Watch as our neural core weaves your inputs into a complete fundraising kit. From financial models to board-ready decks.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                     {[
                        "Pitch Deck (15 slides)",
                        "Financial Model (3-Year)",
                        "GTM Strategy Doc",
                        "Market Research Report",
                        "Competitor Analysis",
                        "Data Room Structure"
                     ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-slate-700 text-sm bg-slate-50 p-2 rounded-lg border border-slate-100">
                           <FileText size={14} className="text-purple-500" />
                           {item}
                        </div>
                     ))}
                  </div>
                  <div className="mt-8 inline-flex items-center gap-2 bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full text-sm font-medium">
                     <Clock size={14} /> Under 2 minutes
                  </div>
               </MotionDiv>
               
               <MotionDiv 
                 initial={{ opacity: 0, x: 50 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true, margin: "-100px" }}
                 className="relative h-80 flex items-center justify-center"
               >
                   <div className="absolute inset-0 bg-purple-50 rounded-full blur-3xl opacity-50"></div>
                   
                   {/* Core Orb */}
                   <div className="relative z-20 w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-lg shadow-purple-500/30 flex items-center justify-center">
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
                     <div className="flex gap-2 mb-4 px-2 pt-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                     </div>
                     <div className="bg-slate-800 rounded-xl p-6 flex gap-6">
                        {/* Sidebar */}
                        <div className="w-16 space-y-4">
                           <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center"><Layout size={20} className="text-white"/></div>
                           <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center"><FileText size={20} className="text-slate-400"/></div>
                           <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center"><Settings size={20} className="text-slate-400"/></div>
                        </div>
                        {/* Content */}
                        <div className="flex-1 space-y-4">
                           <div className="flex justify-between items-center">
                              <div className="h-6 bg-slate-700 rounded w-1/3"></div>
                              <div className="px-3 py-1 bg-primary-600 text-white text-xs rounded-md">Export PDF</div>
                           </div>
                           <div className="h-32 bg-slate-700/30 rounded-lg border-2 border-dashed border-slate-700 flex items-center justify-center text-slate-500 text-sm">
                              Slide Preview
                           </div>
                           <div className="flex gap-2">
                              <div className="h-20 w-1/3 bg-slate-700 rounded-lg"></div>
                              <div className="h-20 w-1/3 bg-slate-700 rounded-lg"></div>
                              <div className="h-20 w-1/3 bg-slate-700 rounded-lg"></div>
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
                     <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold">3</span>
                     <span className="text-teal-600 font-bold tracking-wide uppercase text-sm">Refine</span>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-4">Edit, Export, and Raise</h3>
                  <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                     Fine-tune your narrative with our intuitive editor. Use AI to rewrite sections, adjust financial assumptions, and export to any format.
                  </p>
                  <div className="flex flex-wrap gap-3">
                     <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <Download size={16} /> PDF
                     </div>
                     <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <Download size={16} /> PPTX
                     </div>
                     <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <Share2 size={16} /> Data Room Link
                     </div>
                  </div>
                  <div className="mt-8 inline-flex items-center gap-2 bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full text-sm font-medium">
                     <Clock size={14} /> Ready to send
                  </div>
               </MotionDiv>
            </div>
         </div>
      </div>

      {/* 3. PROCESS FLOW DIAGRAM */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-6">
           <div className="text-center mb-16">
              <h2 className="text-2xl md:text-3xl font-bold">Your Journey with startupAI</h2>
           </div>
           
           <div className="relative">
              {/* Connection Line */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-slate-700 -translate-y-1/2"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
                 {[
                    { icon: <Database />, label: "Input Details" },
                    { icon: <Search />, label: "AI Research" },
                    { icon: <FileText />, label: "Generation" },
                    { icon: <PenTool />, label: "Review & Edit" },
                    { icon: <Briefcase />, label: "Track Deals" },
                 ].map((step, idx) => (
                    <MotionDiv 
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex flex-col items-center text-center bg-slate-900 md:bg-transparent p-4"
                    >
                       <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-4 shadow-lg text-indigo-400">
                          {step.icon}
                       </div>
                       <div className="font-semibold text-sm tracking-wide">{step.label}</div>
                    </MotionDiv>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* 4. FEATURE GRID */}
      <section className="py-24 bg-slate-50">
         <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
               <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Everything Founders Need to Raise & Scale</h2>
               <p className="text-slate-600">A complete operating system for your startup's fundraising journey.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
               {[
                  { icon: <Layout />, title: "AI Pitch Deck Generator", desc: "Board-ready slides in minutes, not weeks.", tag: "Design" },
                  { icon: <Layers />, title: "Document Suite", desc: "10 essential docs including GTM and Financials.", tag: "Docs" },
                  { icon: <Users />, title: "Founder CRM", desc: "Track investor conversations and follow-ups.", tag: "CRM" },
                  { icon: <PieChart />, title: "Financial Tools", desc: "3-year projections modeled automatically.", tag: "Finance" },
                  { icon: <Search />, title: "Market Intelligence", desc: "Real-time data on TAM, SAM, and SOM.", tag: "Data" },
                  { icon: <Database />, title: "Secure Data Room", desc: "One link to share everything securely.", tag: "Sharing" },
               ].map((feature, idx) => (
                  <MotionDiv
                     key={idx}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all"
                  >
                     <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-primary-600">
                           {feature.icon}
                        </div>
                        <span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs font-semibold rounded uppercase">{feature.tag}</span>
                     </div>
                     <h3 className="font-bold text-slate-900 text-lg mb-2">{feature.title}</h3>
                     <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
                  </MotionDiv>
               ))}
            </div>
         </div>
      </section>

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
