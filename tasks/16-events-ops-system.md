# 16 - Events Ops System

## 📊 Progress Tracker
- [ ] Event Strategy Wizard 0%
- [ ] Logistics Radar (Conflicts) 0%
- [ ] ROI Analyst 0%

## 📋 Implementation Order
| Step | Task | Gemini Tool |
| :--- | :--- | :--- |
| 1 | Strategy | Thinking Mode |
| 2 | Logistics | Google Maps/Search |
| 3 | Post-Event | Code Execution |

## 🛠️ Multi-Step Prompts

### Prompt A: Logistics Scout
> Build the `/events/new` wizard. Step 3 (Logistics) uses Gemini 3 Pro with `googleSearch` to check the city and date for conferences (e.g., Dreamforce) and suggests 3 local venues with pricing citations.

### Prompt B: Task Hydration
> Once an event is launched, the Operator Agent proposes 30 tasks in the Event Task Board. Tasks must be dated relative to the event (e.g., "Order catering" at EventDate - 14d).

## 🏗️ Screens Involved
*   `/events`
*   `/events/new`
*   `/events/:id`
