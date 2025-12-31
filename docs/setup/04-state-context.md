# 04 - State & Context Boundaries

## State Management Philosophy
Global state should be treated as a last resort. Favor local component state or URL parameters for transient data. Use React Context only for data required by a large branch of the component tree.

## Context Usage Rules
- **Authentication**: Managing user sessions and identity.
- **Application Data**: Caching core entities (Startups, Deals, Metrics) synced from the database.
- **UI Signals**: Global toast notifications and command palette visibility.

## Implementation Guidelines
- Prevent prop drilling by wrapping the composition root in specialized providers.
- Maintain a clear separation between "Identity" state and "Business Data" state.
- Ensure all providers are lightweight to avoid unnecessary re-renders of the entire application shell.