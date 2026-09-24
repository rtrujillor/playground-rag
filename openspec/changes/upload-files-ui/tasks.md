# Tasks

## 1. Upload UI foundation

- [x] 1.1 Create the upload feature folder and page structure under `src/web/src/features/` following the existing Vue conventions.
- [x] 1.2 Add a drag-and-drop or file-picker entry point and basic file list rendering in the page.
- [x] 1.3 Implement file validation for supported types, empty files, and excessive file size.

## 2. Upload lifecycle and state handling

- [x] 2.1 Add upload lifecycle state tracking for queued, validating, uploading, uploaded, failed, and rejected files.
- [x] 2.2 Centralize upload API requests in the shared client layer instead of embedding raw fetch or Axios calls in the page.
- [x] 2.3 Add user-facing error handling and retry/error messaging for failed uploads.

## 3. Frontend verification

- [x] 3.1 Add unit/component coverage for file selection, validation, and status transitions.
- [x] 3.2 Add browser-level coverage for the successful upload flow and failure paths.
- [x] 3.3 Run the targeted frontend checks and confirm the upload page remains compatible with the existing development and build workflow.

## 4. Storage backend handoff

- [x] 4.1 Define the generic upload contract that the chosen backend implementation must satisfy.
- [x] 4.2 Revisit the storage decision once the ingestion architecture is ready and adapt the upload endpoint contract to the selected provider.
