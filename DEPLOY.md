
# 🚀 StartupAI Deployment Guide

## 1. Environment Variables

Create a `.env` file in the root directory (for local dev) or configure these in your hosting provider (Vercel/Netlify).

```bash
# Frontend Keys (Exposed to Browser)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_KEY=your-google-gemini-api-key

# Edge Function Keys (Set via Supabase CLI)
GOOGLE_API_KEY=your-google-gemini-api-key
STRIPE_SECRET_KEY=your-stripe-secret-key
```

## 2. Database Setup

1.  Go to your Supabase Project -> SQL Editor.
2.  Run the content of `supabase/migrations/20250522_schema_update.sql`.
    *   This creates the necessary tables for Deep Research, Profiles, and Billing.

## 3. Edge Functions

Deploy the server-side logic for AI and Billing.

```bash
# Install Supabase CLI if needed
brew install supabase/tap/supabase

# Login
supabase login

# Deploy all functions
supabase functions deploy ai-helper
supabase functions deploy create-checkout
supabase functions deploy update-startup-profile
supabase functions deploy chat-copilot
```

## 4. Production Checklist

*   [ ] **API Key Security:** Ensure your Google AI Studio key is restricted to your production domain (HTTP Referrer) if using the client-side fallback. Ideally, disable the fallback in `services/wizardAI.ts` for strict security.
*   [ ] **Stripe Webhooks:** Set up a webhook pointing to a Supabase Edge Function (not included in this MVP) to listen for `checkout.session.completed` and update the `subscriptions` table.
*   [ ] **Storage Policies:** Verify Storage Bucket RLS in Supabase to ensure user avatars and deck assets are secure.
