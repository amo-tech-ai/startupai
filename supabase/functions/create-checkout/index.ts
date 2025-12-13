
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@12.0.0";

declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // 1. Authenticate User
    const authHeader = req.headers.get('Authorization')!;
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // 2. Initialize Stripe
    const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecret) throw new Error('Stripe Secret Key missing in environment variables');

    const stripe = new Stripe(stripeSecret, {
      apiVersion: '2022-11-15',
    });

    const { planId, returnUrl } = await req.json();

    // 3. Map planId to Stripe Price ID from Env Vars
    const prices = {
      'founder': Deno.env.get('STRIPE_PRICE_FOUNDER'),
      'growth': Deno.env.get('STRIPE_PRICE_GROWTH')
    };

    const priceId = prices[planId];
    if (!priceId) {
        console.error(`Price ID not found for plan: ${planId}`);
        throw new Error('Invalid plan configuration');
    }

    // 4. Create or Retrieve Stripe Customer
    // Check if user already has a stripe_customer_id in subscriptions table
    const { data: subData } = await supabase
        .from('subscriptions')
        .select('stripe_customer_id')
        .eq('user_id', user.id)
        .maybeSingle();

    let customerId = subData?.stripe_customer_id;

    if (!customerId) {
        // Create new customer in Stripe
        const customer = await stripe.customers.create({
            email: user.email,
            metadata: { user_id: user.id }
        });
        customerId = customer.id;
    }

    // 5. Create Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${returnUrl}?success=true&plan=${planId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${returnUrl}?canceled=true`,
      client_reference_id: user.id,
      metadata: {
        user_id: user.id,
        plan_id: planId
      }
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error("Create Checkout Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
