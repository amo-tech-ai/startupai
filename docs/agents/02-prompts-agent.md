# 🧙‍♂️ StartupAI — Agentic UI/UX Implementation Guide (v4.3)

This document contains the multi-step prompts required to build the StartupAI 3-Panel OS. 

---

## 🏗️ 3-Panel Layout Logic (The OS Shell)

| Panel | Role | width | Interaction Model |
| :--- | :--- | :--- | :--- |
| **LEFT** | Navigator | 280px | **Scope Control:** Updates global `activeEntity`. |
| **MAIN** | Canvas | 1fr | **Execution:** Real-time editor / CRUD workspace. |
| **RIGHT** | Intelligence | 380px | **Governance:** Approval gate for AI Proposals. |

---

## ⚡ Multi-Step Implementation Prompts

### Prompt 1: The UI Layout Engine (Shell)
> **Role:** Senior UI/UX Architect
> **Task:** Design a responsive 3-panel layout in React using Tailwind CSS.
> **Requirements:**
> 1. Create a `ThreePanelLayout` component with `Navigator` (Left), `Canvas` (Main), and `IntelligenceHub` (Right).
> 2. Implement a `useScope` context to track `orgId` and `entityId` across all three panels.
> 3. Ensure the mobile view stacks `Navigator` into a drawer and `IntelligenceHub` into a collapsible bottom tray.
> 4. Use high-contrast neutrals (#1A1A1A, #F7F7F5) with Brand Orange accents.

### Prompt 2: The Agent Intelligence Brief (Intake)
> **Role:** Agentic Systems Designer
> **Task:** Implement the Step 2 Onboarding logic.
> **Logic:**
> 1. Invoke a Supabase Edge Function that uses **Gemini 3 Pro** with `thinkingLevel: "high"`.
> 2. Perform **Search Grounding** based on the URL provided in Step 1.
> 3. Instead of direct writes, return a `ProposedAction` JSON object to pre-fill the Profile.
> 4. UI: Show a "Reasoning Summary" and "Sources Found" in the Right Panel before the user clicks "Apply Brief."

### Prompt 3: The Governance UI (ProposedAction Card)
> **Role:** Frontend Security Engineer
> **Task:** Build the `ProposedActionCard` for the Right Intelligence Panel.
> **Requirements:**
> 1. Fetch pending actions from the `proposed_actions` table for the active `startupId`.
> 2. Display a "Diff" visualization showing what data the AI wants to change in the Main Canvas.
> 3. The "Approve" button must call the `execute-action` Edge Function, which performs a validated DB write.
> 4. Show a "Confidence Score" and "AI Reasoning" bullets on every card.

---

## 🛠️ Gemini 3 Technical Wiring Prompts

### Prompt: Financial Forensic Analyst
> **System:** Gemini 3 Pro
> **Tool:** `codeExecution`
> **Instruction:** "Analyze this CSV of transactions. Use the Python code execution tool with Pandas to compute MRR and monthly burn. Return the result in a strict JSON schema matching `ProposedAction`. Flag any anomaly > 20% in the reasoning field."

### Prompt: Market Scout (Grounding)
> **System:** Gemini 3 Pro
> **Tool:** `googleSearch`
> **Config:** `thinkingLevel: "high"`
> **Instruction:** "Research current SaaS multiples for [Industry] in Q2 2025. You MUST return citations as URL links. Map results to the `ProposedAction.payload` for a Valuation Update. Ensure citations are included in the metadata."

### Prompt: Deck narrative Architect
> **System:** Gemini 3 Pro
> **Tool:** `responseSchema`
> **Instruction:** "Construct a 10-slide YC-standard deck. Enforce a JSON schema where each slide contains: `title`, `bullets[]`, and `visual_prompt` for Nano Visualizer. Ensure thinkingLevel is high to maintain narrative flow across all slides."

---

## 🧪 Acceptance Verification Checklist

1. [ ] **Isolation:** Confirm agent triggers pass `org_id` to the Edge Function for RLS validation.
2. [ ] **No Side Effects:** Verify that running an agent creates a row in `proposed_actions` but DOES NOT change any other table.
3. [ ] **Human Gate:** Confirm the `execute-action` function rejects any request where `status` != 'approved' by the user.
4. [ ] **Grounding:** Verify that citations appear in the UI for every Scout Agent run.
5. [ ] **Responsiveness:** Verify the "Thinking" state pulse animation triggers within 200ms of agent launch.
