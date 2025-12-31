# 05 - Data Access Layer

## Strategy Goal
Centralize all interactions with external services (Supabase, Gemini API) to ensure UI components remain focused on rendering and user interaction rather than networking logic.

## Design Patterns
- **Service Abstraction**: Create dedicated service modules for each domain (ProfileService, CrmService).
- **No Inline Fetching**: UI components should never invoke fetch or direct SDK calls. They must consume methods from the service layer.
- **Separation of Concerns**: Business logic and data transformation occur in services; presentation logic occurs in components.

## Technical Rules
- All requests must be authenticated via the centralized client.
- Data mapping (from DB format to UI format) should happen at the service boundary.
- Implement standard patterns for handling asynchronous operations and potential failures.