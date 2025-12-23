
# 🪵 Technical Debt Registry

## 1. AI Implementation Gaps
*   **Prompt Leakage**: System instructions are currently defined in frontend service files. For production security, these should be moved entirely into Edge Functions to prevent reverse engineering of proprietary prompt IP.
*   **Thinking Budget Tuning**: Most Gemini 3 Pro calls are using a default `thinkingBudget`. Strategic narrative tasks should be tuned to `4096` tokens, while UI logic should remain at `0` (Flash) to minimize latency.
*   **Tool Choice Determinism**: Need a middleware to decide when to trigger Search Grounding vs. internal RAG to reduce token costs.

## 2. Architecture Anti-patterns
*   **Prop Drilling**: The `displayProfile` object in `StartupProfilePage` is becoming large. Move to a dedicated `useStartupProfile` context hook to isolate company-level state.
*   **Optimistic UI vs Sockets**: CRM Kanban uses optimistic UI for drag-and-drop, but missing a "Revert" state if the network request fails.

## 3. Data Integrity
*   **Soft Deletes**: Critical data (Deals, Contacts) is at risk of accidental permanent deletion. Implement `deleted_at` column across all operational tables.
*   **JSONB Bloat**: The `wizard_context` in the Events table is storing redundant data. Normalize into sub-tables.
