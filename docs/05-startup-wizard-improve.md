
# 🧙‍♂️ Startup Wizard & Profile Dashboard Improvement Plan

**Version:** 2.1 | **Status:** 🟡 In Progress | **Owner:** Product Engineering

---

## 📊 Progress Tracker

### Phase 1: Onboarding Wizard (Steps 1-5)
| Component | Status | Description |
|-----------|--------|-------------|
| **Step 1: Context** | 🟢 Done | Auto-fill from URL, Industry detection. |
| **Step 2: Team** | 🟢 Done | Founder list, Bio rewrite. |
| **Step 3: Business** | 🟢 Done | Problem/Solution, Competitors, Tags. |
| **Step 4: Traction** | 🟢 Done | MRR Chart, Fundraising toggle, Valuation AI. |
| **Step 5: Review UI** | 🟢 Done | Profile Strength, Missing Fields, Snapshot Panels. |
| **Step 5: AI Summary** | 🟢 Done | Structured HTML summary generation via Gemini 3 Pro. |
| **Data Persistence** | 🟢 Done | Saves to Supabase `startups` and `startup_founders`. |

### Phase 2: Startup Profile Dashboard (Post-Onboarding)
| Component | Status | Description |
|-----------|--------|-------------|
| **Dashboard Layout** | 🔴 Pending | `/startup-profile` route, responsive grid. |
| **Overview Card** | 🔴 Pending | View/Edit Context, Identity, AI Signals. |
| **Team Card** | 🔴 Pending | Manage founders, invite team members. |
| **Business Card** | 🔴 Pending | Edit Problem/Solution, Market, Features. |
| **Traction Card** | 🔴 Pending | Update MRR, Funding History, Use of Funds. |
| **Summary Card** | 🔴 Pending | View/Regenerate AI Executive Summary. |
| **Inline Editing** | 🔴 Pending | "Click to Edit" pattern for all fields. |

---

## 🚀 Phase 2: Startup Profile Dashboard Specification

**Goal:** Create a single, investor-ready dashboard view (`/startup-profile`) where founders can view, manage, and refine the data collected during onboarding. This replaces the wizard for day-to-day management.

### 1. Page Layout & Structure

*   **Route:** `/startup-profile` (Protected)
*   **Header:**
    *   Startup Name & Logo
    *   Tags: Industry | Stage | Location
    *   Actions: "View as Investor" (Toggle), "Generate Pitch Deck" (Primary CTA).
*   **Desktop Layout:**
    *   **Left Column (Main - 66%)**: Business Logic (Overview, Market, Traction).
    *   **Right Column (Sidebar - 33%)**: Team, Quick Stats, AI Summary.
*   **Mobile Layout:** Single column, prioritized by Profile Strength > Summary > Actions.

### 2. Component Specifications

#### A. Overview Card
*   **Data Source:** `startups` table (name, tagline, website, year_founded, cover_image).
*   **AI Signals:** Display detected `target_audience`, `core_problem`, `pricing_model` as read-only tags (derived from initial analysis).
*   **Actions:**
    *   Edit Basic Info (Modal/Inline).
    *   "Refine One-Liner" (Gemini 3 Pro text refinement).

#### B. Founders & Team Card
*   **Data Source:** `startup_founders` table.
*   **Display:** List items with Avatar, Name, Title, LinkedIn Icon.
*   **Actions:**
    *   "Add Co-Founder" (Modal).
    *   "Improve Bio" (Gemini 3 Pro rewrite).

#### C. Business Model & Market Card
*   **Data Source:** `startups` table (problem, solution, business_model, pricing_model, competitors, key_features).
*   **Display:**
    *   **Problem/Solution:** Text areas with "Read More" truncation.
    *   **Tags:** Customer Segments, Features.
    *   **Competitors:** List of competitor names/URLs.
*   **Actions:**
    *   Inline text editing for Problem/Solution.
    *   "Suggest Competitors" (Gemini 3 Pro + Google Search).
    *   "Analyze Differentiation" (AI critique of Core Differentiator).

