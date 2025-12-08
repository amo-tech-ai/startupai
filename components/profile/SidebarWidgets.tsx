
import React, { useState, useEffect } from 'react';
import { Trophy, Globe, Linkedin, Twitter, Mail, Phone, Settings, Shield, Edit2, Save, X, Github } from 'lucide-react';
import { UserProfile } from '../../types';
import { useToast } from '../../context/ToastContext';

interface SidebarWidgetsProps {
  user: UserProfile;
  onUpdate: (data: Partial<UserProfile>) => void;
}

export const SidebarWidgets: React.FC<SidebarWidgetsProps> = ({ user, onUpdate }) => {
  const [isEditingSocials, setIsEditingSocials] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [score, setScore] = useState(0);
  const { success } = useToast();
  
  const [socialsForm, setSocialsForm] = useState(user.socials);
  const [contactForm, setContactForm] = useState({ phone: user.phone || '', email: user.email });

  // Sync local state when user prop updates (e.g. after LinkedIn Sync)
  useEffect(() => {
    setSocialsForm(user.socials);
    setContactForm({ phone: user.phone || '', email: user.email });
  }, [user.socials, user.phone, user.email]);

  // Calculate score dynamically
  useEffect(() => {
    let s = 0;
    if (user.fullName) s += 10;
    if (user.headline) s += 10;
    if (user.location) s += 5;
    if (user.avatarUrl) s += 10;
    if (user.bio) s += 10;
    if (user.experiences && user.experiences.length > 0) s += 20;
    if (user.education && user.education.length > 0) s += 10;
    if (user.skills && user.skills.length > 0) s += 10;
    if (user.socials?.linkedin) s += 15;
    setScore(Math.min(s, 100));
  }, [user]);

  const handleSaveSocials = () => {
    onUpdate({ socials: socialsForm });
    setIsEditingSocials(false);
    success("Social links updated");
  };

  const handleSaveContact = () => {
    onUpdate({ phone: contactForm.phone }); 
    setIsEditingContact(false);
    success("Contact info updated");
  };

  return (
    <div className="space-y-6">
      
      {/* Profile Completion */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2 text-indigo-700 font-bold">
            <Trophy size={18} />
            <h3>Profile Strength</h3>
          </div>
          <span className="text-lg font-bold text-slate-900">{score}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 mb-4 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${
              score < 50 ? 'bg-red-500' : score < 80 ? 'bg-amber-500' : 'bg-green-500'
            }`} 
            style={{ width: `${score}%` }}
          ></div>
        </div>
        <p className="text-xs text-slate-500">
          Complete your profile to unlock more AI features and investor matching.
        </p>
      </div>

      {/* Social Links */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative group">
        <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900">Social Presence</h3>
            {!isEditingSocials && (
                <button 
                    onClick={() => { setSocialsForm(user.socials); setIsEditingSocials(true); }}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                    <Edit2 size={16} />
                </button>
            )}
        </div>

        {isEditingSocials ? (
            <div className="space-y-3">
                <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="LinkedIn URL"
                        value={socialsForm.linkedin || ''}
                        onChange={(e) => setSocialsForm({...socialsForm, linkedin: e.target.value})}
                        className="w-full pl-9 p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
                <div className="relative">
                    <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Twitter URL"
                        value={socialsForm.twitter || ''}
                        onChange={(e) => setSocialsForm({...socialsForm, twitter: e.target.value})}
                        className="w-full pl-9 p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
                <div className="relative">
                    <Github className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="GitHub URL"
                        value={socialsForm.github || ''}
                        onChange={(e) => setSocialsForm({...socialsForm, github: e.target.value})}
                        className="w-full pl-9 p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
                <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Website URL"
                        value={socialsForm.website || ''}
                        onChange={(e) => setSocialsForm({...socialsForm, website: e.target.value})}
                        className="w-full pl-9 p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                    <button onClick={() => setIsEditingSocials(false)} className="p-1.5 text-slate-500 hover:bg-slate-100 rounded">
                        <X size={18} />
                    </button>
                    <button onClick={handleSaveSocials} className="p-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                        <Save size={18} />
                    </button>
                </div>
            </div>
        ) : (
            <div className="space-y-4">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-[#0077b5] flex items-center justify-center text-white">
                <Linkedin size={16} />
                </div>
                {user.socials.linkedin ? (
                <a href={user.socials.linkedin} target="_blank" rel="noreferrer" className="text-sm text-slate-600 hover:text-indigo-600 truncate max-w-[200px]">
                    {user.socials.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}
                </a>
                ) : (
                <span className="text-sm text-slate-400 italic">Add LinkedIn</span>
                )}
            </div>
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-black flex items-center justify-center text-white">
                <Twitter size={16} />
                </div>
                {user.socials.twitter ? (
                <a href={user.socials.twitter} target="_blank" rel="noreferrer" className="text-sm text-slate-600 hover:text-indigo-600 truncate max-w-[200px]">
                    {user.socials.twitter.replace(/^https?:\/\/(www\.)?twitter\.com\//, '@')}
                </a>
                ) : (
                <span className="text-sm text-slate-400 italic">Add Twitter</span>
                )}
            </div>
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-white">
                <Github size={16} />
                </div>
                {user.socials.github ? (
                <a href={user.socials.github} target="_blank" rel="noreferrer" className="text-sm text-slate-600 hover:text-indigo-600 truncate max-w-[200px]">
                    {user.socials.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
                </a>
                ) : (
                <span className="text-sm text-slate-400 italic">Add GitHub</span>
                )}
            </div>
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200">
                <Globe size={16} />
                </div>
                {user.socials.website ? (
                <a href={user.socials.website} target="_blank" rel="noreferrer" className="text-sm text-slate-600 hover:text-indigo-600 truncate max-w-[200px]">
                    {user.socials.website.replace(/^https?:\/\/(www\.)?/, '')}
                </a>
                ) : (
                <span className="text-sm text-slate-400 italic">Add Website</span>
                )}
            </div>
            </div>
        )}
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative group">
        <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900">Contact Info</h3>
            {!isEditingContact && (
                <button 
                    onClick={() => { setContactForm({phone: user.phone || '', email: user.email}); setIsEditingContact(true); }}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                    <Edit2 size={16} />
                </button>
            )}
        </div>
        
        {isEditingContact ? (
            <div className="space-y-3">
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        value={contactForm.email}
                        disabled
                        className="w-full pl-9 p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-500 cursor-not-allowed"
                    />
                </div>
                <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Phone Number"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                        className="w-full pl-9 p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                    <button onClick={() => setIsEditingContact(false)} className="p-1.5 text-slate-500 hover:bg-slate-100 rounded">
                        <X size={18} />
                    </button>
                    <button onClick={handleSaveContact} className="p-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                        <Save size={18} />
                    </button>
                </div>
            </div>
        ) : (
            <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                    <Mail size={16} className="text-slate-400" />
                    <a href={`mailto:${user.email}`} className="text-slate-600 hover:text-indigo-600 truncate">{user.email}</a>
                </div>
                {user.phone ? (
                    <div className="flex items-center gap-3">
                    <Phone size={16} className="text-slate-400" />
                    <span className="text-slate-600">{user.phone}</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-3 text-slate-400 italic">
                        <Phone size={16} />
                        <span>Add Phone</span>
                    </div>
                )}
            </div>
        )}
      </div>

      {/* Settings Teaser */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-2">
        <button className="w-full flex items-center justify-between text-sm font-medium text-slate-600 hover:text-indigo-600 group">
          <span className="flex items-center gap-2"><Settings size={16}/> AI Preferences</span>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
        </button>
        <div className="h-px bg-slate-200 w-full"></div>
        <button className="w-full flex items-center justify-between text-sm font-medium text-slate-600 hover:text-indigo-600 group">
          <span className="flex items-center gap-2"><Shield size={16}/> Security</span>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
        </button>
      </div>

    </div>
  );
};
