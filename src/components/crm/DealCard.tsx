
import React from 'react';
import { 
  Building2, 
  Mail, 
  Phone, 
  Users, 
  Calendar, 
  Clock, 
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Deal } from '../../types';

const MotionDiv = motion.div as any;

interface DealCardProps {
    deal: Deal;
    layout?: 'board' | 'list';
    onMove?: (direction: 'prev' | 'next') => void;
    onClick?: () => void;
}

export const DealCard: React.FC<DealCardProps> = ({ deal, layout = 'board', onMove, onClick }) => {
  const getActionIcon = (text: string) => {
    const t = text ? text.toLowerCase() : '';
    if (t.includes('email') || t.includes('send')) return <Mail size={12} />;
    if (t.includes('call') || t.includes('phone')) return <Phone size={12} />;
    if (t.includes('meet') || t.includes('schedule')) return <Users size={12} />;
    return <Calendar size={12} />;
  };

  const scoreColor = (deal.ai_score || 0) > 80 ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-indigo-600 bg-indigo-50 border-indigo-100';

  if (layout === 'list') {
      return (
        <MotionDiv 
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={onClick}
            className="flex items-center px-6 py-4 border-b border-slate-100 last:border-0 hover:bg-indigo-50/30 transition-colors group cursor-pointer"
        >
            <div className="w-1/4 flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100 text-slate-400 group-hover:bg-white group-hover:text-indigo-600 transition-colors">
                    <Building2 size={16} />
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        {deal.company}
                        {deal.ai_score && <Sparkles size={12} className="text-indigo-500" />}
                    </h4>
                    <div className="text-xs text-slate-500">{deal.sector}</div>
                </div>
            </div>
            <div className="w-1/6">
                {deal.ai_score ? (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${scoreColor}`}>
                        {deal.ai_score}% Fit
                    </span>
                ) : (
                    <span className="text-[10px] text-slate-300 font-bold uppercase tracking-tighter">Not Scored</span>
                )}
            </div>
            <div className="w-1/6 font-bold text-slate-900 text-sm">${deal.value.toLocaleString()}</div>
            <div className="w-1/6 pr-8">
                <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div className={`h-full rounded-full ${deal.probability > 75 ? 'bg-green-500' : deal.probability > 40 ? 'bg-indigo-500' : 'bg-amber-400'}`} style={{ width: `${deal.probability}%` }}></div>
                    </div>
                </div>
            </div>
            <div className="w-1/6 flex flex-col justify-center">
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700 mb-0.5">
                    {getActionIcon(deal.nextAction)}
                    <span className="truncate">{deal.nextAction}</span>
                </div>
            </div>
            <div className="w-12 flex justify-center">
                <div className={`w-8 h-8 rounded-full ${deal.ownerColor} flex items-center justify-center text-xs text-white font-bold ring-2 ring-white shadow-sm`}>{deal.ownerInitial}</div>
            </div>
        </MotionDiv>
      );
  }

  return (
    <MotionDiv 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group relative"
    >
      {deal.ai_score && (
        <div className="absolute -top-2 -right-2 z-10 scale-90">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg font-bold text-[10px] border shadow-sm ${scoreColor}`}>
                <Sparkles size={10} /> {deal.ai_score}%
            </div>
        </div>
      )}

      <div className="flex justify-between items-start mb-3">
         <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                <Building2 size={20} />
             </div>
             <div>
                <h4 className="font-bold text-slate-900 text-sm">{deal.company}</h4>
                <div className="text-xs text-slate-500">{deal.sector}</div>
             </div>
         </div>
      </div>

      <div className="mb-4">
         <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-500 font-medium">Probability</span>
            <span className="text-slate-900 font-bold">{deal.probability}%</span>
         </div>
         <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className={`h-full rounded-full ${deal.probability > 75 ? 'bg-green-500' : deal.probability > 40 ? 'bg-indigo-500' : 'bg-amber-400'}`} style={{ width: `${deal.probability}%` }}></div>
         </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
         <div className="font-bold text-slate-900 text-sm">${deal.value.toLocaleString()}</div>
         <div className={`w-6 h-6 rounded-full ${deal.ownerColor} flex items-center justify-center text-[10px] text-white font-bold ring-2 ring-white shadow-sm`}>{deal.ownerInitial}</div>
      </div>
      
      <div className="mt-3 bg-slate-50 rounded-lg p-2.5 border border-slate-100 flex items-center gap-3 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-all">
          <div className="p-1.5 bg-white rounded-md border border-slate-200 text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-200 transition-colors">
             {getActionIcon(deal.nextAction)}
          </div>
          <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-slate-700 truncate group-hover:text-indigo-900">{deal.nextAction}</div>
              <div className={`text-[10px] flex items-center gap-1 mt-0.5 ${deal.dueDate === 'Urgent' ? 'text-red-600 font-bold' : 'text-slate-500'}`}>
                 <Clock size={10} /> {deal.dueDate}
              </div>
          </div>
      </div>
    </MotionDiv>
  );
};
