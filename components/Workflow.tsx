
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, Database, Search, ArrowRight, 
  Cpu, Sparkles, FileText, BarChart3,
  Layout, CheckCircle2, Globe, Lock, TrendingUp
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

// Workaround for strict type checking issues with framer-motion in some environments
const MotionDiv = motion.div as any;

const Workflow: React.FC = () => {
  return (
    <section className="py-24 md:py-32 bg-slate-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-indigo-100/40 rounded-full blur-3xl opacity-50 mix-blend-multiply" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-purple-100/40 rounded-full blur-3xl opacity-50 mix-blend-multiply" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-24">
          <MotionDiv 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm"
          >
            <Zap size={12} fill="currentColor" />
            <span>Workflow Engine</span>
          </MotionDiv>
          
          <MotionDiv 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight leading-tight"
          >
            From chaos to clarity in <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">four simple steps</span>
          </MotionDiv>
          
          <MotionDiv 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600"
          >
            Our AI pipelines handle the heavy lifting of research, structure, and design, so you can focus on the vision.
          </MotionDiv>
        </div>

        {/* Scroll Story Container */}
        <div className="relative max-w-5xl mx-auto space-y-24 md:space-y-32">
          
          {/* Connector Line (Desktop) */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/0 via-indigo-500/20 to-indigo-500/0 hidden md:block" />

          {/* STEP 1: INGEST */}
          <StepCard 
            step="01"
            title="Context Injection"
            desc="Paste your website URL or upload rough notes. Our engine instantly extracts your value prop, market, and key metrics from any source."
            align="left"
            visual={<IngestVisual />}
          />

          {/* STEP 2: PROCESS */}
          <StepCard 
            step="02"
            title="Neural Reasoning"
            desc="Gemini 3 Pro models simulate investor questions, identifying risks, opportunities, and competitive edges in real-time."
            align="right"
            visual={<ProcessVisual />}
          />

          {/* STEP 3: GENERATE */}
          <StepCard 
            step="03"
            title="Asset Synthesis"
            desc="Generates board-ready Pitch Decks, Financial Models, and One-Pagers in your brand voice. Fully editable and exportable."
            align="left"
            visual={<GenerateVisual />}
          />

          {/* STEP 4: EXECUTE */}
          <StepCard 
            step="04"
            title="Active Execution"
            desc="Turn strategy into action. Manage investor CRM pipelines, track deal flow, and execute tasks on a smart roadmap."
            align="right"
            visual={<ExecuteVisual />}
          />

        </div>
      </div>
    </section>
  );
};

/* --- SUBCOMPONENTS --- */

const StepCard = ({ step, title, desc, align, visual }: { step: string, title: string, desc: string, align: 'left' | 'right', visual: React.ReactNode }) => {
  const isLeft = align === 'left';
  return (
    <div className={`relative flex flex-col md:flex-row items-center gap-12 md:gap-24 ${!isLeft ? 'md:flex-row-reverse' : ''}`}>
       {/* Center Dot */}
       <MotionDiv 
         initial={{ scale: 0 }}
         whileInView={{ scale: 1 }}
         viewport={{ once: true, margin: "-20%" }}
         className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-indigo-600 rounded-full border-4 border-white shadow-[0_0_0_4px_rgba(99,102,241,0.2)] hidden md:block z-20" 
       />
       
       {/* Text Side */}
       <MotionDiv 
         initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
         whileInView={{ opacity: 1, x: 0 }}
         viewport={{ once: true, margin: "-20%" }}
         transition={{ duration: 0.6, ease: "easeOut" }}
         className={`flex-1 text-center ${isLeft ? 'md:text-right' : 'md:text-left'}`}
       >
          <div className={`inline-block px-3 py-1 rounded bg-indigo-50 text-indigo-600 font-bold text-sm mb-4 border border-indigo-100 ${isLeft ? 'md:mr-0' : 'md:ml-0'}`}>Step {step}</div>
          <h3 className="text-3xl font-bold text-slate-900 mb-4">{title}</h3>
          <p className="text-slate-600 leading-relaxed text-lg">{desc}</p>
       </MotionDiv>

       {/* Visual Side */}
       <MotionDiv 
         initial={{ opacity: 0, scale: 0.9, x: isLeft ? 50 : -50 }}
         whileInView={{ opacity: 1, scale: 1, x: 0 }}
         viewport={{ once: true, margin: "-20%" }}
         transition={{ duration: 0.6, ease: "easeOut" }}
         className="flex-1 w-full"
       >
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 p-2 relative overflow-hidden group hover:border-indigo-200 transition-colors duration-500">
             <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-white/0 to-indigo-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
             <div className="relative bg-slate-50/50 rounded-xl border border-slate-100 p-6 md:p-8 aspect-[4/3] flex items-center justify-center overflow-hidden">
                {visual}
             </div>
          </div>
       </MotionDiv>
    </div>
  )
};

const IngestVisual = () => (
  <div className="relative w-full max-w-xs bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
    <div className="h-8 bg-slate-100 border-b border-slate-200 flex items-center px-3 gap-2">
      <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
      <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
      <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
      <div className="ml-auto w-24 h-4 bg-slate-200 rounded-full opacity-50"></div>
    </div>
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
        <Globe size={18} className="text-indigo-600" />
        <div className="text-xs font-medium text-indigo-900">startup.com</div>
        <div className="ml-auto">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-2 bg-slate-100 rounded w-full"></div>
        <div className="h-2 bg-slate-100 rounded w-5/6"></div>
        <div className="h-2 bg-slate-100 rounded w-4/6"></div>
      </div>
      <div className="flex gap-2 justify-center pt-2">
         <div className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-500 shadow-sm flex items-center gap-1">
            <Search size={10} /> Market
         </div>
         <div className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-500 shadow-sm flex items-center gap-1">
            <Database size={10} /> Data
         </div>
      </div>
    </div>
    
    {/* Floating Elements */}
    <MotionDiv 
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className="absolute bottom-4 right-4 bg-slate-900 text-white p-2 rounded-lg shadow-lg z-10"
    >
      <Sparkles size={16} />
    </MotionDiv>
  </div>
);

const ProcessVisual = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    {/* Orbiting Elements */}
    {[0, 120, 240].map((deg, i) => (
      <MotionDiv
        key={i}
        className="absolute w-10 h-10 bg-white rounded-xl shadow-md border border-indigo-100 flex items-center justify-center z-10"
        animate={{ 
            rotate: 360,
            x: [Math.cos(deg * Math.PI / 180) * 80, Math.cos((deg + 360) * Math.PI / 180) * 80],
            y: [Math.sin(deg * Math.PI / 180) * 80, Math.sin((deg + 360) * Math.PI / 180) * 80]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      >
         {i === 0 ? <Database size={16} className="text-blue-500"/> : i === 1 ? <Search size={16} className="text-amber-500"/> : <Lock size={16} className="text-emerald-500"/>}
      </MotionDiv>
    ))}
    
    {/* Core */}
    <div className="relative z-20 w-20 h-20 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center justify-center">
       <Cpu size={32} className="text-white animate-pulse" />
       {/* Rings */}
       <div className="absolute inset-0 border-2 border-white/20 rounded-2xl scale-110"></div>
       <div className="absolute inset-0 border border-white/10 rounded-2xl scale-125"></div>
    </div>
  </div>
);

const GenerateVisual = () => (
  <div className="relative w-full h-full flex items-center justify-center perspective-1000">
     <div className="relative w-48 h-60">
        {/* Back Cards */}
        <div className="absolute top-0 left-0 w-full h-full bg-white rounded-xl shadow-sm border border-slate-200 transform -rotate-6 translate-x-4 translate-y-2 opacity-60"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-white rounded-xl shadow-md border border-slate-200 transform -rotate-3 translate-x-2 translate-y-1 opacity-80"></div>
        
        {/* Front Card */}
        <MotionDiv 
          whileHover={{ y: -10, rotate: 0 }}
          className="absolute top-0 left-0 w-full h-full bg-white rounded-xl shadow-xl border border-slate-200 p-4 flex flex-col transition-all duration-300"
        >
           <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white mb-4">
              <Layout size={16} />
           </div>
           <div className="h-2 bg-slate-900 rounded w-3/4 mb-2"></div>
           <div className="h-2 bg-slate-100 rounded w-1/2 mb-6"></div>
           
           <div className="grid grid-cols-2 gap-2 mt-auto">
              <div className="h-16 bg-slate-50 rounded border border-slate-100"></div>
              <div className="h-16 bg-slate-50 rounded border border-slate-100"></div>
           </div>
           
           <div className="absolute top-4 right-4 text-green-500">
              <CheckCircle2 size={16} />
           </div>
        </MotionDiv>
     </div>
  </div>
);

const ExecuteVisual = () => {
  const data = [
    { name: 'Mon', value: 400 },
    { name: 'Tue', value: 300 },
    { name: 'Wed', value: 500 },
    { name: 'Thu', value: 450 },
    { name: 'Fri', value: 600 },
  ];

  return (
    <div className="w-full h-full p-2">
       <div className="bg-white rounded-xl shadow-lg border border-slate-200 w-full h-full p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
             <div className="flex items-center gap-2">
                <div className="p-1.5 bg-green-100 text-green-600 rounded-lg">
                   <TrendingUp size={16} />
                </div>
                <div className="text-sm font-bold text-slate-900">Growth</div>
             </div>
             <div className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">+12%</div>
          </div>
          
          <div className="h-40 w-full relative min-w-0">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                   <defs>
                      <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                         <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                   </defs>
                   <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorVal)" />
                </AreaChart>
             </ResponsiveContainer>
          </div>

          <div className="mt-4 flex gap-2">
             <div className="flex-1 bg-slate-50 rounded-lg p-2 border border-slate-100">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Deals</div>
                <div className="text-sm font-bold text-slate-900">14</div>
             </div>
             <div className="flex-1 bg-slate-50 rounded-lg p-2 border border-slate-100">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Tasks</div>
                <div className="text-sm font-bold text-slate-900">8</div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default Workflow;
