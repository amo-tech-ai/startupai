# 07 - Project Growth Rules

## Scalability Goal
Ensure the codebase remains navigable as the project scales to 50+ screens and multiple AI agents. Consistency in naming and folder organization is mandatory.

## Folder Creation Rules
- Components should start in a shared folder but move to domain-specific folders (e.g., `components/crm/`) once more than 3 related items exist.
- Avoid deep nesting beyond 4 levels.
- Logic-heavy hooks should live in a dedicated `hooks/` directory, separated by domain.

## File Naming Conventions
- **Components**: PascalCase (e.g., `DeckEditor.tsx`).
- **Hooks & Utilities**: camelCase (e.g., `useStartupProfile.ts`).
- **Styles & Config**: lowercase with hyphens (e.g., `tailwind.config.js`).

## Anti-patterns to Avoid
- Dumping large blocks of business logic in `App.tsx`.
- Deeply nested relative imports; favor path aliases.
- Mixing routing logic with UI components.