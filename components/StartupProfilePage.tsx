
import React, { useState } from 'react';
import { Eye, Edit3, Presentation, CheckCircle2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import { OverviewCard } from './startup-profile/OverviewCard';
import { TeamCard } from './startup-profile/TeamCard';
import { BusinessCard } from './startup-profile/BusinessCard';
import { TractionCard } from './startup-profile/TractionCard';
import { SummaryCard } from './startup-profile/SummaryCard';
import { useNavigate } from 'react-router-dom';

const StartupProfilePage: React.FC = () => {
  const { profile, isLoading } = useData();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'edit' | 'investor'>('edit');

  if (isLoading) return <div className="p-12 text-center">Loading profile...</div>;
  if (!profile) return <div className="p-12 text-center">Profile not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-900">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl pt-4 lg:pt-8 animate-in fade-in duration-500">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-3xl font-bold text-slate-900">{profile.name}</h1>
                    <div className="flex gap-2">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-bold rounded uppercase border border-slate-200">{profile.industry}</span>
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded uppercase border border-indigo-100">{profile.stage}</span>
                    </div>
                </div>
                <p className="text-slate-500">Manage your company profile and investor data.</p>
            </div>

            <div className="flex items-center gap-3">
                <div className="bg-white rounded-lg p-1 border border-slate-200 flex shadow-sm">
                    <button 
                        onClick={() => setViewMode('edit')}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${viewMode === 'edit' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Edit3 size={16} /> Edit
                    </button>
                    <button 
                        onClick={() => setViewMode('investor')}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${viewMode === 'investor' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Eye size={16} /> Preview
                    </button>
                </div>
                <button 
                    onClick={() => navigate('/pitch-decks')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all"
                >
                    <Presentation size={18} /> Generate Deck
                </button>
            </div>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* MAIN COLUMN (8 cols) */}
            <div className="lg:col-span-8 space-y-8">
                <OverviewCard viewMode={viewMode} />
                <BusinessCard viewMode={viewMode} />
                <TractionCard viewMode={viewMode} />
                <TeamCard viewMode={viewMode} />
            </div>

            {/* SIDEBAR COLUMN (4 cols) */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
                <SummaryCard />
                
                {/* Quick Links / Status */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                    <h3 className="font-bold text-slate-900 mb-3">Profile Status</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">Last Updated</span>
                            <span className="font-medium">{new Date(profile.updatedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">Visibility</span>
                            <span className="inline-flex items-center gap-1.5 text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-bold text-xs">
                                <CheckCircle2 size={12} /> Private
                            </span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default StartupProfilePage;
