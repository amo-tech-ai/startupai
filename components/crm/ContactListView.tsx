
import React from 'react';
import { Contact } from '../../types';
import { Mail, Phone, Linkedin, Trash2, User, Building2, Edit2 } from 'lucide-react';

interface ContactListViewProps {
  contacts: Contact[];
  onDelete: (id: string) => void;
  onEdit?: (contact: Contact) => void;
}

export const ContactListView: React.FC<ContactListViewProps> = ({ contacts, onDelete, onEdit }) => {
  
  const getTypeColor = (type?: string) => {
    switch(type) {
        case 'Investor': return 'bg-purple-100 text-purple-700';
        case 'Customer': return 'bg-green-100 text-green-700';
        case 'Lead': return 'bg-blue-100 text-blue-700';
        case 'Partner': return 'bg-amber-100 text-amber-700';
        default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wide">
            <div className="col-span-4">Name</div>
            <div className="col-span-3">Role & Company</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-2">Contact</div>
            <div className="col-span-1 text-right">Actions</div>
        </div>

        {/* List */}
        <div className="divide-y divide-slate-100">
            {contacts.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-sm italic">
                    No contacts found. Add one from the dashboard.
                </div>
            ) : (
                contacts.map((contact) => (
                    <div key={contact.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50/80 transition-colors group">
                        {/* Name */}
                        <div className="col-span-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200">
                                {contact.firstName.charAt(0)}{contact.lastName ? contact.lastName.charAt(0) : ''}
                            </div>
                            <div>
                                <div className="font-bold text-slate-900 text-sm">{contact.firstName} {contact.lastName}</div>
                                {contact.linkedinUrl && (
                                    <a 
                                        href={contact.linkedinUrl} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-0.5"
                                    >
                                        <Linkedin size={10} /> LinkedIn Profile
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Role */}
                        <div className="col-span-3">
                            <div className="text-sm font-medium text-slate-900">{contact.role || '-'}</div>
                            <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                <Building2 size={10} />
                                <span>{/* Company name usually stored in role e.g. "CEO at Acme" or implied */}
                                    {contact.role?.includes(' at ') ? contact.role.split(' at ')[1] : 'Company'}
                                </span>
                            </div>
                        </div>

                        {/* Type */}
                        <div className="col-span-2">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getTypeColor(contact.type)}`}>
                                {contact.type || 'Other'}
                            </span>
                        </div>

                        {/* Contact */}
                        <div className="col-span-2 flex items-center gap-2">
                            {contact.email && (
                                <a href={`mailto:${contact.email}`} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title={contact.email}>
                                    <Mail size={16} />
                                </a>
                            )}
                            {contact.phone && (
                                <a href={`tel:${contact.phone}`} className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors" title={contact.phone}>
                                    <Phone size={16} />
                                </a>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="col-span-1 text-right opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-1">
                            {onEdit && (
                                <button 
                                    onClick={() => onEdit(contact)}
                                    className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                                >
                                    <Edit2 size={16} />
                                </button>
                            )}
                            <button 
                                onClick={() => onDelete(contact.id)}
                                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
  );
};
