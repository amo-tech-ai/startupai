
import React from 'react';
import { Deal } from '../../types';
import { DealCard } from './DealCard';

interface DealListViewProps {
  deals: Deal[];
}

export const DealListView: React.FC<DealListViewProps> = ({ deals }) => {
  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <div className="min-w-[1000px]">
        {/* Table Header */}
        <div className="flex items-center px-6 py-3 bg-slate-100 rounded-t-xl border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wide">
          <div className="w-1/4">Company</div>
          <div className="w-1/6">Stage</div>
          <div className="w-1/6">Value</div>
          <div className="w-1/6">Probability</div>
          <div className="w-1/6">Next Action</div>
          <div className="w-12 text-center">Owner</div>
          <div className="w-8"></div>
        </div>
        
        {/* List Items */}
        <div className="bg-white border-x border-b border-slate-200 rounded-b-xl shadow-sm">
          {deals.length === 0 ? (
            <div className="text-center py-12 text-slate-400">No deals found matching your search.</div>
          ) : (
            deals.map(deal => (
              <DealCard key={deal.id} deal={deal} layout="list" />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
