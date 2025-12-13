
# 🗄️ Supabase Schema Roadmap & Todo

**Version:** 1.1
**Status:** 🟡 Pending Implementation
**Review Date:** 2025-05-22

This document outlines necessary schema changes, optimizations, and missing tables identified during the V3 audit and Best Practices review.

---

## 🚨 Priority 1: V3 Feature Support

### 1.1 Startup Intelligence (Deep Research)
The V3 Wizard generates massive JSON reports. Storing them inside `traction_data` (JSONB) is risky for data integrity and row size.
- [ ] **Add Column:** `startups.deep_research_report` (JSONB)
  - *Purpose:* Dedicated storage for the 2-pass agent report.
  - *Migration:* `ALTER TABLE startups ADD COLUMN deep_research_report JSONB;`

### 1.2 User Profile Normalization
Current `profiles` table stores Experience/Education as JSONB. This prevents SQL queries like *"Find founders who worked at Google"*.
- [ ] **Create Table:** `profile_experience`
  - Columns: `id`, `profile_id`, `company`, `role`, `start_date`, `end_date`, `is_current`, `description`.
- [ ] **Create Table:** `profile_education`
  - Columns: `id`, `profile_id`, `school`, `degree`, `start_year`, `end_year`.
- [ ] **Migration Script:** Move data from `profiles.experiences` (JSONB) -> New Tables.

### 1.3 RAG / Vector Engine (Document Intelligence)
To support "Chat with your Data" and "AI Document Generation" using context from uploaded files.
- [ ] **Create Table:** `document_embeddings`
  - Columns: `id`, `startup_id`, `doc_id` (FK to `data_room_files` or `investor_docs`), `content_chunk`, `embedding` (vector(768)).
  - *Index:* HNSW index for fast similarity search.
- [ ] **Enable Extension:** `vector` (if not enabled).

---

## 🔒 Priority 2: Security & RLS Hardening

### 2.1 Storage Buckets
Schema docs mention `assets` table but not specific Storage RLS.
- [ ] **Policy:** Ensure `avatar` bucket allows public read, auth write (user only).
- [ ] **Policy:** Ensure `deck-assets` bucket allows public read (for shared decks), auth write (org members).
- [ ] **Policy:** **CRITICAL** Ensure `data-room` bucket is **private** (no public read), accessible only via signed URLs for authenticated org members.

### 2.2 Trigger-based Sync
Currently, `profiles` creation relies on the frontend or a basic trigger.
- [ ] **Trigger:** `on_auth_user_created`
  - Automatically insert row into `public.profiles` with `id`, `email`, `full_name` from `auth.users`.
  - Automatically create a default `org` for the user.

---

## ⚡ Priority 3: Performance & Scalability

### 3.1 Materialized Views
Dashboard calculations (Runway, Health Score) are currently done client-side. As data grows, this will slow down.
- [ ] **View:** `view_startup_stats`
  - Pre-calculate: `current_mrr`, `burn_rate`, `runway_months`, `health_score`.
  - Refresh Strategy: Trigger on `startup_metrics_snapshots` insert/update.

### 3.2 Indexes
- [ ] **Index:** `gin` index on `startups.industry` (for benchmarking queries).
- [ ] **Index:** `gin` index on `startups.tags` or `business_model` (for finding similar startups).
- [ ] **Index:** `btree` index on `crm_deals.startup_id, crm_deals.stage` (Kanban board load speed).

---

## 🛠️ Priority 4: Missing SaaS Utilities

### 4.1 Notifications
`crm_activities` exists, but is a log, not a user notification system.
- [ ] **Create Table:** `notifications`
  - Columns: `id`, `user_id`, `org_id`, `type` (alert, mention, system), `title`, `message`, `link`, `is_read`, `created_at`.
  - *Realtime:* Enable Supabase Realtime on this table for the "Bell" icon.

### 4.2 Team Invites
No mechanism to invite users who don't exist yet.
- [ ] **Create Table:** `org_invites`
  - Columns: `id`, `org_id`, `email`, `role`, `token`, `expires_at`, `invited_by`.
  - *Flow:* User clicks email link -> Signup -> Trigger adds them to Org based on token.

---

## 💰 Priority 5: Monetization (Stripe Integration)

Current schema relies on a simple string `plan` in profiles/startups. For production billing, we need robust sync.

- [ ] **Create Table:** `subscriptions`
  - Tracks Stripe Subscription status, periods, and cancel states.
- [ ] **Create Table:** `customers`
  - Maps `org_id` to Stripe Customer ID.
- [ ] **Create Table:** `prices` & `products`
  - Synced from Stripe for the Pricing page.

---

## 🛡️ Priority 6: Data Safety (Soft Deletes)

To prevent accidental data loss in the CRM and Document sections.

- [ ] **Add Column:** `deleted_at` (timestamptz, nullable) to `crm_deals`.
- [ ] **Add Column:** `deleted_at` (timestamptz, nullable) to `crm_contacts`.
- [ ] **Add Column:** `deleted_at` (timestamptz, nullable) to `investor_docs`.
- [ ] **Update Policies:** Update RLS to exclude rows where `deleted_at IS NOT NULL`.

---

## 📉 Schema Debt (To Deprecate)

- [ ] **Deprecate:** `startups.traction_data` (Move fully to `startup_metrics_snapshots` + `deep_research_report`).
- [ ] **Deprecate:** `startups.team_data` (Move fully to `startup_founders`).
- [ ] **Refactor:** `crm_deal_enrichment` stores `competitors` as JSONB. Consider linking to `startup_competitors` table for consistency.
