import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Tag, DollarSign, AlertCircle, X, Check } from 'lucide-react';
import { Deal, DealStage } from '../../types';
import { CRM_COLUMNS } from './constants';

// Workaround for strict type checking issues with framer-motion in some environments
const MotionDiv = motion.div as any;

interface NewDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Deal, 'id' | 'startupId'>) => void;
  defaultStage: DealStage;
}

export const NewDealModal: React.FC<NewDealModalProps> = ({ isOpen, onClose, onSubmit, defaultStage }) => {
  const [formData, setFormData] = useState({
    company: '',
    sector: '',
    value: '',
    stage: defaultStage,
    probability: 20,
    nextAction: '',
    dueDate: 'Next Week',
    ownerInitial: 'ME',
    ownerColor: 'bg-indigo-500'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const owners = [
    { initial: 'ME', color: 'bg-indigo-500' },
    { initial: 'JD', color: 'bg-emerald-500' },
    { initial: 'AR', color: 'bg-rose-500' },
    { initial: 'MS', color: 'bg-amber-500' },
  ];

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.company.trim()) newErrors.company = "Company name is required";
    if (!formData.sector.trim()) newErrors.sector = "Sector is required";
    if (!formData.value || Number(formData.value) <= 0) newErrors.value = "Valid deal value is required";
    if (!formData.nextAction.trim()) newErrors.nextAction = "Next action is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        value: Number(formData.value)
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <MotionDiv 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <MotionDiv 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden z-50"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-900">Add New Deal</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
             <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                <div className="relative">
                   <Building2 className={`absolute left-3 top-1/2 -translate-y-1/2 ${errors.company ? 'text-red-400' : 'text-slate-400'}`} size={18} />
                   <input 
                      type="text" 
                      autoFocus
                      className={`w-full pl-10 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-slate-900 transition-all ${errors.company ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'}`}
                      placeholder="e.g. Acme Corp"
                      value={formData.company}
                      onChange={(e) => {
                         setFormData({...formData, company: e.target.value});
                         if (errors.company) setErrors({...errors, company: ''});
                      }}
                   />
                   {errors.company && <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" size={18} />}
                </div>
                {errors.company && <p className="text-xs text-red-500 mt-1 ml-1">{errors.company}</p>}
             </div>

             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sector</label>
                <div className="relative">
                   <Tag className={`absolute left-3 top-1/2 -translate-y-1/2 ${errors.sector ? 'text-red-400' : 'text-slate-400'}`} size={18} />
                   <input 
                      type="text" 
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-slate-900 transition-all ${errors.sector ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'}`}
                      placeholder="e.g. SaaS"
                      value={formData.sector}
                      onChange={(e) => {
                         setFormData({...formData, sector: e.target.value});
                         if (errors.sector) setErrors({...errors, sector: ''});
                      }}
                   />
                </div>
                {errors.sector && <p className="text-xs text-red-500 mt-1 ml-1">{errors.sector}</p>}
             </div>

             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Value ($)</label>
                <div className="relative">
                   <DollarSign className={`absolute left-3 top-1/2 -translate-y-1/2 ${errors.value ? 'text-red-400' : 'text-slate-400'}`} size={18} />
                   <input 
                      type="number" 
                      min="0"
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-slate-900 transition-all ${errors.value ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'}`}
                      placeholder="50000"
                      value={formData.value}
                      onChange={(e) => {
                         setFormData({...formData, value: e.target.value});
                         if (errors.value) setErrors({...errors, value: ''});
                      }}
                   />
                </div>
                {errors.value && <p className="text-xs text-red-500 mt-1 ml-1">{errors.value}</p>}
             </div>

             <div className="col-span-2 space-y-3">
                 <div className="flex justify-between">
                     <label className="block text-sm font-medium text-slate-700">Probability</label>
                     <span className={`text-sm font-bold ${formData.probability > 75 ? 'text-green-600' : formData.probability > 40 ? 'text-indigo-600' : 'text-amber-500'}`}>{formData.probability}%</span>
                 </div>
                 <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    step="5"
                    value={formData.probability}
                    onChange={(e) => setFormData({...formData, probability: Number(e.target.value)})}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                 />
                 <div className="flex justify-between text-xs text-slate-400 px-1">
                    <span>Low</span>
                    <span>High</span>
                 </div>
             </div>
             
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Stage</label>
                <select 
                   className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 bg-white"
                   value={formData.stage}
                   onChange={(e) => setFormData({...formData, stage: e.target.value as DealStage})}
                >
                   {CRM_COLUMNS.map(col => <option key={col.id} value={col.id}>{col.label}</option>)}
                </select>
             </div>

             <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                 <input 
                    type="text" 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900" 
                    placeholder="e.g. Next Week"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                 />
             </div>

             <div className="col-span-2">
                 <label className="block text-sm font-medium text-slate-700 mb-1">Next Action</label>
                 <input 
                    type="text" 
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-slate-900 transition-all ${errors.nextAction ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'}`}
                    placeholder="e.g. Schedule follow-up call"
                    value={formData.nextAction}
                    onChange={(e) => {
                         setFormData({...formData, nextAction: e.target.value});
                         if (errors.nextAction) setErrors({...errors, nextAction: ''});
                    }}
                 />
                 {errors.nextAction && <p className="text-xs text-red-500 mt-1 ml-1">{errors.nextAction}</p>}
             </div>

             <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Owner</label>
                <div className="flex gap-3">
                   {owners.map((owner, idx) => (
                      <div 
                         key={idx}
                         onClick={() => setFormData({...formData, ownerInitial: owner.initial, ownerColor: owner.color})}
                         className={`relative w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white cursor-pointer transition-transform hover:scale-110 ${owner.color} ${formData.ownerInitial === owner.initial ? 'ring-2 ring-offset-2 ring-slate-900' : ''}`}
                      >
                         {owner.initial}
                         {formData.ownerInitial === owner.initial && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center border border-slate-200">
                               <Check size={10} className="text-slate-900" />
                            </div>
                         )}
                      </div>
                   ))}
                </div>
             </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
             <button 
                type="button" 
                onClick={onClose}
                className="px-5 py-2.5 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-colors"
             >
                Cancel
             </button>
             <button 
                type="submit" 
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
             >
                Create Deal
             </button>
          </div>
        </form>
      </MotionDiv>
    </div>
  );
};