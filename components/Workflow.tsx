
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Sparkles, 
  Workflow as WorkflowIcon, 
  Database, 
  CheckCircle2, 
  ArrowRight, 
  Zap,
  Check
} from 'lucide-react';

const MotionDiv = motion.div as any;

const Workflow: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  // Cycle through steps for the animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 7); // 5 steps + 2 pause states for better pacing
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    { id: 1, title: 'Trigger', sub: 'On startup created', icon: <Calendar size={20} /> },
    { id: 2, title: 'AI Analysis', sub: 'Gemini analyzes data', icon: <Sparkles size={20} /> },
    { id: 3, title: 'Process', sub: 'Extract insights', icon: <WorkflowIcon size={20} /> },
    { id: 4, title: 'Action', sub: 'Generate assets', icon: <Database size={20} /> },
    { id: 5, title: 'Complete', sub: 'Saved successfully', icon: <CheckCircle2 size={20} /> },
  ];

  return (
    <section className="py-24 bg-white overflow-hidden border-y border-slate-100">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Column: Content */}
            <div className="space-y-8">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-8 bg-brand-500"></div>
                    <span className="text-xs font-bold tracking-widest text-slate-500 uppercase font-mono">
                        [ 01 / 03 ] · Automation Flow
                    </span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-[1.1]">
                    Use StartupAI with <br />
                    <span className="text-brand-500">Workflow Automation</span>
                </h2>
                
                <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
                    Connect your favorite tools and let our Gemini-powered engine handle the heavy lifting. From market research to asset generation, it's fully automated.
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                    <button className="px-6 py-3.5 bg-white text-slate-700 border border-slate-200 font-bold rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center gap-2">
                        <Zap size={18} className="text-brand-500" />
                        Explore Triggers
                    </button>
                    <button className="px-6 py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 group">
                        Start Automating
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Right Column: Visualization */}
            <div className="relative">
                {/* Background Decor */}
                <div className="absolute -inset-4 bg-gradient-to-r from-brand-50 to-orange-50 rounded-[2.5rem] blur-xl opacity-50 -z-10"></div>

                <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-8 md:p-12 relative overflow-hidden">
                    {/* Card Header */}
                    <div className="absolute top-6 left-8 bg-white border border-slate-100 shadow-sm px-3 py-1.5 rounded-full flex items-center gap-2 z-10">
                        <WorkflowIcon size={14} className="text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Workflow Automation</span>
                    </div>

                    {/* Steps Container */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8 relative min-h-[160px]">
                        {/* Connecting Line Background */}
                        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>
                        
                        {/* Animated Progress Line using Framer Motion */}
                        <MotionDiv 
                            className="hidden md:block absolute top-1/2 left-0 h-0.5 bg-brand-500 -translate-y-1/2 z-0 origin-left"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: Math.min(activeStep / 5, 1) }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                            style={{ width: '100%' }}
                        />

                        {steps.map((step, index) => {
                            const stepNumber = index + 1;
                            const isActive = stepNumber === activeStep;
                            const isCompleted = stepNumber < activeStep;

                            return (
                                <div key={step.id} className="relative z-10 flex flex-col items-center group w-full md:w-auto">
                                    <MotionDiv 
                                        className={`w-full md:w-32 h-32 bg-white rounded-2xl border-2 flex flex-col items-center justify-center gap-3 shadow-sm transition-colors duration-300 relative ${
                                            isActive || isCompleted 
                                            ? 'border-brand-500 shadow-lg shadow-brand-500/10' 
                                            : 'border-slate-100'
                                        }`}
                                        animate={{
                                            scale: isActive ? 1.15 : 1,
                                            y: isActive ? -12 : 0,
                                            borderColor: (isActive || isCompleted) ? '#FF6A3D' : '#F3F4F6'
                                        }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 15, // Lower damping for a noticeable but premium bounce
                                            mass: 1
                                        }}
                                    >
                                        {/* Status Badge */}
                                        <div className={`absolute top-2 right-2 transition-all duration-300 ${isActive || isCompleted ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
                                            <div className="bg-brand-500 text-white rounded-full p-0.5">
                                                <Check size={10} strokeWidth={4} />
                                            </div>
                                        </div>

                                        <div className={`p-3 rounded-xl transition-colors duration-300 ${
                                            isActive || isCompleted ? 'bg-brand-50 text-brand-600' : 'bg-slate-50 text-slate-400'
                                        }`}>
                                            {step.icon}
                                        </div>
                                        <div className="text-center px-2">
                                            <div className={`font-bold text-sm mb-1 transition-colors ${isActive || isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                                                {step.title}
                                            </div>
                                            <div className="text-[10px] text-slate-400 font-medium leading-tight hidden md:block">
                                                {step.sub}
                                            </div>
                                        </div>
                                    </MotionDiv>
                                </div>
                            );
                        })}
                    </div>

                    {/* Success Message Popup */}
                    <div className="h-12 mt-8 flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            {activeStep >= 5 ? (
                                <MotionDiv 
                                    key="success"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-full text-sm font-bold shadow-sm"
                                >
                                    <CheckCircle2 size={16} />
                                    Workflow completed successfully
                                </MotionDiv>
                            ) : (
                                <MotionDiv 
                                    key="processing"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center gap-2 text-slate-400 font-mono text-xs"
                                >
                                    {activeStep > 0 ? `Processing step ${activeStep} of 5...` : 'Waiting for trigger...'}
                                </MotionDiv>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </section>
  );
};

export default Workflow;
