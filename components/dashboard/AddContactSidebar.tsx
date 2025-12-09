
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Loader2, User, Briefcase, Building2, Mail, Phone, Tag, Save, Edit } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { ContactAI } from '../../services/contactAI';
import { API_KEY } from '../../lib/env';
import { useData } from '../../context/DataContext';
import { ContactType, Contact } from '../../types';

interface AddContactSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  contact?: Contact | null; // Optional: If provided, mode switches to Edit
}

// Workaround for framer-motion types
const MotionDiv = motion.div as any;

export const AddContactSidebar: React.FC<AddContactSidebarProps> = ({ isOpen, onClose, contact }) => {
  const { addDeal, addContact, updateContact } = useData(); 
  const { toast, success, error } = useToast();
  
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    role: '',
    company: '',
    email: '',
    phone: '',
    contactType: 'Lead' as ContactType,
    tags: [] as string[],
    notes: '',
    sector: ''
  });

  // Populate form when contact prop changes (Edit Mode)
  useEffect(() => {
    if (contact) {
      setFormData({
        fullName: `${contact.firstName} ${contact.lastName}`.trim(),
        role: contact.role || '',
        company: '', 
        email: contact.email || '',
        phone: contact.phone || '',
        contactType: contact.type || 'Lead',
        tags: contact.tags || [],
        notes: contact.notes || '',
        sector: ''
      });
      // Extract company from role if formatted as "Role at Company"
      if (contact.role && contact.role.includes(' at ')) {
          const parts = contact.role.split(' at ');
          if (parts.length > 1) {
              setFormData(prev => ({
                  ...prev,
                  role: parts[0],
                  company: parts[1]
              }));
          }
      }
    } else {
      // Reset for Add Mode
      setFormData({
        fullName: '', role: '', company: '', email: '', phone: '', contactType: 'Lead', tags: [], notes: '', sector: ''
      });
      setUrl('');
    }
  }, [contact, isOpen]);

  const handleSmartAutofill = async () => {
    if (!url.trim()) return;
    if (!API_KEY) {
      error("API Key missing");
      return;
    }

    setIsAnalyzing(true);
    toast("AI is analyzing the URL...", "info");

    try {
      const data = await ContactAI.extractFromUrl(API_KEY, url);
      if (data) {
        setFormData(prev => ({
          ...prev,
          fullName: data.full_name || prev.fullName,
          role: data.role || prev.role,
          company: data.company || prev.company,
          email: data.email || prev.email,
          tags: (Array.isArray(data.tags) && data.tags.length > 0) ? data.tags : prev.tags,
          notes: data.summary ? (prev.notes ? `${data.summary}\n\n${prev.notes}` : data.summary) : prev.notes,
          sector: data.sector || prev.sector || 'Tech'
        }));
        success("✅ Data imported from URL. Review before saving.");
      } else {
        error("We couldn't read that URL. Please check the link or fill fields manually.");
      }
    } catch (e) {
      console.error(e);
      error("We couldn't read that URL. Please check the link or fill fields manually.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveContact = async () => {
    if (!formData.fullName) {
      error("Full Name is required.");
      return;
    }

    setIsSaving(true);

    try {
      const nameParts = formData.fullName.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
      
      // Compose Role to include Company if present
      let finalRole = formData.role;
      if (formData.company && !finalRole.includes(' at ')) {
          finalRole = `${formData.role} at ${formData.company}`;
      } else if (!finalRole && formData.company) {
          finalRole = `at ${formData.company}`;
      }

      if (contact) {
          await updateContact(contact.id, {
            firstName,
            lastName,
            email: formData.email,
            phone: formData.phone,
            role: finalRole,
            type: formData.contactType,
            linkedinUrl: url.includes('linkedin') ? url : contact.linkedinUrl,
            tags: formData.tags,
            notes: formData.notes
          });
          success("Contact updated.");
      } else {
          await addContact({
            firstName,
            lastName,
            email: formData.email || undefined,
            phone: formData.phone || undefined,
            role: finalRole,
            type: formData.contactType,
            linkedinUrl: url.includes('linkedin') ? url : undefined,
            tags: formData.tags,
            notes: formData.notes
          });

          // Create associated Deal if it's a Lead (to update Dashboard snapshot)
          if (formData.contactType === 'Lead' || formData.contactType === 'Customer') {
            await addDeal({
              company: formData.company || 'Unknown Company',
              value: 0, 
              stage: 'Lead',
              probability: 10,
              sector: formData.sector || 'Tech',
              nextAction: 'Initial Outreach',
              dueDate: 'Next Week',
              ownerInitial: 'ME', 
              ownerColor: 'bg-indigo-500'
            });
          }
          success("Contact added to CRM.");
      }
      onClose();
    } catch (e) {
      console.error(e);
      error("There was a problem saving this contact. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
          />

          <MotionDiv
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    {contact ? <Edit size={20} className="text-indigo-600"/> : <User size={20} className="text-indigo-600"/>}
                    {contact ? 'Edit Contact' : 'Add New Contact'}
                </h2>
                <p className="text-sm text-slate-500">
                    {contact ? 'Update contact details and notes.' : 'Capture a new investor, lead, or partner.'}
                </p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* AI Section */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100">
                <label className="block text-xs font-bold text-indigo-900 uppercase mb-2 flex items-center gap-1">
                  <Sparkles size={12} className="text-indigo-600"/> Smart Autofill with AI
                </label>
                <div className="flex gap-2">
                  <input 
                    type="url" 
                    placeholder="https://linkedin.com/in/... or company site"
                    className="flex-1 px-3 py-2 text-sm border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  <button 
                    onClick={handleSmartAutofill}
                    disabled={isAnalyzing || !url}
                    className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                  >
                    {isAnalyzing ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                  </button>
                </div>
                <p className="text-[10px] text-indigo-400 mt-2 leading-relaxed">
                  Paste a LinkedIn or website URL and let AI pull key details into this contact.
                </p>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text" 
                      value={formData.fullName}
                      onChange={e => setFormData({...formData, fullName: e.target.value})}
                      className="w-full pl-9 p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="e.g. Sarah Connor"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Role / Title</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="text" 
                        value={formData.role}
                        onChange={e => setFormData({...formData, role: e.target.value})}
                        className="w-full pl-9 p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="CTO"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="text" 
                        value={formData.company}
                        onChange={e => setFormData({...formData, company: e.target.value})}
                        className="w-full pl-9 p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="Skynet"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-9 p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="sarah@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone (Optional)</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full pl-9 p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contact Type</label>
                  <select 
                    value={formData.contactType}
                    onChange={e => setFormData({...formData, contactType: e.target.value as ContactType})}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  >
                    <option value="Lead">Lead</option>
                    <option value="Investor">Investor</option>
                    <option value="Customer">Customer</option>
                    <option value="Partner">Partner</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tags</label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text" 
                      placeholder='e.g. "Fintech", "Pre-seed", "Warm intro"'
                      value={formData.tags.join(', ')}
                      onChange={e => setFormData({...formData, tags: e.target.value.split(',').map(t => t.trim())})}
                      className="w-full pl-9 p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                  <textarea 
                    value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                    className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none h-24 resize-none"
                    placeholder="Notes about the contact..."
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={onClose}
                className="px-5 py-2.5 border border-slate-200 rounded-lg text-slate-600 font-bold text-sm hover:bg-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveContact}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all active:scale-95 disabled:opacity-70"
              >
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {isSaving ? 'Saving...' : (contact ? 'Update Contact' : 'Save Contact')}
              </button>
            </div>
          </MotionDiv>
        </>
      )}
    </AnimatePresence>
  );
};
