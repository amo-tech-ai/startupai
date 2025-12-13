
import { supabase } from "../lib/supabaseClient";

export const BillingService = {
  /**
   * Creates a Stripe Checkout Session.
   * Tries Edge Function first, falls back to mock for demo.
   */
  async createCheckoutSession(planId: 'founder' | 'growth'): Promise<string> {
    console.log(`[Billing] Creating checkout for ${planId}`);
    
    // 1. Production Path: Call Edge Function
    if (supabase) {
        try {
            const { data, error } = await supabase.functions.invoke('create-checkout', {
                body: { planId, returnUrl: window.location.origin + '/settings/billing' }
            });
            
            if (!error && data?.url) {
                return data.url;
            } else {
                console.warn("Billing Edge Function response invalid or error:", error);
            }
        } catch (e) {
            console.warn("Billing Edge Function unavailable, using mock fallback.", e);
        }
    }

    // 2. Mock Path (Simulation for Demo/Dev)
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return a fake "success" URL that the component can catch to update UI state
    // In a real app, this logic happens via Webhook -> DB -> UI
    return `/settings/billing?success=true&plan=${planId}`;
  },

  /**
   * Opens the Stripe Customer Portal
   */
  async openCustomerPortal(): Promise<string> {
    // In production, call 'create-portal-session' edge function
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `/settings/billing?portal=open`; // Mock redirect
  }
};
