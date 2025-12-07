
import React from 'react';
import { Users } from 'lucide-react';

interface StepTeamProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export const StepTeam: React.FC<StepTeamProps> = ({ formData, setFormData }) => {
  return (
     <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
        <div className="text-center mb-8">
             <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-orange-600">
                <Users size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">The Team</h2>
            <p className="text-slate-500">Who is building this?</p>
        </div>
        
         <div className="space-y-4">
            {formData.founders.map((founder: any, idx: number) => (
                <div key={idx} className="p-4 border border-slate-200 rounded-xl bg-slate-50">
                    <h4 className="font-bold text-sm text-slate-500 uppercase mb-2">Founder {idx + 1}</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <input 
                            type="text" 
                            placeholder="Name"
                            value={founder.name}
                            onChange={(e) => {
                                const newFounders = [...formData.founders];
                                newFounders[idx].name = e.target.value;
                                setFormData({...formData, founders: newFounders});
                            }}
                            className="p-3 border border-slate-200 rounded-lg"
                        />
                        <input 
                            type="text" 
                            placeholder="Role (e.g. CEO)"
                            value={founder.role}
                             onChange={(e) => {
                                const newFounders = [...formData.founders];
                                newFounders[idx].role = e.target.value;
                                setFormData({...formData, founders: newFounders});
                            }}
                            className="p-3 border border-slate-200 rounded-lg"
                        />
                    </div>
                </div>
            ))}
            <button 
                onClick={() => setFormData((prev: any) => ({...prev, founders: [...prev.founders, {name: '', role: ''}]}))}
                className="w-full py-3 border-2 border-dashed border-slate-300 text-slate-500 font-bold rounded-xl hover:border-indigo-400 hover:text-indigo-600 transition-colors"
            >
                + Add Co-Founder
            </button>
         </div>
     </div>
  );
};
