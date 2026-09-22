# playground-rag
Repo to play with different RAG ingestion and retrieval techniques and tools for parse/ocr, extraction, index and search

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

### 3. Run the project or Python

Run the project's command:

```sh
uv run playground-rag
```

The current starter prints `Hello from playground-rag!`.

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

### 4. Manage dependencies

To add a runtime dependency, for example:

```sh
uv add requests
```

To add a development dependency, for example:

```sh
uv add --dev pytest
```

These commands update `pyproject.toml`, `uv.lock`, and the environment. Commit both dependency files when changing dependencies.

There is currently no `dev` dependency group. Once development dependencies are added, `uv sync` includes them by default; `uv sync --dev` explicitly includes that group. `uv add dev` tries to install a package named `dev`, so use `--dev` followed by a package name when adding development tools.


PARSE ( OCR ) / EXTRACT

https://www.llamaindex.ai/blog/introducing-extractbench

LITEPARSE

https://github.com/run-llama/liteparse

LLAMAPARSE
