# Spec Delta

## Purpose

Provide a minimal, independently runnable website foundation with repeatable local development, container workflows, and automated frontend checks for future RAG features.

## ADDED Requirements

### Requirement: Independent minimal home page
The website SHALL present a single minimal home page at `/`, identifying the RAG playground, without requiring a running web API or backend. Initial page loading SHALL make no application API requests and SHALL expose no document upload, ingestion tracking, question-answering, or authentication workflows.

#### Scenario: Open the website without a backend
- **WHEN** a user opens `/` with all backend services stopped
- **THEN** the home page renders successfully without API requests or backend connection errors

### Requirement: Responsive and accessible foundation
The home page SHALL provide a semantic main region and descriptive heading and remain readable on mobile and desktop viewports without horizontal overflow.

#### Scenario: View the home page at different widths
- **WHEN** the home page is viewed at mobile and desktop widths
- **THEN** its heading and content are readable and the page does not overflow horizontally

### Requirement: Repeatable frontend workflow
The frontend SHALL provide documented commands to install locked dependencies, run a development server, check types and code quality, run unit/component and end-to-end checks, and produce a production build independently of Python tooling.

#### Scenario: Validate a clean checkout
- **WHEN** a developer follows the documented install and check commands with the documented prerequisites
- **THEN** dependencies install from the lockfile and checks and the production build complete successfully without a backend

### Requirement: Development container with hot reload
The website SHALL support a documented development container workflow that serves the home page on the host and reflects source edits without rebuilding the image. It SHALL start without backend services.

#### Scenario: Edit a running development application
- **WHEN** a developer changes home page content in the mounted source while the development container is running
- **THEN** the browser reflects that change through hot reload without an image rebuild

### Requirement: Independent production container
The website SHALL support a documented production image that serves built frontend assets without a source mount, development server, or backend dependency.

#### Scenario: Run the built image
- **WHEN** the production image is started with a published HTTP port and no backend services
- **THEN** a browser can load and refresh `/` and retrieve the application's built assets successfully

### Requirement: Configuration for future API access
The scaffold SHALL support a documented optional API base URL setting without making API calls on startup. The website SHALL remain usable when that setting is absent.

#### Scenario: Configure a future API endpoint
- **WHEN** a developer supplies a valid API base URL using the documented configuration workflow
- **THEN** the future API client uses that configuration while initial home page loading makes no API requests

#### Scenario: Omit API configuration
- **WHEN** the website starts without an API base URL
- **THEN** the minimal home page renders successfully
