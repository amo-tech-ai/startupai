import { supabase } from '../../../lib/supabaseClient';
import { EventBudgetItem } from '../../../types';

export const EventFinanceService = {
  async updateBudget(eventId: string, items: EventBudgetItem[]): Promise<void> {
      // Auto-calculate spent amount based on actuals
      const spent = items.reduce((acc, item) => acc + item.actual, 0);
      
      if (!supabase) {
          const events = JSON.parse(localStorage.getItem('guest_events') || '[]');
          const updated = events.map((e: any) => 
              e.id === eventId ? { ...e, budget_items: items, budget_spent: spent } : e
          );
          localStorage.setItem('guest_events', JSON.stringify(updated));
          return;
      }

      await supabase
          .from('events')
          .update({
              budget_data: { items },
              budget_spent: spent
          })
          .eq('id', eventId);
  }
};