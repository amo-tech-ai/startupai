
import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { 
  Save, Building2, DollarSign, Globe, Check, 
  CreditCard, Plus, Trash2, Mail, Linkedin 
} from 'lucide-react';
import { Founder } from '../types';
import { generateShortId } from '../lib/utils';

type Tab = 'general' | 'team' | 'billing';

const Settings: React.FC = () => {
  const { profile, founders, updateProfile, addFounder, removeFounder, isLoading } = useData();
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [formData, setFormData] = useState({
      name: '',
      websiteUrl: '',
      tagline: '',
      mission: '',
      fundingGoal: 0
  });
  const [isSaved, setIsSaved] = useState(false);

  // Team State
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');

  // Billing State
  const [billingPlan, setBillingPlan] = useState<'free' | 'founder' | 'growth'>('founder');

  useEffect(() => {
    if (profile) {
        setFormData({
            name: profile.name,
            websiteUrl: profile.websiteUrl || '',
            tagline: profile.tagline,
            mission: profile.mission,
            fundingGoal: profile.fundingGoal
        });
    }
  }, [profile]);

  const handleSave = () => {
    updateProfile(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleAddMember = () => {
      if (newMemberName.trim() && newMemberRole.trim()) {
          const newFounder: Founder = {
              id: generateShortId(),
              startupId: profile?.id || 'temp',
              name: newMemberName,
              title: newMemberRole,
              bio: '',
              isPrimaryContact: false
          };
          addFounder(newFounder);
          setNewMemberName('');
          setNewMemberRole('');
      }
  };

  const handleDeleteWorkspace = () => {
      if (confirm("Are you sure? This will reset all local data and redirect to the home page.")) {
          // In a real app, this would delete the row from DB via context
          window.location.href = '/';
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-10 px-6 pb-12">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-500">Manage your startup profile, team, and billing.</p>
            </div>
            {activeTab === 'general' && (
                <button 
                    onClick={handleSave}
                    disabled={isLoading}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-white transition-all shadow-lg ${isSaved ? 'bg-green-600 shadow-green-600/20' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'}`}
                >
                    {isSaved ? <Check size={18} /> : <Save size={18} />}
                    {isSaved ? 'Saved!' : 'Save Changes'}
                </button>
            )}
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
                {/* --- GENERAL TAB --- */}
                {activeTab === 'general' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Startup Name</label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input 
                                        type="text" 
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900" 
                                    />
                                </div>
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Website URL</label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input 
                                        type="text" 
                                        value={formData.websiteUrl}
                                        onChange={(e) => setFormData({...formData, websiteUrl: e.target.value})}
                                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900" 
                                    />
                                </div>
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Tagline</label>
                                <input 
                                    type="text" 
                                    value={formData.tagline}
                                    onChange={(e) => setFormData({...formData, tagline: e.target.value})}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900" 
                                />
                                <p className="text-xs text-slate-500 mt-1">Displayed on your dashboard header.</p>
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Mission Statement</label>
                                <textarea 
                                    value={formData.mission}
                                    onChange={(e) => setFormData({...formData, mission: e.target.value})}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 h-24 resize-none" 
                                />
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Funding Goal</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input 
                                        type="number" 
                                        value={formData.fundingGoal}
                                        onChange={(e) => setFormData({...formData, fundingGoal: Number(e.target.value)})}
                                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900" 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100">
                            <h3 className="text-sm font-bold text-slate-900 mb-4">Danger Zone</h3>
                            <button 
                                onClick={handleDeleteWorkspace}
                                className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                            >
                                Delete Workspace
                            </button>
                        </div>
                    </div>
                )}

                {/* --- TEAM TAB --- */}
                {activeTab === 'team' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-slate-900">Founding Team</h3>
                            <span className="text-sm text-slate-500">{founders.length} Members</span>
                        </div>

                        <div className="space-y-3">
                            {founders.map((founder) => (
                                <div key={founder.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                                            {founder.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 flex items-center gap-2">
                                                {founder.name}
                                                {founder.isPrimaryContact && <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide">Primary</span>}
                                            </div>
                                            <div className="text-sm text-slate-500">{founder.title}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {founder.linkedinProfile && (
                                            <a href={founder.linkedinProfile} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                                                <Linkedin size={18} />
                                            </a>
                                        )}
                                        {founder.email && (
                                            <a href={`mailto:${founder.email}`} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
                                                <Mail size={18} />
                                            </a>
                                        )}
                                        <button 
                                            onClick={() => removeFounder(founder.id)}
                                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors ml-2"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-6">
                            <h4 className="text-sm font-bold text-slate-900 mb-3">Add Team Member</h4>
                            <div className="flex gap-3">
                                <input 
                                    type="text" 
                                    placeholder="Full Name"
                                    value={newMemberName}
                                    onChange={(e) => setNewMemberName(e.target.value)}
                                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                                />
                                <input 
                                    type="text" 
                                    placeholder="Role / Title"
                                    value={newMemberRole}
                                    onChange={(e) => setNewMemberRole(e.target.value)}
                                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                                />
                                <button 
                                    onClick={handleAddMember}
                                    disabled={!newMemberName || !newMemberRole}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    <Plus size={16} /> Add
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- BILLING TAB --- */}
                {activeTab === 'billing' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { id: 'free', name: 'Starter', price: '$0', features: ['1 Project', 'Basic AI'] },
                                { id: 'founder', name: 'Founder', price: '$29', features: ['Unlimited Projects', 'Full AI Suite', 'CRM Access', 'Export to PDF'], popular: true },
                                { id: 'growth', name: 'Growth', price: '$79', features: ['Everything in Founder', 'Team Collaboration', 'Priority Support', 'Data Room'] }
                            ].map((plan) => (
                                <div 
                                    key={plan.id}
                                    onClick={() => setBillingPlan(plan.id as any)}
                                    className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                                        billingPlan === plan.id 
                                        ? 'border-indigo-600 bg-indigo-50 shadow-md transform scale-105' 
                                        : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                                    }`}
                                >
                                    {plan.popular && (
                                        <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-bl-xl rounded-tr-lg">
                                            Popular
                                        </div>
                                    )}
                                    <h3 className="font-bold text-slate-900">{plan.name}</h3>
                                    <div className="text-3xl font-bold text-slate-900 my-2">{plan.price}<span className="text-sm font-normal text-slate-500">/mo</span></div>
                                    <ul className="space-y-2 mt-4">
                                        {plan.features.map((f, i) => (
                                            <li key={i} className="text-sm text-slate-600 flex items-center gap-2">
                                                <Check size={14} className="text-green-500" /> {f}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className={`mt-6 w-full h-2 rounded-full ${billingPlan === plan.id ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                                    <CreditCard size={24} className="text-slate-600" />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900">Payment Method</div>
                                    <div className="text-sm text-slate-500">Visa ending in 4242 • Expires 12/25</div>
                                </div>
                            </div>
                            <button className="text-sm font-bold text-indigo-600 hover:underline">Update Card</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
