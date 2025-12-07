import React from 'react';
import { MoreHorizontal, Plus } from 'lucide-react';
import { Deal, DealStage } from '../../types';
import { DealCard } from './DealCard';
import { CRM_COLUMNS } from './constants';

interface KanbanBoardProps {
  deals: Deal[];
  onAddDeal: (stage: DealStage) => void;
  onDealMove: (dealId: string, newStage: DealStage) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ deals, onAddDeal, onDealMove }) => {
  
  const handleMove = (dealId: string, currentStage: DealStage, direction: 'prev' | 'next') => {
    const currentIndex = CRM_COLUMNS.findIndex(col => col.id === currentStage);
    if (currentIndex === -1) return;

    let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    
    // Boundary checks
    if (newIndex < 0) return;
    if (newIndex >= CRM_COLUMNS.length) return;

    const newStage = CRM_COLUMNS[newIndex].id;
    onDealMove(dealId, newStage);
  };

  return (
    <div className="flex h-full gap-6 min-w-[1200px] overflow-x-auto pb-4">
      {CRM_COLUMNS.map((col) => {
        const colDeals = deals.filter(d => d.stage === col.id);
        const colValue = colDeals.reduce((acc, d) => acc + d.value, 0);

        return (
          <div key={col.id} className="flex flex-col w-80 h-full shrink-0">
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
                  <DealCard 
                    key={deal.id} 
                    deal={deal} 
                    layout="board" 
                    onMove={(dir) => handleMove(deal.id, deal.stage, dir)}
                  />
                ))
              )}
              
              {/* Add Button per Column */}
              <button 
                onClick={() => onAddDeal(col.id)}
                className="w-full py-3 border border-dashed border-slate-300 rounded-xl text-slate-500 text-sm font-medium hover:border-indigo-400 hover:text-indigo-600 hover:bg-white transition-all flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Add to {col.label}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
