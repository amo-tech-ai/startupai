# 11 - Tasks: Workflow Board

## 📊 Progress Tracker
- [ ] Strategic Roadmap Gen 0%
- [ ] Task Decomposer 0%
- [ ] Priority Scorer 0%

## 📋 Implementation Order
| Step | Task | AI Logic |
| :--- | :--- | :--- |
| 1 | Initial Roadmap | Planner Agent |
| 2 | Task Breakdowns | Operator Agent |
| 3 | Conflict Detection | Risk Agent |

## 🛠️ Multi-Step Prompts

### Prompt A: Roadmap UI
> Build `/tasks` as a column-based roadmap (Strategic, Tactical, Done). Add a "Generate Plan" button that triggers the Planner Agent (Pro) to output 15 tasks based on the Startup's current stage.

### Prompt B: The Operator Agent
> Add an "AI Breakdown" button to any Task card. The Operator Agent (Flash) must propose 3 tactical sub-tasks for that card. *Example: "Hire CTO" -> "Draft JD", "Post to LinkedIn", "Screen 5 leads".*

## 🏗️ Screens Involved
*   `/tasks`
*   `/dashboard` (Mini-list)
