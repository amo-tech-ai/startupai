# 06 - Error Handling & Loading Strategy

## UX Priorities
A professional OS must never leave the user in an ambiguous state. Every asynchronous action and potential failure must have a corresponding visual feedback mechanism.

## Strategy Components
- **Loading States**: Use unified skeleton screens or centered pulse animations for page-level transitions. Use inline spinners for action-level feedback.
- **Error Boundaries**: Wrap major application modules in boundaries to prevent a single crash from breaking the entire App Shell.
- **Empty States**: Provide clear, actionable empty states for all lists (CRM, Decks, Tasks) that guide the user toward the "next best action."

## Design Principles
- Errors should be descriptive but non-technical for the end user.
- Always provide a "recovery path" (e.g., Reload or Go Back buttons).
- Loading states should reflect the layout they are replacing to reduce layout shift.