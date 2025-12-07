import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  FileText, 
  CheckSquare, 
  Briefcase, 
  Plus, 
  UserPlus, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Search,
  Database,
  PenTool,
  Download,
  Activity,
  Loader2,
  RefreshCw,
  Trophy,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer, 
  BarChart, 
  Bar
} from 'recharts';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import { GoogleGenAI } from "@google/genai";
import { AICoachInsight, StartupProfile } from '../types';
import { API_KEY } from '../lib/env';

const Dashboard: React.FC = () => {
  const { profile, metrics, insights, activities, setInsights, addActivity } = useData();
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [profileStrength, setProfileStrength] = useState(0);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  // Derived Values
  const startupName = profile?.name || "My Startup";
  const mrr = metrics[0]?.mrr || 0;
  const activeUsers = metrics[0]?.activeUsers || 0;
  const fundingGoal = profile?.fundingGoal || 1000000;
  
  // Calculate Progress towards funding
  const raisedAmount = 150000; 
  const fundingProgress = Math.min((raisedAmount / fundingGoal) * 100, 100);

  // --- Profile Strength Logic ---
  useEffect(() => {
    if (!profile) return;

    const calculateStrength = (p: StartupProfile) => {
        let score = 0;
        const missing: string[] = [];

        // Weighting: Core Basics (40%)
        if (p.name) score += 10; else missing.push("Company Name");
        if (p.stage) score += 10; else missing.push("Stage");
        if (p.tagline) score += 10; else missing.push("Tagline");
        if (p.websiteUrl) score += 10; else missing.push("Website URL");

        // Weighting: Strategic Narrative (40%)
        if (p.problemStatement && p.problemStatement.length > 20) score += 15; else missing.push("Problem Statement");
        if (p.solutionStatement && p.solutionStatement.length > 20) score += 15; else missing.push("Solution Statement");
        if (p.targetMarket) score += 10; else missing.push("Target Market");

        // Weighting: Financials & Biz Model (20%)
        if (p.businessModel) score += 10; else missing.push("Business Model");
        if (p.fundingGoal > 0) score += 10; else missing.push("Funding Goal");

        return { score: Math.min(score, 100), missing };
    };

    const result = calculateStrength(profile);
    setProfileStrength(result.score);
    setMissingFields(result.missing);
  }, [profile]);

  // Dynamic Chart Data Generation
  const generateChartData = (currentValue: number, points: number = 7) => {
    if (currentValue === 0) return Array(points).fill({ v: 0 });
    
    return Array.from({ length: points }, (_, i) => {
      const reverseIndex = points - 1 - i;
      const volatility = Math.random() * 0.1 - 0.05; 
      const trendFactor = 1 - (reverseIndex * 0.1); 
      let val = currentValue * trendFactor * (1 + volatility);
      return { v: Math.max(0, val) };
    });
  };

  const mrrData = generateChartData(mrr);
  const usersData = generateChartData(activeUsers);

  // Time formatter
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  // --- AI COACH LOGIC ---
  const refreshInsights = async () => {
    if (!profile || !API_KEY) {
        if (!API_KEY) alert("API Key missing");
        return;
    }

    setIsGeneratingInsights(true);

    try {
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        
        const context = `
            Startup: ${profile.name}
            Stage: ${profile.stage}
            Tagline: ${profile.tagline}
            Problem: ${profile.problemStatement}
            Solution: ${profile.solutionStatement}
            Funding Goal: $${profile.fundingGoal}
            MRR: $${mrr}
            Active Users: ${activeUsers}
        `;

        const prompt = `
            You are a Y Combinator-level startup coach. Analyze the following startup context and provide 3 high-impact strategic insights.
            
            Context:
            ${context}

            Requirements:
            1. One 'Risk' (What could go wrong?)
            2. One 'Opportunity' (What is a low-hanging fruit?)
            3. One 'Action' (What should they do today?)
            
            Return ONLY a valid JSON array of objects with this schema:
            [
                {
                    "category": "Growth" | "Fundraising" | "Product" | "Finance",
                    "type": "Risk" | "Opportunity" | "Action",
                    "title": "Short punchy title (max 5 words)",
                    "description": "Clear explanation (max 15 words)",
                    "priority": "High" | "Medium" | "Low"
                }
            ]
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });

        const text = response.text;
        if (text) {
            const rawInsights = JSON.parse(text);
            const newInsights: AICoachInsight[] = rawInsights.map((i: any) => ({
                id: Math.random().toString(36).substr(2, 9),
                startupId: profile.id,
                category: i.category,
                type: i.type,
                title: i.title,
                description: i.description,
                priority: i.priority,
                status: 'New',
                generatedAt: new Date().toISOString()
            }));

            setInsights(newInsights);
            addActivity({
                type: 'system',
                title: 'AI Coach Analysis',
                description: 'Generated new strategic insights.'
            });
        }
    } catch (error) {
        console.error("AI Coach Error:", error);
        alert("Failed to generate insights. Please try again.");
    } finally {
        setIsGeneratingInsights(false);
    }
  };

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
      
      {/* 4️⃣ WELCOME SECTION */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <div className="flex items-center gap-2 mb-1">
             <h1 className="text-3xl font-bold text-slate-900">Good morning, {startupName} team 👋</h1>
             {profile?.stage && <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded uppercase">{profile.stage}</span>}
           </div>
           <p className="text-slate-500 flex items-center gap-2">
             <span>{profile?.tagline || "Ready to build something great?"}</span>
           </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
           <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all">
              <Plus size={18} /> New Deck
           </button>
           <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-lg font-medium hover:bg-slate-50 transition-colors">
              <UserPlus size={18} /> Add Contact
           </button>
           <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-lg font-medium hover:bg-slate-50 transition-colors">
              <FileText size={18} /> Create Doc
           </button>
        </div>
      </section>

      {/* 5️⃣ KPI CARDS ROW */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {/* Card 1 */}
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
               <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <FileText size={20} />
               </div>
               <div className="flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">
                  <ArrowUpRight size={12} /> +3 this week
               </div>
            </div>
            <div className="mb-4">
               <div className="text-slate-500 text-sm font-medium mb-1">Monthly Revenue</div>
               <div className="text-3xl font-bold text-slate-900">${mrr.toLocaleString()}</div>
            </div>
            <div className="h-10 w-full opacity-50">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mrrData}>
                     <Area type="monotone" dataKey="v" stroke="#4f46e5" fill="#e0e7ff" strokeWidth={2} />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Card 2 */}
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
             <div className="flex justify-between items-start mb-4">
               <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                  <Briefcase size={20} />
               </div>
               <div className="flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">
                  <ArrowUpRight size={12} /> +12%
               </div>
            </div>
            <div className="mb-4">
               <div className="text-slate-500 text-sm font-medium mb-1">Funding Target</div>
               <div className="text-3xl font-bold text-slate-900">${fundingGoal.toLocaleString()}</div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2 overflow-hidden">
               <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${fundingProgress}%` }}></div>
            </div>
            <div className="text-xs text-slate-400">Raised: ${raisedAmount.toLocaleString()}</div>
         </div>

         {/* Card 3 */}
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
             <div className="flex justify-between items-start mb-4">
               <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
                  <CheckSquare size={20} />
               </div>
               <div className="flex items-center gap-1 text-slate-500 text-xs font-medium bg-slate-50 px-2 py-1 rounded-full">
                  4 Urgent
               </div>
            </div>
             <div className="mb-4">
               <div className="text-slate-500 text-sm font-medium mb-1">Active Users</div>
               <div className="text-3xl font-bold text-slate-900">{activeUsers.toLocaleString()}</div>
            </div>
            <div className="h-10 w-full opacity-50">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={usersData}>
                     <Bar dataKey="v" fill="#2dd4bf" radius={[2, 2, 0, 0]} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Card 4 */}
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
             <div className="flex justify-between items-start mb-4">
               <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                  <BarChart3 size={20} />
               </div>
                <div className="flex items-center gap-1 text-rose-500 text-xs font-bold bg-rose-50 px-2 py-1 rounded-full">
                  <ArrowDownRight size={12} /> -2%
               </div>
            </div>
             <div className="mb-4">
               <div className="text-slate-500 text-sm font-medium mb-1">Docs Generated</div>
               <div className="text-3xl font-bold text-slate-900">12</div>
            </div>
            <div className="h-10 w-full opacity-50">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mrrData}>
                     <Bar dataKey="v" fill="#fb7185" radius={[2, 2, 0, 0]} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>
      </section>

      {/* 6️⃣ GRID: ACTIVITY & AI INSIGHTS */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-8">
         {/* Recent Activity (60% -> 3 cols) */}
         <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
               <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
               <button className="text-sm text-indigo-600 font-medium hover:underline">View All</button>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
               {activities.length > 0 ? (
                 activities.map((item, idx) => {
                    let icon = <Activity size={16} />;
                    let bg = "bg-slate-50";
                    let text = "text-slate-600";

                    if (item.type === 'milestone') { icon = <Sparkles size={16} />; bg = "bg-amber-50"; text="text-amber-600"; }
                    else if (item.type === 'update') { icon = <FileText size={16} />; bg = "bg-indigo-50"; text="text-indigo-600"; }
                    else if (item.type === 'alert') { icon = <Clock size={16} />; bg = "bg-rose-50"; text="text-rose-600"; }
                    else if (item.type === 'system') { icon = <CheckSquare size={16} />; bg = "bg-green-50"; text="text-green-600"; }

                    return (
                        <div key={item.id} className="p-4 flex items-center gap-4 hover:bg-slate-50/80 transition-colors group cursor-pointer">
                           <div className={`p-2 rounded-lg ${bg} ${text}`}>
                              {icon}
                           </div>
                           <div className="flex-1">
                              <div className="text-sm font-bold text-slate-900">{item.title}</div>
                              <div className="text-xs text-slate-500">{item.description}</div>
                           </div>
                           <div className="text-xs text-slate-400 whitespace-nowrap">{formatTime(item.timestamp)}</div>
                           <ChevronRight size={16} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    );
                 })
               ) : (
                 <div className="p-8 text-center text-slate-400 text-sm">No recent activity</div>
               )}
            </div>
         </div>

         {/* Right Column: Profile Score & AI Coach (40% -> 2 cols) */}
         <div className="lg:col-span-2 space-y-6">
            
            {/* Profile Strength Widget */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Trophy size={18} className="text-amber-500" />
                            <h3 className="font-bold text-slate-900">Profile Health</h3>
                        </div>
                        <p className="text-xs text-slate-500">Completeness Score</p>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{profileStrength}%</div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-4">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${profileStrength}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full rounded-full ${
                            profileStrength < 50 ? 'bg-red-500' : 
                            profileStrength < 80 ? 'bg-amber-500' : 'bg-green-500'
                        }`}
                    />
                </div>

                {/* Missing Items */}
                <div className="space-y-2">
                    {missingFields.length > 0 ? (
                        missingFields.slice(0, 2).map((field, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                <AlertTriangle size={12} className="text-amber-500" />
                                <span>Add <strong>{field}</strong> to improve score</span>
                                <ArrowRight size={12} className="ml-auto text-slate-400" />
                            </div>
                        ))
                    ) : (
                        <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 p-2 rounded-lg border border-green-100">
                            <Sparkles size={12} />
                            <span>All Star Profile! You are ready to raise.</span>
                        </div>
                    )}
                </div>
            </div>

            {/* AI Coach */}
            <div>
                <div className="flex items-center justify-between mb-3">
                   <div className="flex items-center gap-2">
                      <Sparkles size={18} className="text-purple-600" />
                      <h3 className="text-lg font-bold text-slate-900">AI Coach</h3>
                   </div>
                   <button 
                      onClick={refreshInsights}
                      disabled={isGeneratingInsights}
                      className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors disabled:opacity-50"
                      title="Refresh Insights"
                   >
                      <RefreshCw size={16} className={isGeneratingInsights ? "animate-spin" : ""} />
                   </button>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-1">
                   <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 space-y-6 min-h-[300px]">
                      {isGeneratingInsights ? (
                         <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-3">
                            <Loader2 size={24} className="animate-spin text-purple-600" />
                            <span className="text-sm">Analyzing startup metrics...</span>
                         </div>
                      ) : insights.length > 0 ? (
                        insights.map((insight) => (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={insight.id} 
                            className="flex gap-4 p-3 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-purple-100 hover:shadow-sm"
                          >
                              <div className="mt-1 shrink-0">
                                  <span className={`flex h-2.5 w-2.5 rounded-full ${
                                     insight.type === 'Risk' ? 'bg-rose-500 shadow-rose-500/50' :
                                     insight.type === 'Opportunity' ? 'bg-emerald-500 shadow-emerald-500/50' : 
                                     'bg-indigo-500 shadow-indigo-500/50'
                                  } shadow-[0_0_8px_rgba(0,0,0,0.3)]`}></span>
                              </div>
                              <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                     <span className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${
                                        insight.type === 'Risk' ? 'bg-rose-100 text-rose-700' :
                                        insight.type === 'Opportunity' ? 'bg-emerald-100 text-emerald-700' : 
                                        'bg-indigo-100 text-indigo-700'
                                     }`}>
                                        {insight.type}
                                     </span>
                                     <span className="text-sm font-bold text-slate-900">{insight.title}</span>
                                  </div>
                                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                    {insight.description}
                                  </p>
                                  <button className="text-xs mt-2 bg-white border border-slate-200 shadow-sm px-3 py-1.5 rounded-md font-medium text-slate-700 hover:text-indigo-600 hover:border-indigo-200 transition-colors">
                                    View Action Plan
                                  </button>
                              </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-3">
                           <Sparkles size={32} className="text-slate-300" />
                           <p className="text-sm text-center">No insights yet.<br/>Click refresh to analyze your data.</p>
                           <button onClick={refreshInsights} className="text-xs text-indigo-600 font-bold hover:underline">Generate Now</button>
                        </div>
                      )}
                   </div>
                   <button 
                      onClick={refreshInsights}
                      disabled={isGeneratingInsights}
                      className="w-full py-3 text-center text-xs font-bold text-indigo-600 uppercase tracking-wide hover:bg-white/50 rounded-b-xl transition-colors"
                   >
                      {isGeneratingInsights ? 'Analyzing...' : 'Refresh AI Analysis'}
                   </button>
                </div>
            </div>
         </div>
      </section>

      {/* 8️⃣ AI JOURNEY GRID */}
      <section className="space-y-6">
         <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">AI Processing Engine</h3>
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">LIVE</span>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             {[
                { title: "User Inputs Info", icon: <UserPlus size={18}/>, status: "Completed" },
                { title: "URL Context Analysis", icon: <Search size={18}/>, status: "Completed" },
                { title: "Search Grounding", icon: <Database size={18}/>, status: "Active", active: true },
                { title: "RAG / File Context", icon: <FileText size={18}/>, status: "Pending" },
             ].map((card, idx) => (
                <div key={idx} className={`p-4 rounded-xl border ${card.active ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-white border-slate-200'} flex flex-col gap-3 relative overflow-hidden`}>
                   {card.active && <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-indigo-200/50 to-transparent rounded-bl-full -mr-8 -mt-8"></div>}
                   <div className={`p-2 rounded-lg w-fit ${card.active ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                      {card.icon}
                   </div>
                   <div>
                      <div className={`text-sm font-bold ${card.active ? 'text-indigo-900' : 'text-slate-700'}`}>{card.title}</div>
                      <div className={`text-xs mt-1 ${card.active ? 'text-indigo-600 font-medium' : 'text-slate-400'}`}>{card.status}</div>
                   </div>
                   {idx < 3 && <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-slate-300 z-10"></div>}
                </div>
             ))}
         </div>
      </section>

      <div className="h-12"></div> {/* Bottom Spacer */}
    </div>
  );
};

export default Dashboard;