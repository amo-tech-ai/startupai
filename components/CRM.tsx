import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  LayoutGrid, 
  List, 
  MoreHorizontal, 
  DollarSign, 
  Briefcase, 
  TrendingUp, 
  Calendar,
  ChevronDown,
  Building2,
  Tag
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- Types ---
type DealStage = 'Lead' | 'Qualified' | 'Meeting' | 'Proposal' | 'Closed';

interface Deal {
  id: string;
  company: string;
  value: number;
  stage: DealStage;
  probability: number;
  sector: string;
  nextAction: string;
  dueDate: string;
  ownerInitial: string;
  ownerColor: string;
}

// --- Mock Data ---
const MOCK_DEALS: Deal[] = [
  { id: '1', company: 'TechNova', value: 150000, stage: 'Lead', probability: 20, sector: 'SaaS', nextAction: 'Research market fit', dueDate: 'Tomorrow', ownerInitial: 'JD', ownerColor: 'bg-indigo-500' },
  { id: '2', company: 'GreenLeaf', value: 75000, stage: 'Lead', probability: 15, sector: 'CleanTech', nextAction: 'Find intro path', dueDate: 'Oct 30', ownerInitial: 'AR', ownerColor: 'bg-emerald-500' },
  { id: '3', company: 'Quantum AI', value: 500000, stage: 'Qualified', probability: 40, sector: 'AI/ML', nextAction: 'Schedule intro call', dueDate: 'Today', ownerInitial: 'JD', ownerColor: 'bg-indigo-500' },
  { id: '4', company: 'Starlight Ventures', value: 250000, stage: 'Meeting', probability: 60, sector: 'VC', nextAction: 'Send deck v2', dueDate: 'Nov 2', ownerInitial: 'MS', ownerColor: 'bg-rose-500' },
  { id: '5', company: 'BlueOcean Corp', value: 120000, stage: 'Meeting', probability: 55, sector: 'Retail', nextAction: 'Prep demo', dueDate: 'Nov 5', ownerInitial: 'AR', ownerColor: 'bg-emerald-500' },
  { id: '6', company: 'Apex Dynamics', value: 300000, stage: 'Proposal', probability: 85, sector: 'Robotics', nextAction: 'Review term sheet', dueDate: 'Urgent', ownerInitial: 'JD', ownerColor: 'bg-indigo-500' },
  { id: '7', company: 'Nebula Inc', value: 90000, stage: 'Closed', probability: 100, sector: 'SaaS', nextAction: 'Onboarding', dueDate: 'Done', ownerInitial: 'MS', ownerColor: 'bg-rose-500' },
];

const COLUMNS: { id: DealStage; label: string; color: string }[] = [
  { id: 'Lead', label: 'Lead', color: 'border-slate-300' },
  { id: 'Qualified', label: 'Qualified', color: 'border-blue-400' },
  { id: 'Meeting', label: 'Meeting', color: 'border-amber-400' },
  { id: 'Proposal', label: 'Proposal', color: 'border-purple-400' },
  { id: 'Closed', label: 'Closed', color: 'border-green-400' },
];

