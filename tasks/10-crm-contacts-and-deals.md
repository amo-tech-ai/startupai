# 10 - CRM: Contacts & Deals

## 📊 Progress Tracker
- [ ] Kanban Pipeline UI 0%
- [ ] Lead Scoring Agent 0%
- [ ] Outreach Hook Gen 0%

## 📋 Implementation Order
| Step | Task | Model |
| :--- | :--- | :--- |
| 1 | Kanban | Main Canvas |
| 2 | Fit Scoring | The Scout |
| 3 | Intro Drafting | Content Agent |

## 🛠️ Multi-Step Prompts

### Prompt A: Pipeline Design
> Build `/crm/deals` using a Kanban board. Columns: Lead, Qualified, Meeting, Proposal, Closed. Implement drag-and-drop. Cards must display an "AI Score" badge (0-100).

### Prompt B: Lead Fit Agent
> Wire the "Scout" agent to the CRM. When a new Deal is added with a LinkedIn URL, the Scout uses Search Grounding to find the investor's recent check sizes and thesis, then proposes a "Fit Score" update.

### Prompt C: Outreach Hooks
> In the Deal Detail view, add a "Draft Intro" button. The Content Agent (Flash) uses the Scout's findings to write a 3-sentence personalized intro email. Show as a `ProposedAction`.

## 🏗️ Screens Involved
*   `/crm/deals`
*   `/crm/deals/:id`
*   `/crm/contacts`
