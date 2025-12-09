
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

    // Get User from Auth Header
    const authHeader = req.headers.get('Authorization')!;
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
    }

    const { startup_id, context, founders, metrics, competitors } = await req.json();

    // 1. Verify Ownership
    const { data: startup } = await supabase.from('startups').select('user_id').eq('id', startup_id).single();
    if (!startup || startup.user_id !== user.id) {
        return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: corsHeaders });
    }

    // 2. Transactional Updates
    
    // A. Update Context (Startups Table)
    if (context) {
        // Remove fields that might not exist in startups table to prevent errors
        const { competitors: _c, ...cleanContext } = context;
        const { error: ctxError } = await supabase.from('startups').update(cleanContext).eq('id', startup_id);
        if (ctxError) throw ctxError;
    }

    // B. Update Founders (Upsert)
    if (founders && Array.isArray(founders)) {
        if (founders.length > 0) {
            const foundersPayload = founders.map((f: any) => ({ 
                ...f, 
                startup_id,
                // Ensure ID is valid UUID if provided, else undefined to let DB gen it (if upserting)
                // However, for upsert to work on ID, ID must be provided.
                // If ID is temporary (short string), we might want to omit it for insert, 
                // but client usually sends UUIDs.
                id: (f.id && f.id.length > 10) ? f.id : undefined 
            }));
            const { error: fndError } = await supabase.from('startup_founders').upsert(foundersPayload);
            if (fndError) throw fndError;
        }
    }

    // C. Insert Metrics Snapshot
    if (metrics) {
        const metricsPayload = { 
            ...metrics, 
            startup_id, 
            snapshot_date: new Date().toISOString() 
        };
        const { error: mtrError } = await supabase.from('startup_metrics_snapshots').insert(metricsPayload);
        if (mtrError) throw mtrError;
    }

    // D. Update Competitors (Sync Strategy: Delete All for Startup -> Insert New)
    // Only if competitors array is explicitly provided
    if (competitors && Array.isArray(competitors)) {
        // 1. Delete existing
        await supabase.from('startup_competitors').delete().eq('startup_id', startup_id);
        
        // 2. Insert new
        if (competitors.length > 0) {
            const compPayload = competitors.map((name: string) => ({
                startup_id,
                name
            }));
            const { error: compError } = await supabase.from('startup_competitors').insert(compPayload);
            if (compError) throw compError;
        }
    }

    return new Response(JSON.stringify({ success: true, startup_id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error("Edge Function Error:", error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
