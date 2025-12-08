
import React from 'react';
import { User, Construction } from 'lucide-react';

const Profile: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-slate-50 min-h-[80vh]">
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 max-w-lg w-full">
        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600">
          <User size={40} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">My Profile</h1>
        <p className="text-slate-500 mb-8">
          The new LinkedIn-style founder profile is currently under construction.
          Please check back soon for updates.
        </p>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg text-slate-600 text-sm font-medium">
          <Construction size={16} />
          <span>Work in Progress</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
