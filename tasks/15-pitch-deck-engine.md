# 15 - Pitch Deck Engine

## 📊 Progress Tracker
- [ ] Narrative Architecture Agent 0%
- [ ] Slide Editor Canvas 0%
- [ ] Image Visualizer Integration 0%

## 📋 Implementation Order
| Step | Task | Gemini Feature |
| :--- | :--- | :--- |
| 1 | Deck Gen | thinkingBudget: 4096 |
| 2 | Slide Edit | Structured Output |
| 3 | Visualization | Nano Banana |

## 🛠️ Multi-Step Prompts

### Prompt A: Narrative Architect
> Implement the "Architect Agent" on `/pitch-decks/new`. Using the Startup Profile, it must reason about the story arc and propose 12 slides (Sequoia format). Slides are written to `proposed_actions`.

### Prompt B: Slide Copilot UI
> In the Deck Editor, selecting a slide triggers the "Right Panel: Slide Copilot." It offers: "Make punchier," "Add data citations," or "Generate image." Each results in a diff-able proposal.

### Prompt C: Image Prompt Gen
> Wire the Visualizer Agent (Nano Banana). It takes a slide's bullet points and generates a professional, minimalist 16:9 illustration.

## 🏗️ Screens Involved
*   `/pitch-decks`
*   `/pitch-decks/:id`
