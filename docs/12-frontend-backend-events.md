
# 🔌 Event System: Frontend-Backend Integration Plan

**Version:** 2.0  
**Status:** ✅ Production Ready  
**Scope:** Event Wizard, AI Ops, Asset Generation, Database Persistence

---

## 1. High-Level Architecture

The Event System uses a **"Synthesize & Commit"** pattern with **Hybrid AI Execution**.

1.  **Synthesize:** The user inputs rough ideas into the Wizard. The React App calls Supabase Edge Functions to "hallucinate" a structured plan (Strategy, Logistics, Tasks).
    *   *Fallback:* If Edge Functions are unreachable, the client falls back to direct Gemini SDK calls.
2.  **Review (Human in the Loop):** The user reviews these AI predictions in the UI.
3.  **Commit (Transactional Save):** Once approved, the data is normalized and sent to Supabase in a single transaction (Event + 50 Generated Tasks).
4.  **Execute (Dashboard):** The user manages the event lifecycle (Kanban, Budget, Assets) using standard CRUD operations.

---

## 2. Frontend Wiring Checklist

### 🧙‍♂️ Event Wizard (`/events/new`)
- [x] **State Management:** `useEventWizard` hook manages multi-step form data.
- [x] **Step 1 (Context):** Inputs map to `EventData` interface.
- [x] **Step 2 (Strategy):** Calls `EventAI.analyzeStrategy`. Displays `feasibilityScore` and `risks`.
- [x] **Step 3 (Logistics):** Calls `EventAI.checkLogistics` with **Google Search Grounding**.
    - [x] Conflict Radar (Date overlaps).
    - [x] Venue Recommendations (Real pricing).
- [x] **Step 4 (Launch):**
    - [x] Calls `EventAI.generateActionPlan` to create JSON tasks.
    - [x] Calls `EventService.create` to save Event + Tasks atomically.

### 📊 Event Dashboard (`/events/:id`)
- [x] **Routing:** `EventDetailsPage` resolves ID from URL.
- [x] **Data Fetching:** `useEventDetails` hook fetches `event` and `tasks` in parallel.
- [x] **Optimistic UI:** Task status toggles update UI immediately, then sync to DB.
- [x] **Delete Action:** Event can be deleted from the header.
- [x] **Tabs System:**
    - [x] **Overview:** Shows AI ROI report and Strategy data.
    - [x] **Tasks:** Kanban/List view of `event_tasks`.
    - [x] **Marketing:** Calls `EventAI.generateMarketingAssets` (Nano Banana).
    - [x] **Budget:** Calls `EventAI.suggestBudgetBreakdown` -> `EventService.updateBudget`.
    - [x] **Attendees:** Syncs to CRM via `EventAttendeeService`.

---

## 3. Backend Wiring Checklist (Supabase)

### Database Tables
- [x] **`events`**: Stores core metadata, `ai_analysis` JSON, and status.
- [x] **`event_tasks`**: Linked via `event_id`. `on delete cascade` verified.
- [x] **`event_assets`**: Stores Base64 images or Storage URLs.
- [x] **`event_budgets`**: JSONB structure or separate table (Implemented as separate table `event_budgets` in schema).
- [x] **`event_registrations`**: Tracks attendees.

### Security (RLS)
- [x] **Isolation:** Policies ensure users can only view/edit events linked to their `startup_id`.
- [x] **Storage:** `startup-assets` bucket policies must allow authenticated uploads for marketing images.

### Service Layer (`services/supabase/events.ts`)
- [x] **Facade Pattern:** `EventService` aggregates `Core`, `Tasks`, `Assets`, `Finance`, `Attendees`.
- [x] **Transaction Logic:** `EventCoreService.create` inserts Event first, gets ID, then inserts Tasks array.
- [x] **Offline Mode:** Fallback to `localStorage` ('guest_events') implemented for demo/testing.

---

## 4. AI Integration Wiring (`services/eventAI.ts`)

| Action | Model | Execution | Config |
|:---|:---|:---|:---|
| **Strategy Analysis** | `gemini-3-pro-preview` | Edge -> Client | `thinkingBudget: 2048` |
| **Logistics Scan** | `gemini-3-pro-preview` | Edge -> Client | `tools: [{googleSearch: {}}]` |
| **Task Generation** | `gemini-3-pro-preview` | Edge -> Client | `responseSchema: Task[]` |
| **Marketing Visuals** | `gemini-2.5-flash-image` | Client Only | `aspectRatio: '16:9'` (Binary response optimization) |
| **Marketing Copy** | `gemini-2.5-flash` | Edge -> Client | Standard |
| **Budget Allocator** | `gemini-2.5-flash` | Edge -> Client | JSON Schema |

---

## 5. Final "Production Ready" Gate

> **System Status:** 🟢 **GO**

1.  **Schema:** Tables created and optimized.
2.  **Services:** Modular, typed, and resilient with Edge Fallback.
3.  **UI:** Polished, responsive, and communicative (Toasts/Loaders).
4.  **AI:** Secure Edge Function implementation for all text/JSON based logic.

**Ready for Deployment.**
