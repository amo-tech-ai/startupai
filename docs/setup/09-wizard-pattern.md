# 09 - Wizard Architecture Pattern

## Purpose
Wizards are the primary method for agentic data intake. They should feel like a guided conversation rather than a form, reducing the mental load on the founder.

## Pattern Requirements
- **Step-based Navigation**: Clear progress indicators and the ability to move backward.
- **Validation**: Each step must be validated before moving forward to ensure high data integrity for the AI agents.
- **Handoff**: Upon completion, the wizard should execute a transactional write to the database and redirect the user to the corresponding operational dashboard.

## UX Principles
- Use progressive disclosure: only ask for what is needed in the current context.
- Favor AI-assisted auto-fill buttons over manual text entry.
- Provide a summary review as the final step before submission.