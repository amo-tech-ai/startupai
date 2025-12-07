
import React, { useState } from 'react';
import { GeneralSettings } from './settings/GeneralSettings';
import { TeamSettings } from './settings/TeamSettings';
import { BillingSettings } from './settings/BillingSettings';

type Tab = 'general' | 'team' | 'billing';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('general');

  return (
    <div className="min-h-screen bg-slate-50 pt-10 px-6 pb-12">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-500">Manage your startup profile, team, and billing.</p>
            </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50">
                <button 
                    onClick={() => setActiveTab('general')}
                    className={`px-6 py-4 text-sm font-bold transition-colors ${activeTab === 'general' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    General Profile
                </button>
                <button 
                    onClick={() => setActiveTab('team')}
                    className={`px-6 py-4 text-sm font-bold transition-colors ${activeTab === 'team' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Team Members
                </button>
                <button 
                    onClick={() => setActiveTab('billing')}
                    className={`px-6 py-4 text-sm font-bold transition-colors ${activeTab === 'billing' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Billing & Plan
                </button>
            </div>

            <div className="p-8">
                {activeTab === 'general' && <GeneralSettings />}
                {activeTab === 'team' && <TeamSettings />}
                {activeTab === 'billing' && <BillingSettings />}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
