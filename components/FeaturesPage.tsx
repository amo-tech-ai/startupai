
import React from 'react';
import { PenTool, BrainCircuit, BarChart2, Workflow, Database, Target, Layout, ShieldCheck } from 'lucide-react';

const FeaturesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">The Operating System for Founders</h1>
            <p className="text-xl text-slate-600 leading-relaxed">
            StartupAI consolidates the fragmented toolstack of modern founders into one intelligent, cohesive platform.
            </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Feature 1: Decks */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:shadow-lg transition-all flex flex-col md:flex-row gap-6 items-start">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center shrink-0 text-indigo-600">
                    <PenTool size={32}/>
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">AI Pitch Deck Generator</h3>
                    <p className="text-slate-600 mb-4 leading-relaxed">
                        Create Sequoia-standard pitch decks in minutes. Our AI analyzes your business model and generates slide content, selects charts, and drafts speaker notes automatically.
                    </p>
                    <ul className="space-y-2">
                        <li className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> Export to PDF & PPTX
                        </li>
                        <li className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> AI-Generated Visuals
                        </li>
                    </ul>
                </div>
            </div>

            {/* Feature 2: CRM */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:shadow-lg transition-all flex flex-col md:flex-row gap-6 items-start">
                <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center shrink-0 text-purple-600">
                    <Workflow size={32}/>
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">Intelligent CRM</h3>
                    <p className="text-slate-600 mb-4 leading-relaxed">
                        Manage your fundraising pipeline and sales deals with a Kanban board designed for speed. Track probability, owner, and next actions with zero friction.
                    </p>
                    <ul className="space-y-2">
                        <li className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div> Visual Pipeline
                        </li>
                        <li className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div> Deal Forecasting
                        </li>
                    </ul>
                </div>
            </div>

            {/* Feature 3: Documents */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:shadow-lg transition-all flex flex-col md:flex-row gap-6 items-start">
                <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center shrink-0 text-teal-600">
                    <Layout size={32}/>
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">AI Document Writer</h3>
                    <p className="text-slate-600 mb-4 leading-relaxed">
                        Draft Investment Memos, One-Pagers, and GTM Strategies instantly. Our "AI Companion" side-panel helps refine, expand, or simplify text on the fly.
                    </p>
                    <ul className="space-y-2">
                        <li className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                            <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div> Context-Aware Drafting
                        </li>
                        <li className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                            <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div> One-Click Refinement
                        </li>
                    </ul>
                </div>
            </div>

            {/* Feature 4: Market Data */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:shadow-lg transition-all flex flex-col md:flex-row gap-6 items-start">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0 text-blue-600">
                    <Database size={32}/>
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">Market Intelligence</h3>
                    <p className="text-slate-600 mb-4 leading-relaxed">
                        Powered by Gemini 3, our engine performs real-time web searches to validate your TAM, identify competitors, and find industry valuation multiples.
                    </p>
                    <ul className="space-y-2">
                        <li className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Real-Time Search Grounding
                        </li>
                        <li className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Competitor Analysis
                        </li>
                    </ul>
                </div>
            </div>

            {/* Feature 5: Task Management */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:shadow-lg transition-all flex flex-col md:flex-row gap-6 items-start">
                <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center shrink-0 text-rose-600">
                    <Target size={32}/>
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">Strategic Auto-Pilot</h3>
                    <p className="text-slate-600 mb-4 leading-relaxed">
                        Don't know what to do next? Our AI analyzes your stage and generates a tailored roadmap of high-priority tasks to move the needle.
                    </p>
                    <ul className="space-y-2">
                        <li className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div> AI Roadmap Generation
                        </li>
                        <li className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div> Priority Scoring
                        </li>
                    </ul>
                </div>
            </div>

            {/* Feature 6: Security */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:shadow-lg transition-all flex flex-col md:flex-row gap-6 items-start">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0 text-emerald-600">
                    <ShieldCheck size={32}/>
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">Secure & Private</h3>
                    <p className="text-slate-600 mb-4 leading-relaxed">
                        Your proprietary data is safe. We use enterprise-grade encryption and Row Level Security to ensure your startup secrets stay secret.
                    </p>
                    <ul className="space-y-2">
                        <li className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> RLS Architecture
                        </li>
                        <li className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Encrypted Storage
                        </li>
                    </ul>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
