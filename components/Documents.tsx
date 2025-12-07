
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
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
  ChevronRight,
  Bot,
  Wand2,
  ScanEye,
  Loader2,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';
import { GoogleGenAI } from "@google/genai";
import { API_KEY } from '../lib/env';
import { DocSection, InvestorDoc } from '../types';
import { useToast } from '../context/ToastContext';

type ViewState = 'dashboard' | 'editor';

const Documents: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const { docs, addDoc } = useData();
  const { toast } = useToast();

  const handleStartDoc = async (type: string) => {
    // Create new document in DB
    const newTitle = `Untitled ${type}`;
    const id = await addDoc({
        title: newTitle,
        type: type as any,
        status: 'Draft',
        content: { sections: [] }
    });
    
    if (id) {
        setActiveDocId(id);
        setView('editor');
    }
  };

  const handleOpenDoc = (id: string) => {
      setActiveDocId(id);
      setView('editor');
  }

  // Find the active document object
  const activeDoc = docs.find(d => d.id === activeDocId);

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
      <AnimatePresence mode="wait">
        {view === 'dashboard' ? (
          <DashboardView key="dashboard" onStartDoc={handleStartDoc} onOpenDoc={handleOpenDoc} />
        ) : (
          activeDoc ? (
            <EditorView key="editor" doc={activeDoc} onBack={() => setView('dashboard')} />
          ) : (
            <div className="flex items-center justify-center h-full">Document not found.</div>
          )
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
  onOpenDoc: (id: string) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ onStartDoc, onOpenDoc }) => {
  const { docs, deleteDoc } = useData();
  
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

      {/* SECTION: RECENT DOCUMENTS */}
      <section>
         <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Documents</h2>
         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[200px]">
            {docs.length === 0 ? (
                <div className="flex items-center justify-center h-48 text-slate-400 text-sm italic">
                    No documents created yet. Start one above.
                </div>
            ) : (
                docs.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4" onClick={() => onOpenDoc(doc.id)}>
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                            {doc.type === 'Pitch Deck' ? <Presentation size={20}/> : <FileText size={20}/>}
                        </div>
                        <div>
                            <div className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">{doc.title}</div>
                            <div className="text-xs text-slate-500">{doc.type} • Edited {new Date(doc.updatedAt).toLocaleDateString()}</div>
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
                        <button 
                            onClick={(e) => { e.stopPropagation(); deleteDoc(doc.id); }}
                            className="text-slate-300 hover:text-red-500 p-2 rounded-full hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                        >
                            <Trash2 size={16} />
                        </button>
                        <ChevronRight size={18} className="text-slate-400" />
                    </div>
                </div>
                ))
            )}
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
  doc: InvestorDoc;
  onBack: () => void;
}

