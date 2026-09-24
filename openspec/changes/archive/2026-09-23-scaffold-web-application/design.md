# Design

## Context

See proposal.md for motivation. `src/web/` currently contains only a README defining the selected frontend stack and conventions. There are no frontend manifests, containers, or tests to preserve. The root README still shows the older `web/` path. Python is managed independently at repository root. This design is needed because the scaffold introduces frontend dependencies and container workflows.

## Goals / Non-Goals

**Goals:** Isolate frontend tooling in `src/web/`, make both container modes usable without backend services, and establish small extension points following `src/web/README.md`.

**Non-Goals:** Define API contracts, choose backend technologies, add business screens or authentication providers, or set up deployment infrastructure and CI services.

## Decisions

Local development uses `pnpm dev` directly by default. Container workflows are optional and used on demand; Docker is not a prerequisite for working on the website locally.

1. **Self-contained frontend package.** Place the package manifest, pnpm lockfile, Vite configuration, and container files under `src/web/`. Its application source uses `src/web/src/features/home` and `src/web/src/shared`; paths in the frontend conventions are relative to the frontend package. This avoids mixing JavaScript dependencies into Python tooling. A root JavaScript workspace adds no value for one frontend package.

2. **Follow the README stack.** Use Vue 3 with strict TypeScript, Vite, Vuetify 3, Pinia, Vue Router, Axios, Zod, VeeValidate, Vitest/Vue Test Utils, Playwright, ESLint, Prettier, and pnpm as specified there. Pin compatible versions and record the Node and pnpm prerequisites during implementation. Register application plugins and lazy-load only the home route. Install validation foundations without creating demonstration forms, unused stores, or authentication flows. The README remains the authority for frontend conventions; add only a reference to it in OpenSpec context during implementation.

3. **Minimal rendered surface.** Use a Vuetify application shell with a semantic main region, a project heading, and brief scaffold text. Add no navigation for unimplemented features. A feature dashboard would expand the agreed single-page scope.

4. **Passive API foundation.** Centralize typed environment parsing and an Axios client with shared error normalization, but do not call it from home page setup or startup hooks. Proposed default: an optional `VITE_API_BASE_URL`, validated when supplied and documented as public, build-time configuration for production. Missing configuration does not prevent startup. Runtime-injected production configuration is deferred because no active API integration is in scope. No credentials belong in frontend environment variables.

5. **Two container modes.** Proposed implementation detail: one multi-stage Dockerfile with a development target running Vite and a production build stage followed by an Nginx static-serving stage. A Compose development service binds source, keeps container dependencies in a dedicated volume, publishes the Vite port, and has no backend dependency. The production target copies only built assets and server configuration and can run directly without Compose or mounts. This keeps the two modes explicit; using Vite's development server in production would not exercise the production build. Include a focused `.dockerignore`.

6. **Focused verification.** Provide type, lint, formatting, component-test, end-to-end, and build commands. Test the home page and environment parsing at the appropriate level; use a browser smoke test to verify rendering without application API requests. Validate hot reload and standalone production serving with container smoke checks. Avoid business-feature test fixtures. Keep frontend tests with the frontend package rather than the Python test scaffold.

## Risks / Trade-offs

- Container file watching can vary by host filesystem -> document a polling fallback if native watching fails and verify a host edit in the development container.
- Build-time API configuration requires a production image rebuild when the endpoint changes -> document this explicitly; runtime configuration can be a future change.
- The selected stack is larger than the first page needs -> configure the foundation without speculative services, stores, or forms.
- Existing user edits include frontend documentation and ignore rules -> preserve them and make only additive, scoped adjustments.

## Migration Plan

Add the frontend package and verify local checks before container checks. Correct the root README path and document setup, commands, and public API configuration; preserve the frontend conventions in their README. Add the README reference to OpenSpec context without introducing backend choices. There is no data migration or existing frontend deployment. Rollback consists of reverting the scaffold change while preserving unrelated user work.
