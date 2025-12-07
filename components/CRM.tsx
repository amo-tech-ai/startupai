
import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  LayoutGrid, 
  List, 
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';
import { Deal, DealStage } from '../types';
import { PipelineStats } from './crm/PipelineStats';
import { KanbanBoard } from './crm/KanbanBoard';
import { DealListView } from './crm/DealListView';
import { NewDealModal } from './crm/NewDealModal';

const CRM: React.FC = () => {
  const { deals, addDeal, updateDeal } = useData();
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialStage, setInitialStage] = useState<DealStage>('Lead');

  // Stats Calculation
  const totalValue = deals.reduce((acc, deal) => acc + deal.value, 0);
  const activeDeals = deals.filter(d => d.stage !== 'Closed').length;
  const winRate = deals.length > 0 ? Math.round((deals.filter(d => d.stage === 'Closed').length / deals.length) * 100) : 0;

  // Filtering
  const filteredDeals = deals.filter(deal => 
    deal.company.toLowerCase().includes(searchQuery.toLowerCase()) || 
    deal.sector.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (stage: DealStage = 'Lead') => {
    setInitialStage(stage);
    setIsModalOpen(true);
  };

  const handleAddDeal = (newDealData: Omit<Deal, 'id' | 'startupId'>) => {
    addDeal(newDealData);
    setIsModalOpen(false);
  };

  const handleDealMove = (dealId: string, newStage: DealStage) => {
    // Increase probability if moving forward
    let probabilityUpdate = {};
    if (newStage === 'Closed') probabilityUpdate = { probability: 100 };
    else if (newStage === 'Proposal') probabilityUpdate = { probability: 75 };
    else if (newStage === 'Meeting') probabilityUpdate = { probability: 50 };
    else if (newStage === 'Qualified') probabilityUpdate = { probability: 25 };

    updateDeal(dealId, { stage: newStage, ...probabilityUpdate });
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden relative">
      
      {/* 1. Header & Controls */}
      <div className="px-6 py-6 md:px-8 border-b border-slate-200 bg-white z-10 shrink-0">
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
             <button 
                onClick={() => handleOpenModal('Lead')}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
             >
                <Plus size={16} /> New Deal
             </button>
          </div>
        </div>

        {/* Stats Bar */}
        <PipelineStats 
          totalValue={totalValue} 
          activeDeals={activeDeals} 
          winRate={winRate} 
        />
        
        {/* View Toggles */}
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

      {/* 2. Content Area (Board or List) */}
      <div className="flex-1 overflow-hidden p-6 md:p-8 bg-slate-50/50">
        {viewMode === 'board' ? (
            <KanbanBoard 
              deals={filteredDeals} 
              onAddDeal={handleOpenModal}
              onDealMove={handleDealMove} 
            />
        ) : (
            <DealListView 
              deals={filteredDeals} 
            />
        )}
      </div>

      {/* 3. New Deal Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <NewDealModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onSubmit={handleAddDeal}
            defaultStage={initialStage}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CRM;
