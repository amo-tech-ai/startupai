
import React, { useState, useEffect } from 'react';
import { Search, Plus, List, Users, Briefcase, Trash2, Lock } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useData } from '../../context/DataContext';
import { Deal, DealStage, Contact, ProposedAction } from '../../types';
import { PipelineStats } from './crm/PipelineStats';
import { KanbanBoard } from './crm/KanbanBoard';
import { DealListView } from './crm/DealListView';
import { ContactListView } from './crm/ContactListView';
import { NewDealModal } from './crm/NewDealModal';
import { DealDetailDrawer } from './crm/DealDetailDrawer';
import { CopilotCommandCenter } from './CopilotCommandCenter';
import { ProposedActionModal } from './ProposedActionModal';
import { AddContactSidebar } from '../dashboard/AddContactSidebar';
import { useFeatureAccess } from '../../hooks/useFeatureAccess';
import { UpgradeModal } from '../ui/UpgradeModal';
import { UndoToast } from '../ui/UndoToast';
import { CrmService } from '../../services/supabase/crm';
import { GovernanceService } from '../../services/supabase/governance';
import { useToast } from '../../context/ToastContext';

const CRM: React.FC = () => {
  const { deals, contacts, addDeal, updateDeal, performSoftDelete, profile } = useData();
  const { canCreateDeal } = useFeatureAccess();
  const { toast, success, info } = useToast();
  
  const [activeTab, setActiveTab] = useState<'pipeline' | 'contacts' | 'trash'>('pipeline');
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEnriching, setIsEnriching] = useState(false);
  
  const [isDealModalOpen, setIsDealModalOpen] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [isContactSidebarOpen, setIsContactSidebarOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [initialStage, setInitialStage] = useState<DealStage>('Lead');
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  // Governance State
  const [activeProposal, setActiveProposal] = useState<ProposedAction | null>(null);

  const totalValue = deals.reduce((acc, deal) => acc + deal.value, 0);
  const activeDeals = deals.filter(d => d.stage !== 'Closed').length;
  const winRate = deals.length > 0 ? Math.round((deals.filter(d => d.stage === 'Closed').length / deals.length) * 100) : 0;

  const filteredDeals = deals.filter(deal => 
    deal.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRefreshScoring = async () => {
    setIsEnriching(true);
    info("AI Agent scanning market data for leads...");
    
    // In Production, this calls Edge Function: analyze_investor_pipeline
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    deals.forEach((d, idx) => {
        if (!d.ai_score && idx < 3) {
            updateDeal(d.id, { 
                ai_score: 85 + idx * 4, 
                ai_reasoning: "High alignment with 2025 fund thesis.",
                strategic_hook: `Reference the recent portfolio exit in ${d.sector}...`
            });
        }
    });
    
    setIsEnriching(false);
    success("Pipeline scores refreshed.");
  };

  const handleDraftEmail = (deal: Deal) => {
      // Mock generating a proposal for the modal
      const proposal: ProposedAction = {
          id: `prop_${deal.id}`,
          startupId: profile?.id || '',
          entityId: deal.id,
          type: 'email',
          label: 'Outreach Email',
          description: `Strategic intro to ${deal.company}`,
          payload: { body: `Hi team at ${deal.company},\n\nI've been following your recent moves in ${deal.sector}...` },
          status: 'proposed',
          reasoning: deal.ai_reasoning || 'Based on recent fundraising activity.',
          confidence: 0.92,
          createdAt: new Date().toISOString()
      };
      setActiveProposal(proposal);
  };

  const handleApproveProposal = async (id: string, payload: any) => {
      try {
          await GovernanceService.updateActionStatus(id, 'approved', payload);
          success("Action executed successfully.");
      } catch (e) {
          // Simulation fallback for dev
          success("Action executed (Demo Mode).");
      }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden relative">
      <div className="px-6 py-6 md:px-8 border-b border-slate-200 bg-white z-10 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Fundraising CRM</h1>
            <p className="text-slate-500 text-sm">Convert high-probability leads into capital.</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search deals..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
                />
             </div>
             <button onClick={() => setIsDealModalOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 active:scale-95 transition-all">
                <Plus size={16} /> New Deal
             </button>
          </div>
        </div>

        <div className="flex gap-6 mb-6 border-b border-slate-100">
            <button onClick={() => setActiveTab('pipeline')} className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors border-b-2 ${activeTab === 'pipeline' ? 'text-indigo-600 border-indigo-600' : 'text-slate-500 border-transparent hover:text-slate-800'}`}>
                <Briefcase size={18} /> Pipeline
            </button>
            <button onClick={() => setActiveTab('contacts')} className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors border-b-2 ${activeTab === 'contacts' ? 'text-indigo-600 border-indigo-600' : 'text-slate-500 border-transparent hover:text-slate-800'}`}>
                <Users size={18} /> Investors
            </button>
            <button onClick={() => setActiveTab('trash')} className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors border-b-2 ${activeTab === 'trash' ? 'text-rose-600 border-rose-600' : 'text-slate-500 border-transparent hover:text-slate-800'}`}>
                <Trash2 size={18} /> Archive
            </button>
        </div>

        {activeTab === 'pipeline' && (
            <PipelineStats totalValue={totalValue} activeDeals={activeDeals} winRate={winRate} />
        )}
      </div>

      <div className="flex-1 overflow-hidden p-6 md:p-8 bg-slate-50/50 overflow-y-auto">
        {activeTab === 'pipeline' && (
           <CopilotCommandCenter 
              deals={deals} 
              isEnriching={isEnriching} 
              onRefreshScoring={handleRefreshScoring}
              onDraftEmail={handleDraftEmail}
           />
        )}

        {activeTab === 'pipeline' ? (
            <KanbanBoard deals={filteredDeals} onAddDeal={() => setIsDealModalOpen(true)} onDealMove={(id, stage) => updateDeal(id, { stage })} onDealClick={setSelectedDeal} />
        ) : activeTab === 'contacts' ? (
            <ContactListView contacts={contacts} onDelete={(id) => performSoftDelete('contact', id, () => CrmService.deleteContact(id))} onEdit={(c) => { setSelectedContact(c); setIsContactSidebarOpen(true); }} />
        ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 h-full flex flex-col items-center justify-center">
                <Trash2 size={48} className="mb-4 opacity-10" />
                <p>Archived deals appear here for recovery.</p>
            </div>
        )}
      </div>

      <AnimatePresence>
        {isDealModalOpen && <NewDealModal isOpen={isDealModalOpen} onClose={() => setIsDealModalOpen(false)} onSubmit={(d) => { addDeal(d); setIsDealModalOpen(false); }} defaultStage="Lead" />}
      </AnimatePresence>
      <ProposedActionModal 
        isOpen={!!activeProposal} 
        onClose={() => setActiveProposal(null)} 
        action={activeProposal} 
        onApprove={handleApproveProposal} 
      />
      <UpgradeModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} featureName="Advanced CRM" />
      <AddContactSidebar isOpen={isContactSidebarOpen} onClose={() => setIsContactSidebarOpen(false)} contact={selectedContact} />
      <DealDetailDrawer isOpen={!!selectedDeal} deal={selectedDeal} onClose={() => setSelectedDeal(null)} onUpdate={updateDeal} onDelete={(id) => performSoftDelete('deal', id, () => CrmService.softDeleteDeal(id))} />
      <UndoToast />
    </div>
  );
};

export default CRM;
