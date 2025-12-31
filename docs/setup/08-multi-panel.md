# 08 - Dashboard Expansion (3-Panel Ready)

## Strategy Overview
Transition the App Shell into a sophisticated 3-panel environment designed for agentic governance. This layout allows for high-context work where data, navigation, and intelligence coexist.

## Panel Logic
- **Left Panel (Scope)**: Navigation and contextual selection. No direct editing. Controls what is visible in the Main panel.
- **Main Panel (Execution)**: The primary workspace. WYSIWYG editors, Kanban boards, and data lists.
- **Right Panel (Intelligence)**: The home for AI Agents, suggested edits, and strategic oversight.

## Composable Design
- Panels must be optional. A simple task list might only show the Main panel, while a Pitch Deck editor uses all three.
- State must flow from Left -> Main -> Right. Selecting a startup on the left updates the editor in the middle and the AI context on the right.