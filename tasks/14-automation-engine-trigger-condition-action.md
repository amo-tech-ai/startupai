# 14 - Automation Engine (Trigger-Condition-Action)

## 📊 Progress Tracker
- [ ] Logic Builder UI 0%
- [ ] Rule Parser Agent 0%
- [ ] Execution Engine 0%

## 📋 Implementation Order
| Step | Task | Logic |
| :--- | :--- | :--- |
| 1 | Intake | NL to JSON |
| 2 | Storage | automation_rules table |
| 3 | Runtime | Database Webhooks |

## 🛠️ Multi-Step Prompts

### Prompt A: Logic Builder
> Build `/automations`. User can type: "When a deal moves to Proposal, notify the founder and create a task for 'Finalize Deck'." The Operator Agent (Flash) must convert this into a JSON Trigger-Condition-Action object.

### Prompt B: Safe Execution
> Automations must trigger the `ProposedAction` system. Instead of the rule writing to the DB directly, it creates a "Proposed Action" that the user must approve in the Right Panel.

## 🏗️ Screens Involved
*   `/automations`
