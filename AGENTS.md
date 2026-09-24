# Agent instructions

- Read `README.md` and relevant folder READMEs before making changes.
- Keep changes focused on the requested task. The project is currently a documentation scaffold; add implementation only when requested.
- Use Python 3.11 and `uv` for Python commands and dependency management. Keep `pyproject.toml` and `uv.lock` aligned when changing dependencies.
- Keep components in their respective `src/` folders and pipeline orchestration in `src/pipelines/`.
- Keep storage integrations behind the storage boundary; no vector database provider has been selected yet.
- Follow existing conventions and prefer simple, readable solutions.
- Update relevant documentation when behavior or structure changes. Keep scaffold folder READMEs to one concise paragraph.
- Run checks appropriate to the change when available, and report what was verified or could not be run. Documentation-only changes do not require application tests.
- Preserve unrelated work and never commit secrets, credentials, or private source documents.
