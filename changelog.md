
# Changelog

## [v3.5.0] - Production Hardening & Security
### Features
- **Secure Data Room**: Files in `data-room` bucket are now private by default. Access is granted via **Signed URLs** generated on-demand.
- **Real-time Multiplayer**: CRM and Event dashboards now subscribe to Supabase Postgres Changes. Updates from other team members appear instantly.
- **Branded Dashboard**: The Navbar now dynamically pulls the **Startup Logo** for a white-label OS experience.
- **AI Audit Logs**: The `ai-helper` function now records latency, status, and tool usage to the `ai_runs` table.

## [v3.4.0] - Events & Lifecycle
### Added
- **Event Command Center**: Full lifecycle management for startup events.
- **AI Logistics**: Google Search Grounding for date conflicts and venue scouting.
- **ROI Analytics**: Post-event success reporting using Gemini Thinking mode.

## [v2.1.1] - Stability & Performance Patch
### Critical Fixes
- **Vite Sovereignty**: Removed `importmap` from `index.html` to align with production build rules.
- **Chart Layouts**: Fixed `ResponsiveContainer` collapse issues.