const EditorView: React.FC<EditorViewProps> = ({ doc, onBack }) => {
  const { profile, updateDoc } = useData();
  const { success, error: toastError } = useToast();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string>('1');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');

  // Local state for immediate editing
  const [title, setTitle] = useState(doc.title);
  const [sections, setSections] = useState<DocSection[]>(doc.content.sections.length > 0 ? doc.content.sections : [
      { id: '1', title: 'Introduction', content: '<p>Start typing...</p>' }
  ]);

  // Debounced Save
  useEffect(() => {
      // Check for changes
      const hasChanged = title !== doc.title || JSON.stringify(sections) !== JSON.stringify(doc.content.sections);
      
      if (hasChanged) {
          setSaveStatus('saving');
          const timer = setTimeout(() => {
              updateDoc(doc.id, { 
                  title, 
                  content: { sections } 
              });
              setSaveStatus('saved');
          }, 1000);
          return () => clearTimeout(timer);
      }
  }, [title, sections, doc.id, doc.title, doc.content.sections, updateDoc]);

  // --- AI GENERATION LOGIC ---
  const generateDocument = async () => {
    if (!profile) {
        toastError("No startup profile found. Please complete onboarding.");
        return;
    }
    if (!API_KEY) {
        toastError("API Key missing");
        return;
    }

    setIsGenerating(true);

    try {
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        
        const context = `
            Startup Name: ${profile.name}
            Tagline: ${profile.tagline}
            Mission: ${profile.mission}
            Problem: ${profile.problemStatement}
            Solution: ${profile.solutionStatement}
            Target Market: ${profile.targetMarket}
            Business Model: ${profile.businessModel}
        `;

        const prompt = `
            You are a professional venture capital analyst and startup writer.
            Task: Write a full ${doc.type} for the startup described below.
            
            Context:
            ${context}

            Requirements:
            1. Create 4-6 distinct sections appropriate for a ${doc.type}.
            2. For "Pitch Deck", use sections like: Problem, Solution, Market, Business Model, Team.
            3. For "One-Pager", use sections like: Executive Summary, Market Opportunity, Traction, Ask.
            4. Return the content as a valid JSON object containing an array of sections.
            5. Each section object must have: "title" (string) and "content" (string, HTML formatted paragraphs/lists).

            Output format:
            {
                "sections": [
                    { "title": "Section Name", "content": "<p>Content...</p>" }
                ]
            }
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });

        const text = response.text;
        if (text) {
            const data = JSON.parse(text);
            if (data.sections && Array.isArray(data.sections)) {
                const newSections = data.sections.map((s: any, idx: number) => ({
                    id: String(idx + 1),
                    title: s.title,
                    content: s.content
                }));
                setSections(newSections);
                setActiveSectionId('1');
                success("Document draft generated!");
            }
        }
    } catch (error) {
        console.error("Doc Generation Error:", error);
        toastError("Failed to generate document. Please try again.");
    } finally {
        setIsGenerating(false);
    }
  };

  const updateSectionContent = (id: string, newContent: string) => {
      setSections(prev => prev.map(s => s.id === id ? { ...s, content: newContent } : s));
  }

  const updateSectionTitle = (id: string, newTitle: string) => {
      setSections(prev => prev.map(s => s.id === id ? { ...s, title: newTitle } : s));
  }

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
                  <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-sm font-bold text-slate-900 bg-transparent border-none focus:ring-0 p-0 hover:text-indigo-600 transition-colors w-64"
                  />
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] uppercase font-bold rounded">{doc.status}</span>
               </div>
               <div className="flex items-center gap-2">
                   <p className="text-xs text-slate-500">{doc.type}</p>
                   {saveStatus === 'saving' && <span className="text-[10px] text-slate-400 flex items-center gap-1"><Loader2 size={8} className="animate-spin"/> Saving...</span>}
               </div>
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
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         {/* LEFT SIDEBAR: SECTIONS */}
         <div className="w-64 bg-white border-r border-slate-200 flex flex-col hidden lg:flex shrink-0">
             <div className="p-4 border-b border-slate-100">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Sections</h3>
                <button 
                    onClick={() => setSections([...sections, { id: Date.now().toString(), title: 'New Section', content: '' }])}
                    className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-sm text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
                >
                   <Plus size={14} /> Add Section
                </button>
             </div>
             <div className="flex-1 overflow-y-auto p-2 space-y-1">
                 {sections.map((section, idx) => (
                    <div 
                        key={section.id} 
                        onClick={() => setActiveSectionId(section.id)}
                        className={`px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer flex items-center justify-between group transition-colors ${
                            activeSectionId === section.id 
                            ? 'bg-indigo-50 text-indigo-700' 
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                       <span className="truncate">{idx + 1}. {section.title}</span>
                       {activeSectionId === section.id && <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>}
                    </div>
                 ))}
             </div>
         </div>

         {/* CENTER: EDITOR CANVAS */}
         <div className="flex-1 bg-slate-100 overflow-y-auto p-4 md:p-8 flex justify-center">
             <div className="w-full max-w-3xl bg-white rounded-xl shadow-sm min-h-[800px] p-8 md:p-12 relative group animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {isGenerating && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
                        <Loader2 size={48} className="text-indigo-600 animate-spin mb-4" />
                        <h3 className="text-xl font-bold text-slate-900">Generating {doc.type}...</h3>
                        <p className="text-slate-500">Consulting Gemini 3...</p>
                    </div>
                )}

                {/* Render Sections */}
                {sections.map((section) => (
                    <div key={section.id} className="mb-12 group/section">
                        <input 
                            value={section.title}
                            onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                            className="text-2xl font-bold text-slate-900 mb-4 outline-none border-b border-transparent hover:border-slate-200 pb-1 w-full" 
                        />
                        
                        <div 
                            className="prose prose-slate max-w-none text-lg text-slate-600 outline-none p-2 rounded hover:bg-slate-50/50 focus:bg-white"
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => updateSectionContent(section.id, e.currentTarget.innerHTML)}
                            dangerouslySetInnerHTML={{ __html: section.content }}
                        />
                    </div>
                ))}
                
                {sections.length === 0 && (
                    <div className="text-center py-20 text-slate-400">
                        <Sparkles size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No content yet. Use the AI Companion to generate a draft.</p>
                    </div>
                )}

             </div>
         </div>

         {/* RIGHT: AI PANEL */}
         <div className="w-80 bg-white border-l border-slate-200 hidden xl:flex flex-col shrink-0">
             <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-indigo-50/50 to-white">
                <div className="flex items-center gap-2 text-indigo-700 font-bold">
                   <Bot size={18} />
                   <span>AI Companion</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Powered by Gemini 3 Pro</p>
             </div>
             
             <div className="p-4 space-y-6 flex-1 overflow-y-auto">
                {/* Block 1: Draft */}
                <div>
                   <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Drafting</h4>
                   <button 
                      onClick={generateDocument}
                      disabled={isGenerating}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 shadow-md shadow-indigo-600/20 mb-3 transition-colors disabled:opacity-50"
                   >
                      {isGenerating ? <Loader2 size={14} className="animate-spin"/> : <Sparkles size={14} />}
                      {isGenerating ? 'Drafting...' : `Auto-Generate ${doc.type}`}
                   </button>
                   <p className="text-xs text-slate-400 leading-relaxed text-center">
                       Uses your profile data ({profile?.name}) to create a structured draft instantly.
                   </p>
                </div>

                {/* Block 2: Refine */}
                <div>
                   <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Refinement Tools</h4>
                   <div className="grid grid-cols-2 gap-2">
                      <button className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-colors">
                         Make Clearer
                      </button>
                      <button className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-colors">
                         Expand
                      </button>
                      <button className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-colors">
                         Shorten
                      </button>
                      <button className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-colors">
                         Fix Grammar
                      </button>
                   </div>
                </div>

                {/* Block 3: Context */}
                <div>
                   <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Context Aware</h4>
                   <div className="p-3 rounded-lg border border-slate-200 bg-white shadow-sm space-y-3">
                      <div className="flex items-start gap-3">
                         <ScanEye size={16} className="text-slate-400 mt-1"/>
                         <p className="text-xs text-slate-600">
                             Based on your metrics, you should emphasize your <strong>${profile?.fundingGoal?.toLocaleString()}</strong> funding goal in the "Ask" section.
                         </p>
                      </div>
                   </div>
                </div>
             </div>
         </div>
      </div>
    </motion.div>
  );
};

export default Documents;
