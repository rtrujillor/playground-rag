# Architecture

This repository is the foundation for a Retrieval-Augmented Generation (RAG) system.
The current scaffold intentionally contains no ingestion, retrieval, answer-generation, or
vector database implementation.

## Use-case view

The first system-boundary view is maintained as a draw.io diagram:

- [Open the use-case diagram](use-cases.drawio)

The diagram defines the initial actors and interactions without committing to implementation
technology:

- **End User** uploads documents and searches the available content.
- **Administrator / Developer** provides ingestion input and configuration, and inspects
  ingestion status or errors.
- **Document Source** represents the origin of uploaded documents.
- **User Interface** is the application entry point for uploads, ingestion input, searches,
  and retrieval results.
- **Ingestion Boundary** accepts documents and ingestion configuration.
- **Retrieval Boundary** processes searches and returns source-backed results.
- **Storage Boundary** connects ingestion and retrieval, while its vector database provider
  remains undecided.

This is a high-level use-case view. Detailed component, sequence, data-flow, and deployment
diagrams belong in later design work.

## Boundaries

- `src/playground_rag/ingestion/`: future document parsing, normalization, chunking, and
  provenance work.
- `src/playground_rag/retrieval/`: future query handling, ranking, filtering, and result
  presentation work.
- `src/playground_rag/storage/`: future provider-neutral persistence and similarity-search
  integrations.
- `tests/unit/`: focused behavior tests for individual components.
- `tests/integration/`: tests spanning multiple project boundaries or external services.
- `tests/fixtures/`: small, safe, representative inputs used by tests and evaluations.
- `docs/`: architecture decisions, setup guidance, and future provider-selection criteria.

## Storage provider decision

No vector database is selected yet. Future storage code MUST be introduced behind the storage
boundary so ingestion and retrieval behavior can be evaluated before a permanent provider is
chosen. Provider selection belongs in a later feature and must consider retrieval quality,
operational complexity, cost, portability, and migration effort.

## Development workflow

The project uses Python 3.11 and `uv` with the committed lockfile. The baseline command is
`uv run playground-rag`; it must remain runnable without an external service while the scaffold
is being developed.
