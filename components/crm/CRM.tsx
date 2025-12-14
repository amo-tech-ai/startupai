
import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  LayoutGrid, 
  List, 
  Users,
  Briefcase,
  Contact as ContactIcon,
  Lock
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';
import { Deal, DealStage, Contact } from '../types';
import { PipelineStats } from './crm/PipelineStats';
import { KanbanBoard } from './crm/KanbanBoard';
import { DealListView } from './crm/DealListView';
import { ContactListView } from './crm/ContactListView';
import { NewDealModal } from './crm/NewDealModal';
import { DealDetailDrawer } from './crm/DealDetailDrawer';
import { AddContactSidebar } from './dashboard/AddContactSidebar';
import { useFeatureAccess } from '../../hooks/useFeatureAccess';
import { UpgradeModal } from '../ui/UpgradeModal';

const CRM: React.FC = () => {
  const { deals, contacts, addDeal, updateDeal, deleteContact } = useData();
  const { canCreateDeal } = useFeatureAccess();
  const [activeTab, setActiveTab] = useState<'pipeline' | 'contacts'>('pipeline');
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals & Drawers
  const [isDealModalOpen, setIsDealModalOpen] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [isContactSidebarOpen, setIsContactSidebarOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [initialStage, setInitialStage] = useState<DealStage>('Lead');
  
  // Detail View State
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  // Stats Calculation
  const totalValue = deals.reduce((acc, deal) => acc + deal.value, 0);
  const activeDeals = deals.filter(d => d.stage !== 'Closed').length;
  const winRate = deals.length > 0 ? Math.round((deals.filter(d => d.stage === 'Closed').length / deals.length) * 100) : 0;

  // Filtering
  const filteredDeals = deals.filter(deal => 
    deal.company.toLowerCase().includes(searchQuery.toLowerCase()) || 
    deal.sector.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredContacts = contacts.filter(c => 
    c.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.role?.toLowerCase().includes(searchQuery.toLowerCase())
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
    let probabilityUpdate = {};
    if (newStage === 'Closed') probabilityUpdate = { probability: 100 };
    else if (newStage === 'Proposal') probabilityUpdate = { probability: 75 };
    else if (newStage === 'Meeting') probabilityUpdate = { probability: 50 };
    else if (newStage === 'Qualified') probabilityUpdate = { probability: 25 };

    updateDeal(dealId, { stage: newStage, ...probabilityUpdate });
  };

  const handleAddContact = () => {
      setSelectedContact(null);
      setIsContactSidebarOpen(true);
  };

  const handleEditContact = (contact: Contact) => {
      setSelectedContact(contact);
      setIsContactSidebarOpen(true);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden relative">
      
      {/* 1. Header & Controls */}
      <div className="px-6 py-6 md:px-8 border-b border-slate-200 bg-white z-10 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Relationships</h1>
            <p className="text-slate-500 text-sm">Manage deals, investors, and key contacts.</p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder={activeTab === 'pipeline' ? "Search deals..." : "Search contacts..."} 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
                />
             </div>
             
             {activeTab === 'pipeline' ? (
                 <button 
                    onClick={() => handleOpenDealModal('Lead')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium shadow-lg transition-all active:scale-95 ${canCreateDeal ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/20' : 'bg-slate-200 text-slate-500 cursor-not-allowed'}`}
                 >
                    {canCreateDeal ? <Plus size={16} /> : <Lock size={16} />} New Deal
                 </button>
             ) : (
                 <button 
                    onClick={handleAddContact}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
                 >
                    <Plus size={16} /> Add Contact
                 </button>
             )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mb-6 border-b border-slate-100">
            <button 
                onClick={() => setActiveTab('pipeline')}
                className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors border-b-2 ${activeTab === 'pipeline' ? 'text-indigo-600 border-indigo-600' : 'text-slate-500 border-transparent hover:text-slate-800'}`}
            >
                <Briefcase size={18} /> Pipeline
            </button>
            <button 
                onClick={() => setActiveTab('contacts')}
                className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors border-b-2 ${activeTab === 'contacts' ? 'text-indigo-600 border-indigo-600' : 'text-slate-500 border-transparent hover:text-slate-800'}`}
            >
                <Users size={18} /> Address Book
            </button>
        </div>

        {/* Stats Bar (Conditional) */}
        {activeTab === 'pipeline' && (
            <PipelineStats 
            totalValue={totalValue} 
            activeDeals={activeDeals} 
            winRate={winRate} 
            />
        )}
        
        {/* View Toggles (Only for Pipeline) */}
        {activeTab === 'pipeline' && (
            <div className="flex items-center gap-2 mt-6 border-b border-slate-200">
                <button 
                    onClick={() => setViewMode('board')}
                    className={`flex items-center gap-2 px-4 py-2 border-b-2 font-medium text-sm transition-colors ${viewMode === 'board' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    <LayoutGrid size={16} /> Kanban Board
                </button>
                <button 
                    onClick={() => setViewMode('list')}
                    className={`flex items-center gap-2 px-4 py-2 border-b-2 font-medium text-sm transition-colors ${viewMode === 'list' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    <List size={16} /> List View
                </button>
            </div>
        )}
      </div>

      {/* 2. Content Area */}
      <div className="flex-1 overflow-hidden p-6 md:p-8 bg-slate-50/50">
        {activeTab === 'pipeline' ? (
            viewMode === 'board' ? (
                <KanbanBoard 
                  deals={filteredDeals} 
                  onAddDeal={handleOpenDealModal}
                  onDealMove={handleDealMove}
                  onDealClick={setSelectedDeal}
                />
            ) : (
                <DealListView 
                  deals={filteredDeals} 
                  onDealClick={setSelectedDeal}
                />
            )
        ) : (
            <div className="h-full overflow-y-auto custom-scrollbar">
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* Contact Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-xs text-slate-500 font-bold uppercase mb-1">Total Contacts</div>
                            <div className="text-2xl font-bold text-slate-900">{contacts.length}</div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-xs text-slate-500 font-bold uppercase mb-1">Investors</div>
                            <div className="text-2xl font-bold text-purple-600">{contacts.filter(c => c.type === 'Investor').length}</div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-xs text-slate-500 font-bold uppercase mb-1">Leads</div>
                            <div className="text-2xl font-bold text-blue-600">{contacts.filter(c => c.type === 'Lead').length}</div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-xs text-slate-500 font-bold uppercase mb-1">Customers</div>
                            <div className="text-2xl font-bold text-green-600">{contacts.filter(c => c.type === 'Customer').length}</div>
                        </div>
                    </div>

                    <ContactListView 
                        contacts={filteredContacts} 
                        onDelete={deleteContact} 
                        onEdit={handleEditContact}
                    />
                </div>
            </div>
        )}
      </div>

      {/* 3. Modals & Drawers */}
      <AnimatePresence>
        {isDealModalOpen && (
          <NewDealModal 
            isOpen={isDealModalOpen} 
            onClose={() => setIsDealModalOpen(false)} 
            onSubmit={handleAddDeal}
            defaultStage={initialStage}
          />
        )}
      </AnimatePresence>

      <UpgradeModal 
        isOpen={showUpgrade} 
        onClose={() => setShowUpgrade(false)} 
        featureName="Unlimited Deals" 
      />

      <AddContactSidebar 
        isOpen={isContactSidebarOpen}
        onClose={() => setIsContactSidebarOpen(false)}
        contact={selectedContact}
      />

      <DealDetailDrawer 
        isOpen={!!selectedDeal}
        deal={selectedDeal}
        onClose={() => setSelectedDeal(null)}
        onUpdate={updateDeal}
        onDelete={(id) => { /* updateDeal handles delete locally implicitly if null passed, but we need specific delete action in context or just filter here */ }}
      />
    </div>
  );
};

export default CRM;
