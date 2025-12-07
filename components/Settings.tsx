import React from 'react';

const Settings: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 px-6 pb-12">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Settings</h1>
        
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 space-y-6">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                <input type="text" className="w-full p-2 border border-slate-300 rounded-lg" defaultValue="Acme Corp" />
            </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input type="email" className="w-full p-2 border border-slate-300 rounded-lg" defaultValue="founder@acme.com" />
            </div>
            <div className="pt-4 border-t border-slate-100">
                <button className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium">Save Changes</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;