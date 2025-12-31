# 02 - Routing & Layout Foundation

## Strategy Overview
The routing architecture focuses on a declarative, nested structure that clearly separates the public-facing marketing surfaces from the internal application dashboard. This ensures that layout logic is handled at the route level rather than inside page components.

## Architectural Rules
- Use nested route definitions to manage shared layouts (Marketing vs. App).
- Implement a composition root where the router is defined centrally.
- Routes should be declarative and mapped directly to page-level components.
- Avoid deep nesting of route logic to maintain readability.

## Structural Requirements
- A root-level layout for public pages (Home, Pricing, Features).
- A protected layout for application pages (Dashboard, CRM, Pitch Decks).
- Clear boundaries for "Not Found" handling.
- Preparation for dynamic parameters (e.g., entity IDs).