import React from 'react';
import { 
  Building2, 
  MoreHorizontal, 
  Mail, 
  Phone, 
  Users, 
  Calendar, 
  Clock, 
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Deal } from '../../types';

// Workaround for strict type checking issues with framer-motion in some environments
const MotionDiv = motion.div as any;

interface DealCardProps {
    deal: Deal;
    layout?: 'board' | 'list';
    onMove?: (direction: 'prev' | 'next') => void;
}

export const DealCard: React.FC<DealCardProps> = ({ deal, layout = 'board', onMove }) => {
  const getActionIcon = (text: string) => {
    const t = text ? text.toLowerCase() : '';
    if (t.includes('email') || t.includes('send')) return <Mail size={12} />;
    if (t.includes('call') || t.includes('phone')) return <Phone size={12} />;
    if (t.includes('meet') || t.includes('schedule')) return <Users size={12} />;
    return <Calendar size={12} />;
  };

  // LIST LAYOUT
  if (layout === 'list') {
      return (
        <MotionDiv 
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center px-6 py-4 border-b border-slate-100 last:border-0 hover:bg-indigo-50/30 transition-colors group cursor-pointer"
        >
            <div className="w-1/4 flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100 text-slate-400 group-hover:bg-white group-hover:text-indigo-600 transition-colors">
                    <Building2 size={16} />
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 text-sm">{deal.company}</h4>
                    <div className="text-xs text-slate-500">{deal.sector}</div>
                </div>
            </div>
            
            <div className="w-1/6">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                    deal.stage === 'Lead' ? 'bg-slate-50 text-slate-600 border-slate-200' :
                    deal.stage === 'Qualified' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                    deal.stage === 'Meeting' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                    deal.stage === 'Proposal' ? 'bg-purple-50 text-purple-600 border-purple-200' :
                    'bg-green-50 text-green-600 border-green-200'
                }`}>
                    {deal.stage}
                </span>
            </div>
            
            <div className="w-1/6 font-bold text-slate-900 text-sm">
                ${deal.value.toLocaleString()}
            </div>
            
            <div className="w-1/6 pr-8">
                <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div className={`h-full rounded-full ${
                            deal.probability > 75 ? 'bg-green-500' : 
                            deal.probability > 40 ? 'bg-indigo-500' : 'bg-amber-400'
                        }`} style={{ width: `${deal.probability}%` }}></div>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">{deal.probability}%</span>
                </div>
            </div>
            
            <div className="w-1/6 flex flex-col justify-center">
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700 mb-0.5">
                    {getActionIcon(deal.nextAction)}
                    <span className="truncate">{deal.nextAction}</span>
                </div>
                <div className={`text-[10px] flex items-center gap-1 ${
                    deal.dueDate === 'Urgent' ? 'text-red-600 font-bold' : 'text-slate-400'
                }`}>
                    <Clock size={10} /> {deal.dueDate}
                </div>
            </div>
            
            <div className="w-12 flex justify-center">
                <div className={`w-8 h-8 rounded-full ${deal.ownerColor} flex items-center justify-center text-xs text-white font-bold ring-2 ring-white shadow-sm`}>
                    {deal.ownerInitial}
                </div>
            </div>
            
            <div className="w-8 flex justify-end">
                <button className="text-slate-300 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100">
                    <MoreHorizontal size={16} />
                </button>
            </div>
        </MotionDiv>
      );
  }

  // BOARD LAYOUT
  return (
    <MotionDiv 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group relative"
    >
      {/* Quick Move Controls (Visible on Hover) */}
      {onMove && (
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-white/80 backdrop-blur-sm rounded-lg p-1 border border-slate-100 shadow-sm">
            <button 
                onClick={(e) => { e.stopPropagation(); onMove('prev'); }}
                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700"
                title="Previous Stage"
            >
                <ChevronLeft size={14} />
            </button>
            <button 
                onClick={(e) => { e.stopPropagation(); onMove('next'); }}
                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700"
                title="Next Stage"
            >
                <ChevronRight size={14} />
            </button>
        </div>
      )}

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
         <div className={`w-6 h-6 rounded-full ${deal.ownerColor} flex items-center justify-center text-[10px] text-white font-bold ring-2 ring-white shadow-sm`}>
            {deal.ownerInitial}
         </div>
      </div>
      
      {/* Enhanced Next Action Card with Hover Effect */}
      <div className="mt-3 bg-slate-50 rounded-lg p-2.5 border border-slate-100 flex items-center gap-3 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-all">
          <div className="p-1.5 bg-white rounded-md border border-slate-200 text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-200 transition-colors">
             {getActionIcon(deal.nextAction)}
          </div>
          <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-slate-700 truncate group-hover:text-indigo-900">{deal.nextAction}</div>
              <div className={`text-[10px] flex items-center gap-1 mt-0.5 ${
                 deal.dueDate === 'Urgent' ? 'text-red-600 font-bold' : 'text-slate-500'
              }`}>
                 <Clock size={10} />
                 {deal.dueDate}
              </div>
          </div>
          <div className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-indigo-500">
             <ArrowRight size={14} />
          </div>
      </div>
    </MotionDiv>
  );
};
