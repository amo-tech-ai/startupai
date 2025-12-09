
# 🧙‍♂️ Startup Wizard & Profile Dashboard Improvement Plan

**Version:** 3.0 | **Status:** 🟢 Live | **Owner:** Product Engineering

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
| **Dashboard Layout** | 🟢 Done | `/startup-profile` route, responsive grid with sticky sidebar. |
| **Overview Card** | 🟢 Done | View/Edit Context, Identity, Image Uploads (Cover/Logo). |
| **Team Card** | 🟢 Done | Manage founders, AI Bio Rewrite, Add/Remove logic. |
| **Business Card** | 🟢 Done | Edit Problem/Solution, Market, Features. AI Competitor suggestions. |
| **Traction Card** | 🟢 Done | Update MRR, Funding History, Use of Funds. AI Valuation. |
| **Summary Card** | 🟢 Done | Profile Strength Meter, AI Executive Summary regeneration. |
| **Inline Editing** | 🟢 Done | "Edit Mode" toggle implemented globally for the page. |

---

## 🚀 Phase 3: Public Sharing & Data Rooms (Next Steps)

**Goal:** Allow founders to share a read-only, secure version of their profile with investors (Data Room Lite).

### 1. Public Profile View
*   **Route:** `/s/:startup-slug` (Publicly accessible).
*   **Logic:**
    *   ReadOnly version of the `StartupProfilePage`.
    *   Hides "Edit" controls and "AI" buttons.
    *   Requires `is_public` flag in `startups` table to be true.

### 2. One-Pager PDF Export
*   **Feature:** Convert the Profile Dashboard into a standardized PDF One-Pager.
*   **Tech:** Use `html2canvas` + `jspdf` to snapshot the "Investor View" layout.

### 3. Share Settings
*   **Component:** `ShareModal`.
*   **Features:**
    *   Enable/Disable Public Link.
    *   Regenerate Link Token.
    *   View Count tracking.

---

## 🧠 AI Integration (Gemini 3 Pro) - Current Status

The dashboard currently utilizes the following live AI features:

1.  **Refine One-Liner:** Context-aware rewriting of the tagline.
2.  **Bio Polish:** Enhances founder bios for credibility.
3.  **Competitor Discovery:** Uses Search Grounding to find real competitors.
4.  **Valuation Estimate:** Uses Search Grounding to find industry multiples and calculate range.
5.  **Executive Summary:** Generates a 3-paragraph investor summary based on all profile data.

---

## ✅ Production Verification Checklist

- [x] **Route Guard:** `/startup-profile` loads correctly for authenticated users.
- [x] **Data Persistence:** Edits in the dashboard persist to Supabase and reflect immediately in UI.
- [x] **Images:** Cover and Logo uploads work (fallback to Base64 if storage offline).
- [x] **Responsiveness:** Layout stacks correctly on mobile (Sidebar moves to bottom/top).
- [x] **AI Error Handling:** Buttons show loading states and toast errors on failure.
