
import React from 'react';
import { GeneralSettings } from './settings/GeneralSettings';
import { TeamSettings } from './settings/TeamSettings';
import { BillingSettings } from './settings/BillingSettings';
import { AccountSettings } from './settings/AccountSettings';
import { useParams, useNavigate } from 'react-router-dom';

type Tab = 'account' | 'general' | 'team' | 'billing';

const Settings: React.FC = () => {
  const { tab } = useParams<{ tab: string }>();
  const navigate = useNavigate();
  
  // Default to account if no tab is specified
  const activeTab: Tab = (tab && ['account', 'general', 'team', 'billing'].includes(tab)) 
    ? (tab as Tab) 
    : 'account';

  const handleTabChange = (newTab: Tab) => {
    navigate(`/settings/${newTab}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-10 px-6 pb-12">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-500">Manage your account, team, and billing details.</p>
            </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto">
                <button 
                    onClick={() => handleTabChange('account')}
                    className={`px-6 py-4 text-sm font-bold transition-colors whitespace-nowrap ${activeTab === 'account' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    My Account
                </button>
                <button 
                    onClick={() => handleTabChange('general')}
                    className={`px-6 py-4 text-sm font-bold transition-colors whitespace-nowrap ${activeTab === 'general' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Startup Profile
                </button>
                <button 
                    onClick={() => handleTabChange('team')}
                    className={`px-6 py-4 text-sm font-bold transition-colors whitespace-nowrap ${activeTab === 'team' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Team Members
                </button>
                <button 
                    onClick={() => handleTabChange('billing')}
                    className={`px-6 py-4 text-sm font-bold transition-colors whitespace-nowrap ${activeTab === 'billing' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Billing & Plan
                </button>
            </div>

            <div className="p-8">
                {activeTab === 'account' && <AccountSettings />}
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
