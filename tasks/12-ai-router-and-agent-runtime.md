# 12 - AI Router & Agent Runtime

## 📊 Progress Tracker
- [ ] Agent Classifier Logic 0%
- [ ] Model Routing (Pro vs Flash) 0%
- [ ] Tool Permission Layer 0%

## 📋 Implementation Order
| Step | Task | Tool |
| :--- | :--- | :--- |
| 1 | Router | Deno Function |
| 2 | Context | DB Context Fetch |
| 3 | Execution | SDK Call |

## 🛠️ Multi-Step Prompts

### Prompt A: Orchestrator Logic
> Create `supabase/functions/agent-orchestrator`. Logic: 1) Classify query complexity. 2) If 'Complex Research' -> Route to Gemini 3 Pro + Search. 3) If 'Fast Edit' -> Route to Gemini 3 Flash. 4) Always inject the startup's `org_context` JSON into the system prompt.

### Prompt B: Context Scoping
> Ensure the Orchestrator fetches the last 10 `ai_runs` for the user to provide short-term session memory (Interactions API simulation) before making the Gemini call.

## 🏗️ Screens Involved
*   N/A (Infrastructure)
