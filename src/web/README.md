Contains the independent Vue.js single-page application (SPA) with shared Home, Upload, and Search navigation, an upload page, and a search placeholder. Use pnpm for everyday local development; development and production containers are available when needed. Ingestion tracking, search results, and questions with cited answers are planned for later features. See [setup and checks](../../docs/web-development.md); frontend conventions are defined below.

# Vue Application Foundation

Modern Vue.js application scaffold designed for maintainability, scalability, and AI-assisted development.

## Stack

- Vue 3 + TypeScript + Vite
- Vuetify 3 for UI and responsive design
- Pinia for shared application state
- Vue Router for navigation
- Axios for HTTP/API communication
- Zod + VeeValidate for validation and forms
- Vitest + Vue Test Utils for unit/component testing
- Playwright for end-to-end testing
- ESLint + Prettier for code quality
- pnpm as package manager

## Architecture

- Use Composition API and `<script setup lang="ts">`.
- Organize code by features under `src/features`; reusable code belongs in `src/shared`.
- Follow: `Component → Store/Composable → Service → API Client → Backend`.
- Components must not call external APIs directly.
- Keep local state in components/composables; use Pinia only for shared state.
- Centralize typed environment configuration and API/error handling.
- Use Vuetify components/theme before creating custom UI/CSS.
- Use strict TypeScript; avoid `any` and validate external data with Zod.
- Lazy-load routes and keep authentication behind an abstraction.
- All code must pass type checking, linting, tests, and production build.
