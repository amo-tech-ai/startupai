
import React, { useState, useEffect } from 'react';
import { User, Mail, Camera, Save, Loader2, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { useToast } from '../../context/ToastContext';

export const AccountSettings: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.user_metadata?.full_name || '');
      setEmail(user.email || '');
      setAvatarUrl(user.user_metadata?.avatar_url || '');
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      if (supabase) {
        const { error: updateError } = await supabase.auth.updateUser({
          data: { full_name: fullName, avatar_url: avatarUrl }
        });
        if (updateError) throw updateError;
        success("Profile updated successfully");
      } else {
        // Mock update for dev mode
        setTimeout(() => success("Profile updated (Mock)"), 500);
      }
    } catch (err: any) {
      error(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-2xl">
        {/* Profile Header */}
        <div className="flex items-center gap-6">
            <div className="relative group cursor-pointer">
                <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-sm">
                    {avatarUrl ? (
                        <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <User size={40} className="text-slate-400" />
                    )}
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={20} className="text-white" />
                </div>
            </div>
            <div>
                <h3 className="text-xl font-bold text-slate-900">{fullName || 'User'}</h3>
                <p className="text-slate-500 text-sm">{email}</p>
                <div className="mt-2 inline-flex px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded border border-indigo-100 uppercase tracking-wide">
                    Pro Plan
                </div>
            </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-4">Personal Information</h4>
            
            <div className="grid gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 transition-all" 
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="email" 
                            value={email}
                            disabled
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed" 
                        />
                    </div>
                    <p className="text-xs text-slate-400 mt-1 ml-1">Contact support to change your email.</p>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Avatar URL</label>
                    <div className="relative">
                        <Camera className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            value={avatarUrl}
                            onChange={(e) => setAvatarUrl(e.target.value)}
                            placeholder="https://..."
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 transition-all" 
                        />
                    </div>
                </div>
            </div>

            <div className="pt-4 flex justify-end">
                <button 
                    onClick={handleUpdateProfile}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-sm shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-70"
                >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
             <h4 className="font-bold text-slate-900 mb-4">Security</h4>
             <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-700">Password</p>
                    <p className="text-xs text-slate-500">Last changed 3 months ago</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">
                    <Lock size={16} /> Change Password
                </button>
             </div>
        </div>
    </div>
  );
};
