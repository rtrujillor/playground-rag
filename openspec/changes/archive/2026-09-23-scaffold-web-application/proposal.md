# Proposal

## Why

The website currently has a README but no runnable application. Establishing an independent frontend foundation will allow later RAG features to be developed against a consistent structure and verified in development and production containers.

## What Changes

- Scaffold the Vue application in `src/web/` using the stack and conventions in `src/web/README.md`.
- Provide one minimal home page that works without a backend and makes no initial API requests.
- Prepare routing, UI theming, shared state registration, typed environment configuration, and an API client for future features.
- Use pnpm directly for everyday local development; provide optional development containers with hot reload and production containers for serving the built application when needed.
- Configure frontend quality checks and document local and container workflows.
- Reference `src/web/README.md` from OpenSpec project context as the source of frontend conventions rather than duplicating them.

Document upload, ingestion tracking, question answering, authentication flows, web API implementation, and backend implementation are outside this change.

## Capabilities

### New Capabilities

- `web-foundation`: An independently runnable minimal website with frontend tooling and development and production container workflows.

### Modified Capabilities

None.

## Impact

Adds frontend source, JavaScript dependencies and a pnpm lockfile, checks, and container configuration under `src/web/`. Updates relevant setup documentation and the frontend reference in `openspec/config.yaml` during implementation. Python dependencies and existing backend boundaries are unaffected. No API contracts are introduced.
