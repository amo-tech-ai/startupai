import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get User from Auth Header to verify ownership
    const authHeader = req.headers.get('Authorization')!;
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
    }

    const { startup_id, context, founders, metrics } = await req.json();

    // 1. Verify Ownership (RLS Check via Service Role or Manual)
    const { data: startup } = await supabase.from('startups').select('user_id').eq('id', startup_id).single();
    if (!startup || startup.user_id !== user.id) {
        return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: corsHeaders });
    }

    // 2. Transactional Updates (Simulated via sequential awaits in Supabase JS)
    
    // A. Update Context
    if (context) {
        await supabase.from('startups').update(context).eq('id', startup_id);
    }

    // B. Update Founders (Upsert)
    if (founders && founders.length > 0) {
        const foundersPayload = founders.map((f: any) => ({ ...f, startup_id }));
        await supabase.from('startup_founders').upsert(foundersPayload);
    }

    // C. Insert Metrics Snapshot
    if (metrics) {
        const metricsPayload = { ...metrics, startup_id, snapshot_date: new Date() };
        await supabase.from('startup_metrics_snapshots').insert(metricsPayload);
    }

    return new Response(JSON.stringify({ success: true, startup_id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});