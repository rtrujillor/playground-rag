# Tasks

## 1. Frontend package

- [x] 1.1 Create the isolated Vue/TypeScript/Vite package under `src/web/` with the README's dependencies, pinned pnpm tooling, and lockfile; verify a frozen-lockfile install succeeds using documented Node prerequisites.
- [ ] 1.2 Configure strict type checking, ESLint, Prettier, Vitest/Vue Test Utils, and Playwright scripts; verify each command is discoverable in the package manifest and runs against the scaffold once the page is present.

## 2. Application foundation

- [ ] 2.1 Add feature/shared folders, Vuetify shell, Pinia registration, and a lazy-loaded home route using the README conventions; verify `/` renders a single minimal home page with a semantic heading and main region.
- [ ] 2.2 Add optional typed API environment configuration and a passive Axios client with centralized error handling; verify configuration parsing for absent, valid, and invalid values and confirm home loading triggers no API request.
- [ ] 2.3 Add focused component and browser smoke checks for home rendering, backend independence, and mobile/desktop layout; verify they pass without running backend services.

## 3. Container workflows

- [ ] 3.1 Add a development Docker target and Compose source/dependency mounts with no backend dependency; verify the host can open the page and a source edit appears through hot reload without rebuilding.
- [ ] 3.2 Add the production build and static-server targets plus a focused Docker ignore file; verify the built image serves `/` and its assets without source mounts, a development server, or backend services.
- [ ] 3.3 Wire the documented optional API base URL into development and production build configuration; verify an unset value permits startup and a supplied value reaches client configuration without startup requests.

## 4. Documentation and final checks

- [x] 4.1 Document frontend prerequisites, local commands, both container workflows, and build-time public API configuration; correct the root README's frontend path and verify the documented commands match the delivered files while preserving frontend conventions in `src/web/README.md`.
- [x] 4.2 Add a concise reference to `src/web/README.md` in `openspec/config.yaml` context without duplicating frontend conventions or selecting backend technology; verify OpenSpec reads the configuration successfully.
- [ ] 4.3 Run the frozen dependency install, type checks, lint/format checks, unit/component tests, browser tests, and production build, then smoke-test both container workflows; record results and any environmental limitations.
