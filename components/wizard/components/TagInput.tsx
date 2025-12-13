
import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

interface TagInputProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  onSuggest?: () => void;
  loading?: boolean;
}

export const TagInput: React.FC<TagInputProps> = ({ label, values, onChange, onSuggest, loading }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-bold text-slate-700">{label}</label>
        {onSuggest && (
            <button 
                onClick={onSuggest}
                disabled={loading}
                className="text-xs flex items-center gap-1 text-purple-600 font-bold hover:bg-purple-50 px-2 py-1 rounded transition-colors disabled:opacity-50"
            >
                {loading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                Suggest Allocation
            </button>
        )}
      </div>
      <div className="p-2 border border-slate-200 rounded-xl bg-white focus-within:ring-2 focus-within:ring-purple-500 flex flex-wrap gap-2 min-h-[50px]">
        {values.map((v: string) => (
          <span key={v} className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-sm flex items-center gap-1">
            {v} <button onClick={() => onChange(values.filter((item: string) => item !== v))} className="hover:text-red-500">×</button>
          </span>
        ))}
        <input 
          type="text" 
          placeholder="Type & Enter..." 
          className="flex-1 outline-none min-w-[100px] text-sm"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const val = e.currentTarget.value.trim();
              if (val && !values.includes(val)) {
                onChange([...values, val]);
                e.currentTarget.value = '';
              }
            }
          }}
        />
      </div>
    </div>
  );
};