#### D. Traction & Fundraising Card
*   **Data Source:** `startup_metrics_snapshots` (latest) + `startups` (funding info).
*   **Display:**
    *   Big Number: MRR / Users.
    *   Sparkline: Growth trend.
    *   Fundraising Status: Active/Inactive toggle.
    *   Target Raise & Allocation (Pie Chart representation of Use of Funds).
*   **Actions:**
    *   "Update Metrics" (Modal).
    *   "Recalculate Valuation" (Gemini 3 Pro Analysis).

#### E. AI Investor Summary Card
*   **Data Source:** `startups.description` (stores the HTML summary).
*   **Display:**
    *   Profile Strength Meter (0-100%).
    *   Formatted HTML Summary.
*   **Actions:**
    *   "Regenerate Summary" (Triggers `WizardService.generateSummary`).
    *   "Copy to Clipboard".

---

## 🧠 AI Integration (Gemini 3 Pro)

The dashboard will use the following AI patterns:

### 1. Context-Aware Refinement
*   **Trigger:** "Refine One-Liner" button.
*   **Input:** Current tagline + Industry + Solution.
*   **Prompt:** "Rewrite this tagline to be more punchy and investor-focused for a [Industry] startup doing [Solution]."

### 2. Search-Grounded Validation
*   **Trigger:** "Recalculate Valuation" button.
*   **Tool:** `googleSearch`.
*   **Logic:** Search for recent Series [Stage] valuations in [Industry] sector. Calculate range based on user's MRR.

### 3. Competitor Discovery
*   **Trigger:** "Suggest Competitors" button.
*   **Tool:** `googleSearch`.
*   **Logic:** Find 3 direct competitors for [Startup Name] solving [Problem]. Return names and URLs.

---

## 🗄️ Supabase Schema (Reference)

This schema supports both the Wizard and the Dashboard.

```sql
-- Core Startup Profile
CREATE TABLE public.startups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    
    -- Identity
    name TEXT NOT NULL,
    tagline TEXT,
    description TEXT, -- AI Summary HTML
    logo_url TEXT,
    cover_image_url TEXT,
    website_url TEXT,
    year_founded INT,
    stage TEXT, -- 'Idea', 'Seed', 'Series A', etc.
    industry TEXT,
    
    -- Strategic Narrative
    problem_statement TEXT,
    solution_statement TEXT,
    core_differentiator TEXT,
    
    -- Business Model
    business_model TEXT, -- 'SaaS', 'Marketplace', etc.
    pricing_model TEXT,
    customer_segments TEXT[],
    key_features TEXT[],
    competitors TEXT[],
    
    -- Traction & Finance
    funding_goal NUMERIC,
    is_raising BOOLEAN DEFAULT false,
    use_of_funds TEXT[],
    funding_history JSONB DEFAULT '[]', -- [{round, date, amount, investors}]
    
    -- Meta
    profile_strength INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Founders
CREATE TABLE public.startup_founders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    startup_id UUID REFERENCES public.startups(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    title TEXT,
    bio TEXT,
    linkedin_url TEXT,
    email TEXT,
    avatar_url TEXT,
    is_primary BOOLEAN DEFAULT false
);

-- Metrics History
CREATE TABLE public.startup_metrics_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    startup_id UUID REFERENCES public.startups(id) ON DELETE CASCADE,
    snapshot_date DATE DEFAULT CURRENT_DATE,
    monthly_revenue NUMERIC,
    monthly_active_users INT,
    burn_rate NUMERIC,
    runway_months INT,
    created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## ✅ Production Checklist for Dashboard

1.  [ ] **Route Guard:** Ensure `/startup-profile` redirects to `/onboarding` if no profile exists.
2.  [ ] **Optimistic UI:** Inline edits should update UI immediately while saving to Supabase in background.
3.  [ ] **Loading States:** All AI buttons must have specific loading states ("Analyzing...", "Searching...").
4.  [ ] **Error Handling:** Graceful fallbacks if Gemini API is overloaded or Search fails.
5.  [ ] **Mobile View:** Verify "Sticky" actions don't block content on small screens.
