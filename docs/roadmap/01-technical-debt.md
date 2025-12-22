# 🪵 Technical Debt Registry

## 1. AI Implementation Gaps
*   **Prompt Leakage**: System instructions are defined in frontend service files. These should be moved entirely into Edge Functions to prevent reverse engineering of proprietary prompts.
*   **Thinking Budget Tuning**: `thinkingBudget` is set to 2048 across most tasks. High-latency strategy tasks may benefit from 4096, while UI tweaks should use 0 (Gemini 3 Flash).

## 2. Architecture Anti-patterns
*   **Prop Drilling (Limited)**: `displayProfile` in `StartupProfilePage` is passed through multiple layers. 
*   **Mock Fallbacks**: `mockDatabase.ts` and guest mode logic is robust but adds bloat to the final bundle. Consider code-splitting guest vs auth paths.

## 3. Performance Bottlenecks
*   **Image Bloat**: Marketing Generator creates raw Base64 strings. Large events with many assets will slow down the `postgres_changes` payload. 
*   **Recommendation**: Move all Image Gen to background tasks that write only a Storage UUID to the database.

## 4. UI/UX Refinement
*   **Command Palette (Cmd+K)**: Is not yet aware of search results, only navigation.
*   **Soft Deletes**: Critical data loss risk in CRM/Docs.
