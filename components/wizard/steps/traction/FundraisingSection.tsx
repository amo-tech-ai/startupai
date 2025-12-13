
import React from 'react';
import { DollarSign } from 'lucide-react';
import { ValuationWidget } from '../../intelligence/ValuationWidget';
import { TagInput } from '../../components/TagInput';

interface FundraisingSectionProps {
  isRaising: boolean;
  targetRaise: number;
  useOfFunds: string[];
  fundraisingData: any;
  isAnalyzing: boolean;
  isSuggesting: boolean;
  onUpdate: (field: string, value: any) => void;
  onSuggestFunds: () => void;
}

export const FundraisingSection: React.FC<FundraisingSectionProps> = ({
  isRaising, targetRaise, useOfFunds, fundraisingData, isAnalyzing, isSuggesting, onUpdate, onSuggestFunds
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Fundraising</h2>
            <label className="flex items-center cursor-pointer">
                <div className="relative">
                <input type="checkbox" className="sr-only" checked={isRaising} onChange={(e) => onUpdate('isRaising', e.target.checked)} />
                <div className={`block w-14 h-8 rounded-full transition-colors ${isRaising ? 'bg-purple-600' : 'bg-slate-200'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isRaising ? 'translate-x-6' : ''}`}></div>
                </div>
                <span className="ml-3 text-sm font-bold text-slate-700">{isRaising ? 'Active' : 'Inactive'}</span>
            </label>
        </div>

        <div className={`space-y-6 transition-all ${isRaising ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Target Raise Amount</label>
                <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="number" 
                        value={targetRaise}
                        onChange={(e) => onUpdate('targetRaise', Number(e.target.value))}
                        className="w-full pl-10 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-lg font-mono"
                    />
                </div>
            </div>

            <ValuationWidget 
                data={fundraisingData} 
                targetRaise={targetRaise || 0}
                isLoading={isAnalyzing} 
            />

            <TagInput 
                label="Use of Funds" 
                values={useOfFunds} 
                onChange={(vals: string[]) => onUpdate('useOfFunds', vals)}
                onSuggest={onSuggestFunds}
                loading={isSuggesting}
            />
        </div>
    </div>
  );
};
