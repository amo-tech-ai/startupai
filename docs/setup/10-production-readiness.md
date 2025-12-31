# 10 - Production Readiness Guardrails

## Deployment Checklist
Before launching updates, ensure all production guardrails are met to prevent system regression or security leaks.

## Core Checks
- **Build Integrity**: `npm run build` must complete without errors or critical warnings.
- **Secret Management**: Confirm that no AI API keys or backend secrets are hardcoded in the client bundle. Use environment variable isolation.
- **Observability**: Ensure critical AI runs are logged to the `ai_runs` table for latency and cost auditing.
- **Performance**: Validate that layout shifts are minimized and heavy components (like the Deck Editor) use lazy loading.

## Security Rules
- Row Level Security (RLS) must be enabled and verified for all new tables.
- All AI-driven writes must pass through the Governance Hub (Proposed Actions).
- User session persistence must be tested across reloads.