# 08 - Onboarding Wizard Skeleton

## 📊 Progress Tracker
- [ ] Step 1: Context Intake (URL) 0%
- [ ] Step 2: AI Intelligence Brief 0%
- [ ] Step 3: Entity Hydration 0%

## 📋 Implementation Order
| Step | Task | AI Agent |
| :--- | :--- | :--- |
| 1 | URL Context | The Scout |
| 2 | Intel Review | Controller |
| 3 | Persistence | Propose -> Execute |

## 🛠️ Multi-Step Prompts

### Prompt A: Intake Design
> Design a 6-step wizard UI in the Main Canvas. Step 1: URL Intake. Right Panel: Terminal showing "Scout Agent initializing...". Use Framer Motion for smooth slide transitions between steps.

### Prompt B: Intelligence Brief UI
> Build Step 2. Display the "Market Brief" (TAM, Competitors, Valuation Comps) as a read-only analyst report in the Main Canvas. The Right Panel should show a "Hydrate Profile" ProposedAction.

### Prompt C: Scout Service
> Implement `services/ai/scout.ts`. Call the Edge Function `analyze-context`. Use Gemini 3 Pro with `googleSearch`. Input: Website URL. Output: JSON structure for a new Startup profile.

## 🏗️ Screens Involved
*   `/onboarding`

## 🌟 Real-World Use Cases
1. **Zero-to-One**: Founder pastes "apple.com". The Scout identifies "Consumer Tech," finds "Samsung" as a competitor, and suggests a "Growth" stage automatically.
