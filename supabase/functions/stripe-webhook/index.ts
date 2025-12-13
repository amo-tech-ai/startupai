
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@12.0.0";

declare const Deno: any;

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2022-11-15',
});

const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

serve(async (req) => {
  const signature = req.headers.get('stripe-signature');

  if (!signature || !endpointSecret) {
    return new Response('Webhook signature or secret missing', { status: 400 });
  }

  try {
    // 1. Verify Webhook Signature
    const body = await req.text();
    let event;
    try {
        event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } catch (err) {
        console.error(`Webhook signature verification failed.`, err.message);
        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 2. Handle Events
    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object;
            const userId = session.client_reference_id || session.metadata?.user_id;
            const subscriptionId = session.subscription;
            
            if (userId && subscriptionId) {
                const subscription = await stripe.subscriptions.retrieve(subscriptionId);
                await upsertSubscription(supabase, userId, subscription);
            }
            break;
        }
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted': {
            const subscription = event.data.object;
            // We need to find the user_id associated with this customer
            const { data: userData } = await supabase
                .from('subscriptions')
                .select('user_id')
                .eq('stripe_customer_id', subscription.customer)
                .maybeSingle();
            
            if (userData?.user_id) {
                await upsertSubscription(supabase, userData.user_id, subscription);
            } else {
                console.warn(`No user found for customer: ${subscription.customer}`);
            }
            break;
        }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });

  } catch (error: any) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400 }
    );
  }
});

async function upsertSubscription(supabase: any, userId: string, subscription: any) {
    const status = subscription.status;
    // Map product ID to internal plan name if needed, or store the Stripe Product ID
    // For simplicity, we are getting plan ID from metadata or assuming price lookup
    const planId = subscription.metadata?.plan_id || 'pro'; 

    const { error } = await supabase
        .from('subscriptions')
        .upsert({
            user_id: userId,
            stripe_customer_id: subscription.customer,
            stripe_subscription_id: subscription.id,
            status: status,
            plan_id: planId,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

    if (error) {
        console.error('Supabase upsert error:', error);
        throw error;
    }
    
    // Also update the profile 'plan' field for easier frontend access
    if (status === 'active' || status === 'trialing') {
        await supabase.from('profiles').update({ plan: planId }).eq('id', userId);
    } else {
        await supabase.from('profiles').update({ plan: 'free' }).eq('id', userId);
    }
}
