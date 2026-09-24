# Design

## Overview

Add a new upload feature to the Vue frontend that follows the project conventions in `src/web/README.md`: keep UI components feature-oriented, centralize API behavior in the shared client layer, and keep validation and status handling separate from the backend implementation details.

## User Experience

The upload experience should be intentionally simple and backend-agnostic:

- A user selects files from a drag-and-drop area or file picker.
- The app shows the file list, file size, and validation status.
- Unsupported or invalid files are surfaced with friendly errors.
- A user can submit valid files to a generic upload workflow.
- The page updates with success, progress, and failure states for each file.

## Frontend Structure

Recommended layout under the web application:

- `src/features/upload/`
  - `UploadPage.vue`
  - `UploadDropzone.vue`
  - `UploadFileList.vue`
  - `UploadSummary.vue`
- `src/shared/api/`
  - `upload.ts` for the upload request abstraction
  - extensions to the existing client utilities for error handling

## State Model

The upload feature should maintain a small, explicit file state model:

- `queued`
- `validating`
- `uploading`
- `uploaded`
- `failed`
- `rejected`

This keeps the UI understandable and allows for straightforward tests around each status transition.

## Validation Rules

Start with a conservative validation policy:

- file types restricted to a small supported set such as PDF, TXT, MD, and DOCX
- zero-byte files rejected
- over-size files rejected
- unsupported files blocked before submission

Validation should happen in the browser before any API call is made, with the same error messaging reused in the network layer when backend responses fail.

## API Contract

The frontend should not commit to a specific storage backend. Instead, define a generic upload contract that can later map to the selected storage system:

- request: multipart form upload
- response: upload metadata, status, error message, or upload id
- failure states: validation or server-side rejection

This keeps the user experience stable while the storage provider is selected later.

## Error Handling

User-visible errors should be handled at three points:

1. File validation before upload
2. Request-level failures in the API client
3. UI-state rendering for retry and failure recovery

The shared API client should centralize request parsing and error normalization so the feature does not scatter backend-specific logic across the page.

## Testing Approach

Plan tests around the real UI flow, not mock-only assumptions:

- component tests for file selection and validation
- component tests for upload status transitions
- browser test covering the happy path for a valid file upload
- browser test covering rejected and failed uploads

## Risks and Follow-ups

The main gap is the backend storage implementation. This plan intentionally avoids choosing a provider so the frontend contract remains adaptable. The eventual storage decision should be driven by the repo's later ingestion and retrieval architecture work.
