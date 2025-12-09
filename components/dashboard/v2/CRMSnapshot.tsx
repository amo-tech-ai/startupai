
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
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <Users size={20} className="text-blue-600" /> CRM Snapshot
        </h3>
        <button 
            onClick={() => navigate('/crm')}
            className="text-xs font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1"
        >
            View Pipeline <ArrowRight size={12} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
         <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-xs text-slate-500 font-bold uppercase mb-1">Active Deals</div>
            <div className="text-2xl font-bold text-slate-900">{activeDeals}</div>
         </div>
         <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-xs text-slate-500 font-bold uppercase mb-1">Pipeline Value</div>
            <div className="text-2xl font-bold text-slate-900">${(pipelineValue/1000).toFixed(0)}k</div>
         </div>
      </div>

      <div className="mt-auto space-y-2">
         <div className="flex justify-between text-sm text-slate-600 border-b border-slate-50 pb-2">
            <span>New Leads (Week)</span>
            <span className="font-bold">{leads}</span>
         </div>
         <div className="flex justify-between text-sm text-slate-600">
            <span>Follow-ups Due</span>
            <span className="font-bold text-rose-600">2</span>
         </div>
      </div>

      <button 
        onClick={() => navigate('/crm')}
        className="mt-4 w-full py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-sm font-bold text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-all flex items-center justify-center gap-2"
      >
        <Plus size={16} /> Add Deal
      </button>
    </div>
  );
};
