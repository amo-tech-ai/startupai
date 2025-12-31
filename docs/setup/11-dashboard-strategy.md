# 11 - Dashboard Strategy: 3-Panel OS

## Overview
This document defines the interaction model for the entire StartupAI platform, moving beyond simple data views into agentic governance.

## 1. Panel Logic
- **Left Panel (Navigation/Scope)**: No editing occurs here. This is for contextual selection only. It sets the active entity for the rest of the shell.
- **Main Panel (Execution)**: The active workspace. This is the source of truth for current projects, whether it is a slide deck, a CRM pipeline, or a document.
- **Right Panel (Intelligence)**: Home for AI Agents, proposed writes, and strategic oversight. It observes the Main panel and suggests improvements.

## 2. Agent Catalog
- **Analyst Agent**: Focuses on burn analysis, financial forensics, and runway projections.
- **Scout Agent**: Focuses on market comparisons, competitor discovery, and investor fit.
- **Architect Agent**: Focuses on narrative flow, pitch structure, and storytelling.

## 3. Workflow Logic
AI never acts invisibly to maintain user trust. All writes follow this mandatory cycle:
1. **Trigger**: User initiates an agent or a system event occurs.
2. **Propose**: AI generates a suggested change and displays it in the Right Panel.
3. **Approve**: The user reviews, edits, or approves the proposal.
4. **Execute**: The change is committed to the database and reflects in the Main Canvas.