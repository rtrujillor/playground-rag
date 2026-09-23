# playground-rag

Project scaffold for experimenting with RAG ingestion and retrieval techniques.

The current feature creates the development foundation only. Document ingestion, retrieval
behavior, evaluation, answer generation, and vector database selection are planned as later
features.

## Getting started with uv

This repository uses [uv](https://docs.astral.sh/uv/guides/projects/) to manage Python and dependencies. The Python version is pinned to 3.11 in `.python-version`.

### 1. Install uv

On macOS with Homebrew:

```sh
brew install uv
uv --version
```

For other installation methods, see the [uv installation guide](https://docs.astral.sh/uv/getting-started/installation/).

### 2. Set up the environment

From the repository root, run:

```sh
uv python install 3.11
uv sync
```

`uv sync` creates `.venv` and installs the project and its dependencies using `uv.lock`.

### 3. Run the baseline command

Run the project's command:

```sh
uv run playground-rag
```

The command above is the configured entry point, but the current checkout does not contain
its `src/playground_rag` package. Restore or implement the application entry point and align
the package configuration before using `uv sync` or running the application; the new folders
currently contain documentation only.

### 4. Project structure

The folder layout follows the RAG project structure reference. Each application and data
folder includes a short README describing its purpose; Python modules and infrastructure
configuration will be added during implementation. Dependencies are managed with
`pyproject.toml` and `uv.lock`, rather than `requirements.txt`.

```text
data/
  raw/
  parsed/
  eval/
src/
  schemas/
  ingestion/
  chunking/
  embeddings/
  vectordb/
  lexical/
  retrieval/
  rerank/
  query/
  cache/
  prompts/
  llm/
  generation/
  eval/
  observability/
  security/
  api/
  pipelines/
  utils/
web/
jobs/
tests/
  unit/
  integration/
  fixtures/
logs/
docs/
```

Existing documentation and dotfiles are preserved. The use-case diagram is in
`docs/use-cases.drawio`, and architecture notes are in `docs/architecture.md`.

Open the Python interpreter:

```sh
uv run python
```

To run a script, use `uv run python path/to/script.py`, replacing the path with your script's location.

If plain `python` reports `zsh: command not found: python`, use `uv run python` or activate the environment in your current terminal:

```sh
source .venv/bin/activate
python
```

Exit Python with `exit()`. After activating the environment, run `deactivate` in the shell when finished.

### 5. Manage dependencies

To add a runtime dependency, for example:

```sh
uv add requests
```

To add a development dependency, for example:

```sh
uv add --dev pytest
```

These commands update `pyproject.toml`, `uv.lock`, and the environment. Commit both dependency files when changing dependencies.

There is currently no `dev` dependency group. Once development dependencies are added,
`uv sync` includes them by default; `uv sync --dev` explicitly includes that group. `uv add
dev` tries to install a package named `dev`, so use `--dev` followed by a package name when
adding development tools.

## Future storage decision

No vector database is selected yet. Future storage work must remain behind the storage
boundary so the ingestion and retrieval design can be evaluated before choosing a provider.
See [docs/architecture.md](docs/architecture.md) for the decision criteria.
