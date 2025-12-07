import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MoreHorizontal, 
  Sparkles, 
  Image as ImageIcon, 
  AlignLeft, 
  Type, 
  Download,
  Plus,
  Search,
  FileText,
  Presentation,
  Rocket,
  BarChart4,
  Map,
  Clock,
  ChevronRight,
  Bot,
  Wand2,
  ScanEye,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ViewState = 'dashboard' | 'editor';

const Documents: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [selectedDocType, setSelectedDocType] = useState<string>('One-Pager');

  const handleStartDoc = (type: string) => {
    setSelectedDocType(type);
    setView('editor');
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
      <AnimatePresence mode="wait">
        {view === 'dashboard' ? (
          <DashboardView key="dashboard" onStartDoc={handleStartDoc} />
        ) : (
          <EditorView key="editor" docType={selectedDocType} onBack={() => setView('dashboard')} />
        )}
      </AnimatePresence>
    </div>
  );
};

// ----------------------------------------------------------------------
// SUB-COMPONENT: DASHBOARD VIEW
// ----------------------------------------------------------------------

interface DashboardViewProps {
  onStartDoc: (type: string) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ onStartDoc }) => {
  const docTemplates = [
    { title: "Pitch Deck", desc: "Secure funding with a compelling story.", icon: <Presentation size={24} className="text-indigo-600"/>, color: "bg-indigo-50" },
    { title: "One-Pager", desc: "Summarize your business in one page.", icon: <FileText size={24} className="text-pink-600"/>, color: "bg-pink-50" },
    { title: "GTM Strategy", desc: "Plan your launch and growth.", icon: <Rocket size={24} className="text-purple-600"/>, color: "bg-purple-50" },
    { title: "Market Research", desc: "Analyze competitors and opportunities.", icon: <Search size={24} className="text-teal-600"/>, color: "bg-teal-50" },
    { title: "Financial Model", desc: "Project revenue, burn rate, and profit.", icon: <BarChart4 size={24} className="text-emerald-600"/>, color: "bg-emerald-50" },
    { title: "Product Roadmap", desc: "Visualize your product’s future.", icon: <Map size={24} className="text-orange-600"/>, color: "bg-orange-50" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex-1 overflow-y-auto p-6 md:p-12 max-w-7xl mx-auto w-full space-y-12"
    >
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Startup Document Workspace</h1>
          <p className="text-slate-500 mt-2 text-lg">Generate, manage, and edit your startup assets with AI assistance.</p>
        </div>
        <div className="flex gap-3">
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors shadow-sm">
              <Search size={18} /> Search
           </button>
           <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20">
              <Plus size={18} /> New Project
           </button>
        </div>
      </div>

      {/* SECTION: START NEW DOCUMENT */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Sparkles size={20} className="text-indigo-600" />
          <h2 className="text-xl font-bold text-slate-900">Start a New Document</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {docTemplates.map((template, idx) => (
            <div 
              key={idx}
              onClick={() => onStartDoc(template.title)}
              className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${template.color} transition-transform group-hover:scale-110 duration-300`}>
                  {template.icon}
                </div>
                <div className="bg-slate-50 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <Plus size={16} className="text-slate-400" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{template.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{template.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION: AI CAPABILITIES */}
      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-6">AI Capabilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "AI Document Generator", icon: <Wand2 size={20}/>, desc: "Draft full docs from simple prompts" },
            { name: "AI Reviewer", icon: <ScanEye size={20}/>, desc: "Check for clarity and investor fit" },
            { name: "AI Insights Panel", icon: <Bot size={20}/>, desc: "Real-time contextual suggestions" }
          ].map((item, idx) => (
             <div key={idx} className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                   {item.icon}
                </div>
                <div>
                   <div className="font-bold text-slate-900 text-sm">{item.name}</div>
                   <div className="text-xs text-slate-500">{item.desc}</div>
                </div>
             </div>
          ))}
        </div>
      </section>

      {/* SECTION: USER JOURNEY FLOW */}
      <section className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
         
         <div className="relative z-10 mb-10 text-center">
            <h2 className="text-2xl font-bold mb-2">How It Works</h2>
            <p className="text-slate-400">From idea to export in minutes</p>
         </div>

         <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
            {[
               { step: "1", label: "Select Type" },
               { step: "2", label: "AI Draft" },
               { step: "3", label: "Edit & Refine" },
               { step: "4", label: "AI Polish" },
               { step: "5", label: "Export" }
            ].map((s, i) => (
               <div key={i} className="flex flex-col items-center gap-3 relative group">
                  <div className="w-12 h-12 rounded-full border-2 border-slate-700 bg-slate-800 flex items-center justify-center font-bold text-indigo-400 group-hover:border-indigo-500 group-hover:bg-indigo-500/10 transition-colors">
                     {s.step}
                  </div>
                  <span className="text-sm font-medium text-slate-300">{s.label}</span>
                  {i < 4 && (
                     <div className="hidden md:block absolute top-6 left-1/2 w-full h-0.5 bg-slate-700 -z-10"></div>
                  )}
               </div>
            ))}
         </div>
      </section>

      {/* SECTION: RECENT DOCUMENTS */}
      <section>
         <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Documents</h2>
         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {[
               { name: "Series A Pitch Deck", type: "Presentation", date: "2 hours ago", status: "Draft", score: 85 },
               { name: "Q3 Financial Projections", type: "Financial Model", date: "Yesterday", status: "Review", score: 92 },
               { name: "Competitor Analysis - Fintech", type: "Market Research", date: "3 days ago", status: "Final", score: 100 },
            ].map((doc, idx) => (
               <div key={idx} className="flex items-center justify-between p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                        {doc.type === 'Presentation' ? <Presentation size={20}/> : <FileText size={20}/>}
                     </div>
                     <div>
                        <div className="font-bold text-slate-900 text-sm">{doc.name}</div>
                        <div className="text-xs text-slate-500">{doc.type} • Edited {doc.date}</div>
                     </div>
                  </div>
                  <div className="flex items-center gap-6">
                     <div className={`px-2 py-1 rounded text-xs font-bold ${
                        doc.status === 'Draft' ? 'bg-slate-100 text-slate-600' :
                        doc.status === 'Review' ? 'bg-amber-100 text-amber-700' :
                        'bg-green-100 text-green-700'
                     }`}>
                        {doc.status}
                     </div>
                     <ChevronRight size={18} className="text-slate-400" />
                  </div>
               </div>
            ))}
         </div>
      </section>
      
      <div className="h-12"></div>
    </motion.div>
  );
};

// ----------------------------------------------------------------------
// SUB-COMPONENT: EDITOR VIEW
// ----------------------------------------------------------------------

interface EditorViewProps {
  docType: string;
  onBack: () => void;
}

const EditorView: React.FC<EditorViewProps> = ({ docType, onBack }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-full"
    >
      {/* TOOLBAR */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0 shadow-sm z-10">
         <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
               <ArrowLeft size={20} />
            </button>
            <div>
               <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-slate-900">Untitled {docType}</h2>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] uppercase font-bold rounded">Draft</span>
               </div>
               <p className="text-xs text-slate-500">Last edited just now</p>
            </div>
         </div>
         <div className="flex items-center gap-3">
             <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                <button className="p-1.5 bg-white shadow-sm rounded text-slate-700"><AlignLeft size={16}/></button>
                <button className="p-1.5 text-slate-500 hover:text-slate-700"><Type size={16}/></button>
                <button className="p-1.5 text-slate-500 hover:text-slate-700"><ImageIcon size={16}/></button>
             </div>
             <div className="h-6 w-px bg-slate-200"></div>
             <button className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 shadow-sm">
                <Download size={16} /> Export
             </button>
             <button className="text-slate-400 hover:text-slate-700">
                <MoreHorizontal size={20} />
             </button>
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         {/* LEFT SIDEBAR: SECTIONS */}
         <div className="w-64 bg-white border-r border-slate-200 flex flex-col hidden lg:flex">
             <div className="p-4 border-b border-slate-100">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Sections</h3>
                <button className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-sm text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2">
                   <Plus size={14} /> Add Section
                </button>
             </div>
             <div className="flex-1 overflow-y-auto p-2 space-y-1">
                 {[
                    { title: "Introduction", active: false },
                    { title: "Problem", active: true },
                    { title: "Solution", active: false },
                    { title: "Market Size", active: false },
                    { title: "Business Model", active: false },
                    { title: "Go-to-Market", active: false },
                    { title: "Team", active: false },
                 ].map((section, idx) => (
                    <div 
                        key={idx} 
                        className={`px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer flex items-center justify-between group ${section.active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                       <span className="truncate">{idx + 1}. {section.title}</span>
                       {section.active && <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>}
                    </div>
                 ))}
             </div>
         </div>

         {/* CENTER: EDITOR CANVAS */}
         <div className="flex-1 bg-slate-100 overflow-y-auto p-4 md:p-8 flex justify-center">
             <div className="w-full max-w-3xl bg-white rounded-xl shadow-sm min-h-[800px] p-8 md:p-12 relative group animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* AI Overlay Button */}
                <div className="absolute top-12 right-12 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-indigo-200 text-indigo-600 rounded-full shadow-lg text-sm font-medium hover:scale-105 transition-transform">
                       <Sparkles size={14} /> AI Assist
                    </button>
                </div>

                <h1 className="text-4xl font-bold text-slate-900 mb-6 outline-none hover:bg-slate-50 focus:bg-transparent rounded px-2 -ml-2" contentEditable suppressContentEditableWarning>The Problem</h1>
                
                <div className="prose prose-slate max-w-none text-lg text-slate-600">
                   <p className="mb-6 outline-none hover:bg-slate-50 focus:bg-transparent rounded px-2 -ml-2 p-1" contentEditable suppressContentEditableWarning>
                      Startups struggle to create high-quality documents efficiently. The process is fragmented across multiple tools (Word, Excel, PowerPoint), leading to version control issues and wasted time.
                   </p>
                   
                   <p className="mb-6 outline-none hover:bg-slate-50 focus:bg-transparent rounded px-2 -ml-2 p-1" contentEditable suppressContentEditableWarning>
                      Founders spend an average of <span className="text-indigo-600 font-semibold bg-indigo-50 px-1 rounded">60+ hours</span> on fundraising prep instead of building their product.
                   </p>

                   <div className="bg-slate-50 rounded-xl border border-slate-200 p-8 mb-8 flex flex-col items-center justify-center text-slate-400 gap-3 hover:bg-slate-100 transition-colors cursor-pointer border-dashed">
                      <div className="p-3 bg-white rounded-full shadow-sm">
                         <ImageIcon size={24} className="text-slate-400" />
                      </div>
                      <span className="text-sm font-medium">Add Chart or Image</span>
                   </div>

                   <h3 className="text-xl font-bold text-slate-800 mb-4" contentEditable suppressContentEditableWarning>Key Pain Points</h3>
                   <ul className="list-disc pl-5 space-y-2">
                      <li contentEditable suppressContentEditableWarning>Lack of professional formatting</li>
                      <li contentEditable suppressContentEditableWarning>Difficulty finding reliable market data</li>
                      <li contentEditable suppressContentEditableWarning>Inconsistent narrative across documents</li>
                   </ul>
                </div>
             </div>
         </div>

         {/* RIGHT: AI PANEL */}
         <div className="w-80 bg-white border-l border-slate-200 hidden xl:flex flex-col">
             <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-indigo-50/50 to-white">
                <div className="flex items-center gap-2 text-indigo-700 font-bold">
                   <Bot size={18} />
                   <span>AI Companion</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Powered by Gemini 2.5 Flash</p>
             </div>
             
             <div className="p-4 space-y-6 flex-1 overflow-y-auto">
                {/* Block 1: Draft */}
                <div>
                   <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Rewrite & Draft</h4>
                   <button className="w-full flex items-center justify-center gap-2 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 shadow-md shadow-indigo-600/20 mb-3 transition-colors">
                      <Sparkles size={14} /> Auto-Generate Draft
                   </button>
                   <div className="grid grid-cols-2 gap-2">
                      <button className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-colors">
                         Make Clearer
                      </button>
                      <button className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-colors">
                         Fix Grammar
                      </button>
                   </div>
                </div>

                {/* Block 2: Context */}
                <div>
                   <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Research & Context</h4>
                   <div className="p-3 rounded-lg border border-slate-200 bg-white shadow-sm space-y-3">
                      <div className="flex items-start gap-3">
                         <Search size={16} className="text-slate-400 mt-1"/>
                         <p className="text-xs text-slate-600">Validate "60+ hours" claim against industry reports.</p>
                      </div>
                      <button className="w-full py-1.5 text-xs text-indigo-600 font-medium bg-indigo-50 rounded hover:bg-indigo-100 transition-colors">
                         Check Market Risks
                      </button>
                   </div>
                </div>

                {/* Block 3: Polish */}
                <div>
                   <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Polish</h4>
                   <div className="p-3 rounded-lg border border-indigo-100 bg-indigo-50/50">
                      <div className="flex gap-2 items-start mb-2">
                         <Sparkles size={14} className="text-indigo-600 mt-0.5" />
                         <span className="text-xs font-bold text-indigo-900">Investor-Ready Score: 78/100</span>
                      </div>
                      <p className="text-xs text-slate-600 mb-2">Narrative is strong but lacks quantitative backing in the "Solution" section.</p>
                      <button className="w-full py-1.5 text-xs bg-white border border-indigo-200 text-indigo-700 font-medium rounded hover:bg-indigo-50 transition-colors">
                         Apply Polish
                      </button>
                   </div>
                </div>
             </div>
         </div>
      </div>
    </motion.div>
  );
};

export default Documents;