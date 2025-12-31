# 🚀 StartupAI — Agentic OS Implementation System

Welcome to the StartupAI build system. This directory contains the granular, sequential task list for building the first true Agentic Operating System for founders.

## 🏛️ Global Architecture Principles
Every task in this system adheres to these non-negotiable rules:

1.  **3-Panel OS Paradigm**:
    *   **LEFT (Navigator)**: Context selection (Startup, Deal, Project).
    *   **MAIN (Canvas)**: Work execution (WYSIWYG, Kanban, Editor).
    *   **RIGHT (Intelligence Hub)**: AI Reasoning, Citations, and Proposed Actions.
2.  **Governance Loop**: AI never writes to core tables. It proposes a change to `proposed_actions`. Humans approve. The `execute-action` Edge Function commits.
3.  **Thin Client, Fat Edge**: The frontend is for display and approval. All AI logic, tool calling, and database transactions live in Supabase Edge Functions.
4.  **Identity Isolation**: All data and AI contexts are strictly scoped by `org_id` via PostgreSQL Row Level Security (RLS).
5.  **Audit Fidelity**: Every AI interaction is logged to `ai_runs` with token usage, latency, and tool-call traces.

## 🛠️ Implementation Order
The build follows a safety-first sequence:
1.  **Foundations (01-03)**: Environment, Directory, and Routing.
2.  **The Shell (04-05)**: The 3-panel UI and the Intelligence Hub.
3.  **Governance (06-07)**: Staging tables and the Secure Execution Gate.
4.  **Intake (08)**: The Smart Wizard (The "Wow" moment).
5.  **Core Modules (09-11)**: Dashboard, CRM, and Tasks.
6.  **Intelligence Layer (12-14)**: Agent Orchestrator, Logging, and Automations.
7.  **Asset Engines (15-17)**: Decks, Events, and Docs.
8.  **Hardening (18)**: Audit and E2E validation.

## 📑 Master Screen Registry
| Route | Screen Name | Role | AI Agents |
| :--- | :--- | :--- | :--- |
| `/onboarding` | Startup Wizard | Intake | Scout |
| `/dashboard` | Command Center | Ops Hub | Analyst |
| `/crm/deals` | Pipeline | Sales | Scout |
| `/pitch-decks/:id` | Deck Editor | Assets | Architect |
| `/events/:id` | Event Ops | Logistics | Operator |
| `/agents` | Agent Hub | Audit | Orchestrator |

## 📊 Master Progress Tracker
| ID | Task Name | Status | Owner | Dependencies | Score |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 01 | [Foundation & Core Setup](./01-foundation-core-setup.md) | 🟢 Ready | PE | None | 100 |
| 02 | [Directory Structure & Conventions](./02-directory-structure-and-conventions.md) | 🟢 Ready | PE | 01 | 100 |
| 03 | [Routing & Route Guards](./03-routing-and-route-guards.md) | 🟢 Ready | PE | 02 | 100 |
| 04 | [3-Panel Layout Shell](./04-three-panel-layout-shell.md) | 🟢 Ready | UI | 03 | 100 |
| 05 | [Right Panel Intelligence Hub](./05-right-panel-intelligence-hub.md) | 🟢 Ready | UI | 04 | 100 |
| 06 | [Governance: Proposed Actions Schema](./06-governance-proposed-actions-schema.md) | 🟢 Ready | ARCH | None | 100 |
| 07 | [execute-action Edge Function](./07-execute-action-edge-function.md) | 🟢 Ready | ARCH | 06 | 100 |
| 08 | [Onboarding Wizard Skeleton](./08-onboarding-wizard-skeleton.md) | 🟢 Ready | UI | 05, 07 | 100 |
| 09 | [Dashboard Command Center](./09-dashboard-command-center.md) | 🟢 Ready | UI | 08 | 100 |
| 10 | [CRM: Contacts & Deals](./10-crm-contacts-and-deals.md) | 🟢 Ready | UI | 09 | 100 |
| 11 | [Tasks: Workflow Board](./11-tasks-workflow-board.md) | 🟢 Ready | UI | 10 | 100 |
| 12 | [AI Router & Agent Runtime](./12-ai-router-and-agent-runtime.md) | 🟢 Ready | ARCH | 07 | 100 |
| 13 | [AI Runs: Logging & Cost Controls](./13-ai-runs-logging-and-cost-controls.md) | 🟢 Ready | ARCH | 12 | 100 |
| 14 | [Automation Engine (Trigger-Condition-Action)](./14-automation-engine-trigger-condition-action.md) | 🟢 Ready | ARCH | 12 | 100 |
| 15 | [Pitch Deck Engine](./15-pitch-deck-engine.md) | 🟢 Ready | UI | 05 | 100 |
| 16 | [Events Ops System](./16-events-ops-system.md) | 🟢 Ready | UI | 05 | 100 |
| 17 | [Documents Hub & Editor](./17-documents-hub.md) | 🟢 Ready | UI | 05 | 100 |
| 18 | [Final Audit & RLS Testing](./18-testing-and-rls-audit.md) | 🟢 Ready | PE | 01-17 | 100 |
