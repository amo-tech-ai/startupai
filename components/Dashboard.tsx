import React from 'react';
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
  MoreHorizontal,
  Clock,
  ChevronRight,
  Search,
  Database,
  PenTool,
  Download
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Cell
} from 'recharts';
import { motion } from 'framer-motion';

// Mock data for charts
const sparklineData1 = [
  { v: 10 }, { v: 20 }, { v: 18 }, { v: 25 }, { v: 30 }, { v: 40 }, { v: 35 }, { v: 42 }
];
const sparklineData2 = [
  { v: 100 }, { v: 120 }, { v: 110 }, { v: 140 }, { v: 130 }, { v: 160 }, { v: 180 }, { v: 200 }
];

const Dashboard: React.FC = () => {
  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto space-y-12">
      
      {/* 4️⃣ WELCOME SECTION */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-bold text-slate-900">Good morning, Founder 👋</h1>
           <p className="text-slate-500 mt-1 flex items-center gap-2">
             <span>Tuesday, Oct 24</span>
             <span className="w-1 h-1 rounded-full bg-slate-300"></span>
             <span className="text-indigo-600 font-medium">12 Day Streak 🔥</span>
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
               <div className="text-slate-500 text-sm font-medium mb-1">Pitch Decks</div>
               <div className="text-3xl font-bold text-slate-900">42</div>
            </div>
            <div className="h-10 w-full opacity-50">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sparklineData1}>
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
               <div className="text-slate-500 text-sm font-medium mb-1">Pipeline Value</div>
               <div className="text-3xl font-bold text-slate-900">$1.2M</div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2 overflow-hidden">
               <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
            </div>
            <div className="text-xs text-slate-400">Target: $2M</div>
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
               <div className="text-slate-500 text-sm font-medium mb-1">Tasks Due</div>
               <div className="text-3xl font-bold text-slate-900">18</div>
            </div>
            <div className="flex gap-1 mt-auto">
               {[1,2,3,4,5].map(i => (
                  <div key={i} className={`h-8 flex-1 rounded-sm ${i < 4 ? 'bg-teal-400/80' : 'bg-slate-100'}`}></div>
               ))}
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
               <div className="text-3xl font-bold text-slate-900">156</div>
            </div>
            <div className="h-10 w-full opacity-50">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sparklineData1}>
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
               <a href="#" className="text-sm text-indigo-600 font-medium hover:underline">View All</a>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 divide-y divide-slate-100">
               {[
                  { icon: <FileText size={16} className="text-indigo-600"/>, text: "Updated Series A Deck", time: "2h ago", bg: "bg-indigo-50" },
                  { icon: <UserPlus size={16} className="text-purple-600"/>, text: "Added 3 contacts from LinkedIn", time: "4h ago", bg: "bg-purple-50" },
                  { icon: <CheckSquare size={16} className="text-teal-600"/>, text: "Completed 'Market Research' task", time: "5h ago", bg: "bg-teal-50" },
                  { icon: <Briefcase size={16} className="text-rose-600"/>, text: "Moved 'Acme Corp' to Proposal", time: "1d ago", bg: "bg-rose-50" },
                  { icon: <Sparkles size={16} className="text-amber-600"/>, text: "AI generated Financial Model v2", time: "1d ago", bg: "bg-amber-50" },
                  { icon: <Clock size={16} className="text-slate-600"/>, text: "Meeting with Sequoia Capital", time: "2d ago", bg: "bg-slate-50" },
               ].map((item, idx) => (
                  <div key={idx} className="p-4 flex items-center gap-4 hover:bg-slate-50/80 transition-colors group cursor-pointer">
                     <div className={`p-2 rounded-lg ${item.bg}`}>
                        {item.icon}
                     </div>
                     <div className="flex-1">
                        <div className="text-sm font-medium text-slate-900">{item.text}</div>
                     </div>
                     <div className="text-xs text-slate-400 whitespace-nowrap">{item.time}</div>
                     <ChevronRight size={16} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
               ))}
            </div>
         </div>

         {/* AI Insights (40% -> 2 cols) */}
         <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
               <Sparkles size={18} className="text-purple-600" />
               <h3 className="text-lg font-bold text-slate-900">AI Recommendations</h3>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-1">
               <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 space-y-6">
                  {/* Insight 1 */}
                  <div className="flex gap-4">
                     <div className="mt-1">
                        <span className="flex h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse"></span>
                     </div>
                     <div className="space-y-2">
                        <span className="text-xs font-bold text-red-500 uppercase tracking-wide">High Priority</span>
                        <p className="text-sm text-slate-700 leading-relaxed font-medium">
                           Your Series A Deck is missing a "Competition" slide. Investors usually look for this after "Market Size".
                        </p>
                        <button className="text-xs bg-white border border-slate-200 shadow-sm px-3 py-1.5 rounded-md font-medium text-slate-700 hover:text-indigo-600 hover:border-indigo-200 transition-colors">
                           Auto-Generate Slide
                        </button>
                     </div>
                  </div>

                  <div className="h-px bg-slate-200/50 w-full"></div>

                  {/* Insight 2 */}
                   <div className="flex gap-4">
                     <div className="mt-1">
                        <span className="flex h-2 w-2 rounded-full bg-amber-500"></span>
                     </div>
                     <div className="space-y-2">
                        <span className="text-xs font-bold text-amber-500 uppercase tracking-wide">Optimization</span>
                        <p className="text-sm text-slate-700 leading-relaxed font-medium">
                           Follow up with <strong>Jane Doe</strong> from TechStars. It's been 5 days since your last email.
                        </p>
                        <button className="text-xs bg-white border border-slate-200 shadow-sm px-3 py-1.5 rounded-md font-medium text-slate-700 hover:text-indigo-600 hover:border-indigo-200 transition-colors">
                           Draft Follow-up
                        </button>
                     </div>
                  </div>
               </div>
               <button className="w-full py-3 text-center text-xs font-bold text-indigo-600 uppercase tracking-wide hover:bg-white/50 rounded-b-xl transition-colors">
                  Get More Insights →
               </button>
            </div>
         </div>
      </section>

      {/* 7️⃣ WORKFLOW DIAGRAM */}
      <section className="space-y-6 pt-8 border-t border-slate-100">
         <h3 className="text-lg font-bold text-slate-900">System Workflow</h3>
         
         <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12 overflow-x-auto">
            <div className="flex items-center min-w-[800px] justify-between relative">
               {/* Background Line */}
               <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>

               {[
                  { icon: <FileText />, label: "Choose Doc" },
                  { icon: <Database />, label: "Input Info" },
                  { icon: <Sparkles />, label: "AI Draft" },
                  { icon: <PenTool />, label: "Editor" },
                  { icon: <CheckSquare />, label: "Review" },
                  { icon: <Download />, label: "Export" },
               ].map((step, idx) => (
                  <div key={idx} className="relative z-10 flex flex-col items-center gap-3 group">
                     <div className="w-14 h-14 bg-white rounded-xl border-2 border-slate-100 shadow-sm flex items-center justify-center text-slate-400 group-hover:border-indigo-500 group-hover:text-indigo-500 group-hover:shadow-md transition-all duration-300">
                        {step.icon}
                     </div>
                     <span className="text-xs font-bold text-slate-500 uppercase tracking-wide group-hover:text-indigo-600 transition-colors">{step.label}</span>
                     
                     {/* Connector Arrow */}
                     {idx < 5 && (
                        <div className="absolute top-1/2 -right-12 -translate-y-1/2 text-slate-300">
                           <ArrowRight size={20} />
                        </div>
                     )}
                  </div>
               ))}
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
             {/* Row 1 */}
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
         
         <div className="flex justify-center my-2 text-slate-300">
            <ArrowDownRight size={24} />
         </div>

         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             {/* Row 2 */}
             {[
                { title: "AI Draft Generation", icon: <Sparkles size={18}/>, status: "Waiting" },
                { title: "User Refinement", icon: <PenTool size={18}/>, status: "Waiting" },
                { title: "AI Polish", icon: <CheckSquare size={18}/>, status: "Waiting" },
                { title: "Final Export", icon: <Download size={18}/>, status: "Waiting" },
             ].map((card, idx) => (
                <div key={idx} className="p-4 rounded-xl border bg-slate-50 border-slate-200 flex flex-col gap-3 opacity-70">
                   <div className="p-2 rounded-lg w-fit bg-slate-200 text-slate-500">
                      {card.icon}
                   </div>
                   <div>
                      <div className="text-sm font-bold text-slate-700">{card.title}</div>
                      <div className="text-xs mt-1 text-slate-400">{card.status}</div>
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