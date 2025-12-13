
import { supabase } from "../lib/supabaseClient";

export const BillingService = {
  /**
   * Simulates creating a Stripe Checkout Session.
   * In production, this calls a Supabase Edge Function that interacts with Stripe API.
   */
  async createCheckoutSession(planId: 'founder' | 'growth'): Promise<string> {
    console.log(`[Billing] Creating checkout for ${planId}`);
    
    // 1. Production Path: Call Edge Function
    if (supabase) {
        try {
            /* 
            const { data, error } = await supabase.functions.invoke('create-checkout', {
                body: { planId, returnUrl: window.location.href }
            });
            if (data?.url) return data.url;
            */
        } catch (e) {
            console.warn("Billing Edge Function unavailable", e);
        }
    }

    // 2. Mock Path (Simulation)
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return a fake "success" URL that the component can catch
    return `/settings/billing?success=true&plan=${planId}`;
  },

  /**
   * Simulates opening the Stripe Customer Portal
   */
  async openCustomerPortal(): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `/settings/billing?portal=open`; // Mock redirect
  }
};
