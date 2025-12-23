
import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  LayoutGrid, 
  List, 
  Users,
  Briefcase,
  Trash2,
  Lock
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useData } from '../../context/DataContext';
import { Deal, DealStage, Contact } from '../../types';
import { PipelineStats } from './crm/PipelineStats';
import { KanbanBoard } from './crm/KanbanBoard';
import { DealListView } from './crm/DealListView';
import { ContactListView } from './crm/ContactListView';
import { NewDealModal } from './crm/NewDealModal';
import { DealDetailDrawer } from './crm/DealDetailDrawer';
import { AddContactSidebar } from '../dashboard/AddContactSidebar';
import { useFeatureAccess } from '../../hooks/useFeatureAccess';
import { UpgradeModal } from '../ui/UpgradeModal';
import { UndoToast } from '../ui/UndoToast';
import { CrmService } from '../../services/supabase/crm';

const CRM: React.FC = () => {
  const { deals, contacts, addDeal, updateDeal, performSoftDelete } = useData();
  const { canCreateDeal } = useFeatureAccess();
  const [activeTab, setActiveTab] = useState<'pipeline' | 'contacts' | 'trash'>('pipeline');
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isDealModalOpen, setIsDealModalOpen] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [isContactSidebarOpen, setIsContactSidebarOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [initialStage, setInitialStage] = useState<DealStage>('Lead');
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  const totalValue = deals.reduce((acc, deal) => acc + deal.value, 0);
  const activeDeals = deals.filter(d => d.stage !== 'Closed').length;
  const winRate = deals.length > 0 ? Math.round((deals.filter(d => d.stage === 'Closed').length / deals.length) * 100) : 0;

  const filteredDeals = deals.filter(deal => 
    deal.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredContacts = contacts.filter(c => 
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenDealModal = (stage: DealStage = 'Lead') => {
    if (canCreateDeal) {
        setInitialStage(stage);
        setIsDealModalOpen(true);
    } else {
        setShowUpgrade(true);
    }
  };

  const handleAddDeal = (newDealData: Omit<Deal, 'id' | 'startupId'>) => {
    addDeal(newDealData);
    setIsDealModalOpen(false);
  };

  const handleDealMove = (dealId: string, newStage: DealStage) => {
    updateDeal(dealId, { stage: newStage });
  };

  const handleDeleteDeal = (id: string) => {
    performSoftDelete('deal', id, () => CrmService.softDeleteDeal(id));
    setSelectedDeal(null);
  };

  const handleDeleteContact = (id: string) => {
    performSoftDelete('contact', id, () => CrmService.deleteContact(id));
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden relative">
      <div className="px-6 py-6 md:px-8 border-b border-slate-200 bg-white z-10 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">CRM & Relationships</h1>
            <p className="text-slate-500 text-sm">Manage deals, investors, and network.</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
                />
             </div>
             <button 
                onClick={() => handleOpenDealModal('Lead')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium shadow-lg transition-all active:scale-95 ${canCreateDeal ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/20' : 'bg-slate-200 text-slate-500 cursor-not-allowed'}`}
             >
                {canCreateDeal ? <Plus size={16} /> : <Lock size={16} />} New Deal
             </button>
          </div>
        </div>

        <div className="flex gap-6 mb-6 border-b border-slate-100">
            <button onClick={() => setActiveTab('pipeline')} className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors border-b-2 ${activeTab === 'pipeline' ? 'text-indigo-600 border-indigo-600' : 'text-slate-500 border-transparent hover:text-slate-800'}`}>
                <Briefcase size={18} /> Pipeline
            </button>
            <button onClick={() => setActiveTab('contacts')} className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors border-b-2 ${activeTab === 'contacts' ? 'text-indigo-600 border-indigo-600' : 'text-slate-500 border-transparent hover:text-slate-800'}`}>
                <Users size={18} /> Contacts
            </button>
            <button onClick={() => setActiveTab('trash')} className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors border-b-2 ${activeTab === 'trash' ? 'text-rose-600 border-rose-600' : 'text-slate-500 border-transparent hover:text-slate-800'}`}>
                <Trash2 size={18} /> Archive
            </button>
        </div>

        {activeTab === 'pipeline' && (
            <PipelineStats totalValue={totalValue} activeDeals={activeDeals} winRate={winRate} />
        )}
      </div>

      <div className="flex-1 overflow-hidden p-6 md:p-8 bg-slate-50/50">
        {activeTab === 'pipeline' ? (
            viewMode === 'board' ? (
                <KanbanBoard deals={filteredDeals} onAddDeal={handleOpenDealModal} onDealMove={handleDealMove} onDealClick={setSelectedDeal} />
            ) : (
                <DealListView deals={filteredDeals} onDealClick={setSelectedDeal} />
            )
        ) : activeTab === 'contacts' ? (
            <ContactListView contacts={filteredContacts} onDelete={handleDeleteContact} onEdit={(c) => { setSelectedContact(c); setIsContactSidebarOpen(true); }} />
        ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 h-full flex flex-col items-center justify-center">
                <Trash2 size={48} className="mb-4 opacity-10" />
                <p className="max-w-xs leading-relaxed">Deleted items are archived in your backend and can be recovered by support if needed.</p>
            </div>
        )}
      </div>

      <AnimatePresence>
        {isDealModalOpen && <NewDealModal isOpen={isDealModalOpen} onClose={() => setIsDealModalOpen(false)} onSubmit={handleAddDeal} defaultStage={initialStage} />}
      </AnimatePresence>
      <UpgradeModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} featureName="Unlimited Deals" />
      <AddContactSidebar isOpen={isContactSidebarOpen} onClose={() => setIsContactSidebarOpen(false)} contact={selectedContact} />
      <DealDetailDrawer isOpen={!!selectedDeal} deal={selectedDeal} onClose={() => setSelectedDeal(null)} onUpdate={updateDeal} onDelete={handleDeleteDeal} />
      
      {/* Production UI Safety */}
      <UndoToast />
    </div>
  );
};

export default CRM;
