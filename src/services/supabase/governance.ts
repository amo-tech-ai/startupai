
import { supabase } from '../../lib/supabaseClient';
import { ProposedAction, ActionStatus } from '../../types';

export const GovernanceService = {
  /**
   * Fetches pending actions for the startup
   */
  async getPendingActions(startupId: string): Promise<ProposedAction[]> {
    if (!supabase) return [];
    const { data } = await supabase
      .from('proposed_actions')
      .select('*')
      .eq('startup_id', startupId)
      .eq('status', 'proposed');
    return data || [];
  },

  /**
   * Finalizes an action (Approve/Reject)
   */
  async updateActionStatus(actionId: string, status: ActionStatus, updatedPayload?: any): Promise<void> {
    if (!supabase) return;
    
    const updates: any = { status, updated_at: new Date().toISOString() };
    if (updatedPayload) updates.payload = updatedPayload;

    const { error } = await supabase
      .from('proposed_actions')
      .update(updates)
      .eq('id', actionId);

    if (error) throw error;

    // If approved, trigger the side-effect (e.g., Edge Function to send email)
    if (status === 'approved') {
        await supabase.functions.invoke('execute-proposed-action', {
            body: { actionId }
        });
    }
  }
};
