# Website development

The frontend is an independent package in `src/web/`. Its home page provides
navigation to Upload (`/upload`) and Search (`/search`), with Home navigation on
each page. Search is currently a placeholder. Home loading needs no backend and
makes no initial API requests. Frontend stack and
architecture conventions live in [its README](../src/web/README.md). Document
ingestion, search results, questions, and authentication are future work.

On Upload, select multiple files at once or add them in successive selections.
The combined list shows each file's name, extension, size, and status, plus a file
count and total size. Remove individual files before submitting. Selecting the
same name, size, and modification time again does not add a duplicate; files can
be selected again after removal. Selection and removal pause during submission.
The list and its file objects are held in shared Pinia state and survive navigation
between Home, Upload, and Search. File bytes and list state are saved in IndexedDB
under a tab-session identifier in sessionStorage and restored after a refresh.
A new tab session starts a separate list. Browser session restoration can restore
the previous session. Storage failures are shown on Upload; wait for the saving
message to disappear before refreshing. Submission still uses
the existing frontend stub, so files are not yet stored by a backend.

## Local development with pnpm (default)

Run the website directly with pnpm for everyday development. Docker is optional
and is only needed when you choose to build or run a container.

Use Node 24.18 or later in the Node 24 line and pnpm 11.10.0. For example, after
installing Node, install pnpm with `npm install --global pnpm@11.10.0`.
Run the following from the repository root:

```sh
cd src/web
pnpm install --frozen-lockfile
pnpm dev
```

Open <http://localhost:5173>. Frontend commands do not require Python or `uv`.
Source paths such as `src/features` and `src/shared` are relative to `src/web/`.

## Checks

Run from `src/web/`:

```sh
pnpm check
pnpm exec playwright install chromium
pnpm test:e2e
```

`pnpm check` runs type checking, linting, formatting checks, unit/component tests,
and a production build. The individual commands are `pnpm typecheck`, `pnpm lint`,
`pnpm format:check`, `pnpm test`, and `pnpm build`. Use `pnpm format` to format files.
Browser tests start a local server on port 5173, so stop any other server on that
port first. To test an already running server instead:

```sh
PLAYWRIGHT_BASE_URL=http://127.0.0.1:5173 pnpm test:e2e
```

## Optional development container

If you want containerized development instead of local pnpm, stop the local
server to free port 5173. With Docker and the Compose plugin running, execute
from `src/web/`:

```sh
docker compose up --build
```

Open <http://localhost:5173>. Source is mounted for hot reload; dependencies live
in a container volume and are synchronized with the frozen lockfile on startup.
No backend services are started. If filesystem events do not reach the container,
use `WATCH_POLLING=true docker compose up --build`. Stop it with
`docker compose down`; this retains the dependency volume for later use.

## Build a production container when needed

Run from `src/web/`:

```sh
docker build --target production -t playground-rag-web .
docker run --rm -p 127.0.0.1:8080:8080 playground-rag-web
```

Open <http://localhost:8080>. The image serves compiled assets with Nginx; it needs
no source mount, Node development server, or backend. `pnpm build` also produces
local assets in `dist/`; `pnpm preview` serves those for local inspection.

## Future API configuration

`VITE_API_BASE_URL` is optional. An empty or absent value allows normal home-page
startup. When supplied, it must be an absolute HTTP or HTTPS URL. Invalid values
fail environment validation; an unconfigured API client rejects requests before
network access. The home page never calls this client.

For local development copy `.env.example` to `.env.local`, set the value, and
restart Vite. For Compose use an environment variable:

```sh
VITE_API_BASE_URL=https://api.example.test docker compose up --build
```

For production supply a build argument:

```sh
docker build --target production \
  --build-arg VITE_API_BASE_URL=https://api.example.test \
  -t playground-rag-web .
```

Production configuration is baked into the JavaScript at build time: changing it
requires rebuilding the image. Setting an environment variable on the running
Nginx container does not change the built frontend. All `VITE_*` values are public;
never put secrets or credentials in them. Docker excludes local environment files.
