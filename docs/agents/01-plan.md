# 🤖 StartupAI Agentic OS — Master Plan (v4.3)

This document defines the specialized AI workers (Agents) that power the StartupAI ecosystem. Every agent operates under a strict **"Propose-Approve-Execute"** governance model.

---

## 📊 Agent Implementation Tracker

| Agent Category | Status | Model | Key Tooling | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **Orchestrator** | 🟢 Ready | Gemini 3 Pro | thinkingLevel: "high" | P0 |
| **Market Scout** | 🟢 Ready | Gemini 3 Pro | Search + Citations | P0 |
| **Deck Architect** | 🟢 Ready | Gemini 3 Pro | responseSchema (JSON) | P0 |
| **Analyst** | 🟡 Testing | Gemini 3 Pro | codeExecution (Python) | P1 |
| **Operator** | 🟡 Testing | Gemini 3 Flash | thinkingLevel: "minimal" | P1 |
| **Lead Scorer** | 🔴 Backlog | Gemini 3 Pro | reasoning (Pro) | P2 |
| **Visualizer** | 🔴 Backlog | Nano Banana Pro | imageConfig | P2 |

---

## 🏛️ The Governance Lifecycle (The "Proposed Actions" Rule)
AI agents in StartupAI are **FORBIDDEN** from writing directly to core business tables. All agent outputs are stored as "Proposals" first.

1. **Trigger:** User action or system event invokes an Edge Function.
2. **Propose:** The Agent generates a `ProposedAction` JSON object and writes it to the `proposed_actions` table.
3. **Approve:** The human founder reviews the reasoning, diff, and confidence score in the Right Panel.
4. **Execute:** Clicking "Approve" triggers a dedicated Edge Function (`execute-action`) that performs an idempotent transaction to commit the write to the database.

### `proposed_actions` Table Schema
| Column | Type | Description |
| :--- | :--- | :--- |
| **id** | UUID | Primary Key |
| **startup_id** | UUID | Reference to Startup (RLS by Org) |
| **type** | Enum | email, stage_move, task_creation, deck_update |
| **label** | Text | Human-friendly title (e.g., "Draft Outreach") |
| **payload** | JSONB | The actual data to be committed |
| **status** | Enum | proposed, approved, rejected, executed |
| **reasoning** | Text | Brief summary of AI logic (replaces raw trace) |
| **confidence**| Float | 0.0 - 1.0 AI confidence score |
| **idempotency_key** | Text | Prevents duplicate executions |

---

## 🧙‍♂️ Core Agent Registry (Corrected Model-Task Mapping)

| Agent Type | Gemini Model | Tooling Logic |
| :--- | :--- | :--- |
| **Scout** | Gemini 3 Pro | **Search Grounding** for benchmarks and investor fit. |
| **Analyst** | Gemini 3 Pro | **Code Execution** for MRR/Burn forensics. Deterministic math. |
| **Architect** | Gemini 3 Pro | **responseSchema** for Sequoia/YC narrative structure. |
| **Operator** | Gemini 3 Flash | **Function Calling** for UI-level task decomposition. |
| **Visualizer** | Nano Banana | **imageConfig** for 16:9 brand-aligned slide assets. |
| **Content** | Gemini 3 Flash | Fast text drafts for emails and UI copy. |

---

## 🛠️ Feature → AI Mapping

| Item | Screen | Model | Gemini Tools | Output Type |
| :--- | :--- | :--- | :--- | :--- |
| **Market Research** | Profile | Pro | Search | ProposedAction |
| **Financial Audit** | Dashboard | Pro | Code Ex | ProposedAction |
| **Slide Refinement** | Deck Editor | Pro | Text Gen | ProposedAction |
| **Event Roadmap** | Events | Flash | Func Call | ProposedAction |

---

## 📐 UX Design Rules for Agents

1. **The "Right Panel" Rule:** All AI reasoning and proposal cards MUST live in the Right Panel.
2. **Thinking Awareness:** During `thinkingLevel: "high"` calls, show a "Reasoning..." status bar with citations.
3. **Source Transparency:** Any data found via Search must display a citation link icon.
4. **No Invisible writes:** The "Approve" button is the only path to the database.