const CRM: React.FC = () => {
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [searchQuery, setSearchQuery] = useState('');

  // Stats Calculation
  const totalValue = MOCK_DEALS.reduce((acc, deal) => acc + deal.value, 0);
  const activeDeals = MOCK_DEALS.filter(d => d.stage !== 'Closed').length;
  const closedValue = MOCK_DEALS.filter(d => d.stage === 'Closed').reduce((acc, deal) => acc + deal.value, 0);
  
  // Filtering
  const filteredDeals = MOCK_DEALS.filter(deal => 
    deal.company.toLowerCase().includes(searchQuery.toLowerCase()) || 
    deal.sector.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      
      {/* 1. Header & Controls */}
      <div className="px-6 py-6 md:px-8 border-b border-slate-200 bg-white z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Deal Pipeline</h1>
            <p className="text-slate-500 text-sm">Manage your fundraising and sales opportunities.</p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search deals..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
                />
             </div>
             <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 text-sm font-medium hover:bg-slate-50">
                <Filter size={16} /> Filter
             </button>
             <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-600/20">
                <Plus size={16} /> New Deal
             </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center gap-3">
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><DollarSign size={18}/></div>
              <div>
                 <div className="text-xs text-slate-500 uppercase font-bold tracking-wide">Pipeline Value</div>
                 <div className="text-lg font-bold text-slate-900">${(totalValue / 1000000).toFixed(2)}M</div>
              </div>
           </div>
           <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center gap-3">
              <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><Briefcase size={18}/></div>
              <div>
                 <div className="text-xs text-slate-500 uppercase font-bold tracking-wide">Active Deals</div>
                 <div className="text-lg font-bold text-slate-900">{activeDeals}</div>
              </div>
           </div>
           <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center gap-3">
              <div className="p-2 bg-green-100 text-green-600 rounded-lg"><TrendingUp size={18}/></div>
              <div>
                 <div className="text-xs text-slate-500 uppercase font-bold tracking-wide">Win Rate</div>
                 <div className="text-lg font-bold text-slate-900">18%</div>
              </div>
           </div>
             <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Calendar size={18}/></div>
                 <div>
                    <div className="text-xs text-slate-500 uppercase font-bold tracking-wide">Forecast</div>
                    <div className="text-lg font-bold text-slate-900">Q4 '24</div>
                 </div>
              </div>
              <ChevronDown className="text-slate-400" size={16} />
           </div>
        </div>
        
        {/* View Toggles (Visual Only) */}
        <div className="flex items-center gap-2 mt-6 border-b border-slate-200">
           <button 
             onClick={() => setViewMode('board')}
             className={`flex items-center gap-2 px-4 py-2 border-b-2 font-medium text-sm transition-colors ${viewMode === 'board' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
           >
             <LayoutGrid size={16} /> Kanban Board
           </button>
           <button 
             onClick={() => setViewMode('list')}
             className={`flex items-center gap-2 px-4 py-2 border-b-2 font-medium text-sm transition-colors ${viewMode === 'list' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
           >
             <List size={16} /> List View
           </button>
        </div>
      </div>

      {/* 2. Kanban Board Area */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 md:p-8">
        <div className="flex h-full gap-6 min-w-[1200px]">
          {COLUMNS.map((col) => {
            const colDeals = filteredDeals.filter(d => d.stage === col.id);
            const colValue = colDeals.reduce((acc, d) => acc + d.value, 0);

            return (
              <div key={col.id} className="flex flex-col w-80 h-full">
                {/* Column Header */}
                <div className={`flex items-center justify-between mb-4 pb-2 border-b-2 ${col.color}`}>
                   <div>
                      <h3 className="font-bold text-slate-700">{col.label}</h3>
                      <p className="text-xs text-slate-500">${(colValue / 1000).toFixed(0)}k • {colDeals.length} Deals</p>
                   </div>
                   <div className="p-1 rounded hover:bg-slate-200 cursor-pointer text-slate-400">
                      <MoreHorizontal size={16} />
                   </div>
                </div>

                {/* Column Body */}
                <div className="flex-1 overflow-y-auto space-y-3 pb-20 pr-2 custom-scrollbar">
                   {colDeals.length === 0 ? (
                      <div className="h-24 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-sm italic">
                         No deals
                      </div>
                   ) : (
                      colDeals.map((deal) => (
                         <DealCard key={deal.id} deal={deal} />
                      ))
                   )}
                   
                   {/* Ghost Card for "Add New" */}
                   <button className="w-full py-3 border border-dashed border-slate-300 rounded-xl text-slate-500 text-sm font-medium hover:border-indigo-400 hover:text-indigo-600 hover:bg-white transition-all flex items-center justify-center gap-2">
                      <Plus size={16} /> Add to {col.label}
                   </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// SUB-COMPONENT: Deal Card
// ----------------------------------------------------------------------

const DealCard: React.FC<{ deal: Deal }> = ({ deal }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-3">
         <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                <Building2 size={20} />
             </div>
             <div>
                <h4 className="font-bold text-slate-900 text-sm">{deal.company}</h4>
                <div className="text-xs text-slate-500 flex items-center gap-1">
                   {deal.sector}
                </div>
             </div>
         </div>
         <button className="text-slate-300 hover:text-slate-600">
            <MoreHorizontal size={16} />
         </button>
      </div>

      <div className="mb-4">
         <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-500 font-medium">Probability</span>
            <span className="text-slate-900 font-bold">{deal.probability}%</span>
         </div>
         <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div 
               className={`h-full rounded-full ${
                  deal.probability > 75 ? 'bg-green-500' : 
                  deal.probability > 40 ? 'bg-indigo-500' : 'bg-amber-400'
               }`} 
               style={{ width: `${deal.probability}%` }}
            ></div>
         </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
         <div className="font-bold text-slate-900 text-sm">
            ${deal.value.toLocaleString()}
         </div>
         <div className="flex items-center gap-2">
            <div className={`text-[10px] px-1.5 py-0.5 rounded border ${
               deal.dueDate === 'Urgent' ? 'bg-red-50 text-red-600 border-red-100' :
               deal.dueDate === 'Done' ? 'bg-green-50 text-green-600 border-green-100' :
               'bg-slate-50 text-slate-500 border-slate-100'
            }`}>
               {deal.dueDate}
            </div>
            <div className={`w-6 h-6 rounded-full ${deal.ownerColor} flex items-center justify-center text-[10px] text-white font-bold ring-2 ring-white`}>
               {deal.ownerInitial}
            </div>
         </div>
      </div>
      
      {/* Hover Action */}
      <div className="mt-2 text-xs text-slate-400 group-hover:text-indigo-600 transition-colors flex items-center gap-1">
         <Calendar size={12} /> Next: {deal.nextAction}
      </div>
    </motion.div>
  );
};

export default CRM;