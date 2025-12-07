import { DealStage } from '../../types';

export const CRM_COLUMNS: { id: DealStage; label: string; color: string }[] = [
  { id: 'Lead', label: 'Lead', color: 'border-slate-300' },
  { id: 'Qualified', label: 'Qualified', color: 'border-blue-400' },
  { id: 'Meeting', label: 'Meeting', color: 'border-amber-400' },
  { id: 'Proposal', label: 'Proposal', color: 'border-purple-400' },
  { id: 'Closed', label: 'Closed', color: 'border-green-400' },
];