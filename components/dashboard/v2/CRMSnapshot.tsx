
import React from 'react';
import { Users, Plus, ArrowRight } from 'lucide-react';
import { Deal } from '../../../types';
import { useNavigate } from 'react-router-dom';

interface CRMSnapshotProps {
  deals: Deal[];
}

export const CRMSnapshot: React.FC<CRMSnapshotProps> = ({ deals }) => {
  const navigate = useNavigate();
  const pipelineValue = deals.reduce((acc, d) => acc + d.value, 0);
  const activeDeals = deals.filter(d => d.stage !== 'Closed').length;
  const leads = deals.filter(d => d.stage === 'Lead').length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-serif font-bold text-[#1A1A1A] flex items-center gap-2">
            CRM Snapshot
        </h3>
        <button 
            onClick={() => navigate('/crm')}
            className="text-xs font-bold text-[#6B7280] hover:text-[#1A1A1A] flex items-center gap-1 uppercase tracking-wide"
        >
            View Pipeline <ArrowRight size={12} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
         <div className="p-4 bg-[#F7F7F5] rounded-xl border border-[#E5E5E5]">
            <div className="text-xs text-[#6B7280] font-bold uppercase mb-1">Active Deals</div>
            <div className="text-2xl font-bold text-[#1A1A1A]">{activeDeals}</div>
         </div>
         <div className="p-4 bg-[#F7F7F5] rounded-xl border border-[#E5E5E5]">
            <div className="text-xs text-[#6B7280] font-bold uppercase mb-1">Pipeline Value</div>
            <div className="text-2xl font-bold text-[#1A1A1A]">${(pipelineValue/1000).toFixed(0)}k</div>
         </div>
      </div>

      <div className="mt-auto space-y-3">
         <div className="flex justify-between text-sm text-[#6B7280] border-b border-[#E5E5E5] pb-3">
            <span>New Leads (Week)</span>
            <span className="font-bold text-[#1A1A1A]">{leads}</span>
         </div>
         <div className="flex justify-between text-sm text-[#6B7280]">
            <span>Follow-ups Due</span>
            <span className="font-bold text-[#991B1B]">2</span>
         </div>
      </div>

      <button 
        onClick={() => navigate('/crm')}
        className="mt-6 w-full py-3 border border-[#E5E5E5] rounded-xl text-sm font-bold text-[#1A1A1A] hover:bg-[#F7F7F5] transition-all flex items-center justify-center gap-2"
      >
        <Plus size={16} /> Add Deal
      </button>
    </div>
  );
};
