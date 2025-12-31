# 🧙‍♂️ StartupAI — Agentic UI/UX Implementation Guide (v4.2)

This document contains the multi-step prompts required to build the StartupAI 3-Panel OS. Follow these in sequence to ensure architectural integrity and "Propose-Approve-Execute" governance.

---

## 📊 Implementation Progress Tracker

| Sequence | Module | Target Route | Purpose | Status |
| :--- | :--- | :--- | :--- | :--- |
| **01** | **The OS Shell** | `AppLayout.tsx` | Global 3-panel layout logic & state sync. | 🔴 Not Started |
| **02** | **Intelligent Intake** | `/onboarding` | Smart Wizard with real-time research log. | 🔴 Not Started |
| **03** | **Fundraising CRM** | `/crm` | Kanban + Lead Scoring + Outreach Agent. | 🔴 Not Started |
| **04** | **Pitch Engine** | `/pitch-decks` | Narrative Architect + Nano Visualizer. | 🔴 Not Started |
| **05** | **Forensic Traction** | `/startup-profile` | Python-driven financial audit dashboard. | 🔴 Not Started |
| **06** | **Governance Hub** | `RightPanel.tsx` | The human-approval gate for all AI writes. | 🔴 Not Started |

---

## 🏗️ 3-Panel Layout Logic (Design Frames)

### 1. Left Panel: **The Navigator (Scope)**
*   **Width:** 280px (fixed)
*   **Behavior:** Filters the entire application context.
*   **Logic:** Clicking an entity here (e.g., *Project Alpha*) updates the URL and global `activeEntity` state. No editing allowed.

### 2. Main Panel: **The Canvas (Execution)**
*   **Width:** Flexible (1fr)
*   **Behavior:** The primary workspace. Standard CRUD operations.
*   **Logic:** Renders editors, Kanbans, or tables. Syncs in real-time to Supabase.

### 3. Right Panel: **The Intelligence Hub (Strategy)**
*   **Width:** 380px (fixed)
*   **Behavior:** Collapsible. Displays active Agent "Thinking Traces" and "Proposed Action Cards."
*   **Logic:** Triggers Edge Functions. Holds the `Controller` gate.

---

## ⚡ Multi-Step Implementation Prompts

### Prompt 1: The UI Layout Engine (Shell)
> **Role:** Senior UI/UX Architect
> **Task:** Design a responsive 3-panel layout in React using Tailwind CSS.
> **Requirements:**
> 1. Create a `ThreePanelLayout` component with `Left` (fixed), `Main` (scrollable), and `Right` (sticky) sections.
> 2. Implement a `usePanel` hook to toggle the visibility of the Right Panel.
> 3. Ensure the mobile view stacks `Left` into a hamburger drawer and `Right` into a bottom sheet.
> 4. Use high-contrast neutrals (#1A1A1A, #F7F7F5) with Brand Orange accents.

### Prompt 2: The Onboarding Wizard (Intake Agent)
> **Role:** Agentic Systems Designer
> **Task:** Create a 6-step Wizard for `/onboarding`.
> **Features:**
> 1. **Step 1:** URL input that triggers `The Scout` (Gemini 3 Pro) to perform search-grounded market research.
> 2. **UI Frame:** Show a terminal-style "Research Log" in the Right Panel during analysis.
> 3. **Step 2:** "Intelligence Brief" screen that presents AI-detected competitors and TAM/SAM/SOM.
> 4. **Workflow:** Every AI suggestion must have a "Verify & Apply" button (Controller Gate).

### Prompt 3: The Governance UI (Right Panel)
> **Role:** Frontend Security Engineer
> **Task:** Build the `ProposedActionCard` for the Right Intelligence Panel.
> **Logic:**
> 1. Fetch pending actions from the `proposed_actions` table.
> 2. Display a "Diff" view (Original vs. AI Suggestion).
> 3. Include a "Reasoning" section using Gemini 3 "Thinking" output.
> 4. The "Approve" button must call a Supabase Edge Function to commit the write.

---

## 📊 Screen Registry & Agent Mapping

| Screen | Core Feature | Advanced (AI) | Purpose | Real-World Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **Dashboard** | KPI Cards | **AI Coach Digest** | Daily Ops Pulse | Agent detects low runway; proposes a "Series A Sprint" task list. |
| **CRM** | Kanban Pipeline | **Thesis Scorer** | Investor Matching | Scout finds 5 VCs who funded law-tech; drafts custom hooks. |
| **Pitch Deck** | Slide Editor | **Narrative Architect**| Narrative Design | Agent rewrites "Problem" slide based on recent market trends found via Search. |
| **Events** | Logistics List | **Conflict Radar** | Event Ops | Agent identifies 3 conflicting tech conferences; suggests date shift. |

---

## 🛠️ Gemini 3 Feature Wiring (FE/BE)

### Prompt: Search Grounding Wiring
> **System:** Gemini 3 Pro
> **Tool:** `googleSearch`
> **Instruction:** "Research current SaaS multiples for [Industry] in Q2 2025. Return citations as URL links. Map the `groundingMetadata` to the `ProposedAction.citations` array in the UI."

### Prompt: Forensic Code Execution Wiring
> **System:** Gemini 3 Pro
> **Tool:** `codeExecution`
> **Instruction:** "Analyze this CSV of transactions. Calculate MRR, Net Churn, and Runway. If an anomaly > 20% is found, flag it. Write the logic in Python/Pandas. Return JSON for the dashboard."

### Prompt: Structured Presentation Wiring
> **System:** Gemini 3 Pro
> **Tool:** `responseSchema`
> **Instruction:** "Construct a 12-slide Sequoia deck structure. Enforce a JSON schema where each slide contains: `title`, `bullets[]`, and `visual_prompt` (16:9 for Nano Visualizer)."

---

## 🧜‍♂️ User Journey: "The Seed Round Sprint"

1.  **Discovery:** Founder alex enters `alex.ai` in the **Intake Wizard**.
2.  **Scout:** AI (Pro) scrapes the site and searches for comps.
3.  **Governance:** Alex reviews the "Intelligence Brief" in the **Right Panel**, clicks **Approve**.
4.  **Architect:** **The Architect** proposes a 10-slide deck.
5.  **Visualizer:** **The Visualizer** generates 3 core visual assets.
6.  **Operation:** Alex exports the PDF and the **CRM** is auto-hydrated with 15 target investors.
