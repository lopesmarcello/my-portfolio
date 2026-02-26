# PRD: Developer Setup Guide

## Introduction

Create a comprehensive developer setup guide that enables new contributors to run the full portfolio project locally, including both frontend and backend services with database migrations.

## Goals

- New developers can set up the project in under 30 minutes
- Document all required tools and versions
- Cover database setup and migrations
- Include troubleshooting for common issues
- Serve as reference for existing developers

## User Stories

### US-001: Document prerequisites and tool requirements

**Description:** As a new developer, I need to know what tools to install before setting up the project.

**Acceptance Criteria:**

- [ ] List required tools with versions (Node.js, pnpm, Java 17, Maven, Docker, PostgreSQL)
- [ ] Provide installation links for each tool
- [ ] Verify commands work on the system

### US-002: Document frontend setup

**Description:** As a developer, I need to run the frontend locally for development.

**Acceptance Criteria:**

- [ ] Document pnpm installation
- [ ] Document frontend dependency installation
- [ ] Document how to run dev server
- [ ] Document available npm scripts

### US-003: Document backend setup

**Description:** As a developer, I need to run the backend API locally.

**Acceptance Criteria:**

- [ ] Document Maven installation
- [ ] Document backend dependency installation
- [ ] Document how to run Spring Boot application
- [ ] Document available Maven commands

### US-004: Document database and migrations

**Description:** As a developer, I need to set up the PostgreSQL database and run migrations.

**Acceptance Criteria:**

- [ ] Document Docker Compose command to start PostgreSQL
- [ ] Document database connection settings
- [ ] Document how to create the database
- [ ] Document migration or schema setup process (if using Flyway/Liquibase)
- [ ] Document how to reset the database if needed

### US-005: Document environment configuration

**Description:** As a developer, I need to know what environment variables to configure.

**Acceptance Criteria:**

- [ ] List required .env variables for frontend
- [ ] List required application properties for backend
- [ ] Document default values where applicable
- [ ] Provide example configuration files

### US-006: Document common issues and solutions

**Description:** As a developer, I need troubleshooting help when setup fails.

**Acceptance Criteria:**

- [ ] Document port conflicts and how to resolve
- [ ] Document database connection failures
- [ ] Document common build errors
- [ ] Document how to clean and rebuild

### US-007: Document verification steps

**Description:** As a developer, I need to verify the setup is working correctly.

**Acceptance Criteria:**

- [ ] Document how to verify frontend is running
- [ ] Document how to verify backend is running
- [ ] Document how to verify database connection
- [ ] Document how to test API endpoints

### US-008: Create README in project root

**Description:** As a developer, I need all setup instructions in an easily discoverable location.

**Acceptance Criteria:**

- [ ] Create comprehensive README.md in project root
- [ ] Include table of contents for quick navigation
- [ ] Include quick-start section for experienced developers
- [ ] Link to detailed sections for each component

## Functional Requirements

- FR-1: Prerequisites section lists all required tools with versions
- FR-2: Frontend section covers pnpm, dependencies, and dev server
- FR-3: Backend section covers Maven, dependencies, and Spring Boot
- FR-4: Database section covers Docker Compose and PostgreSQL setup
- FR-5: Environment section documents all required configuration
- FR-6: Troubleshooting section covers at least 5 common issues
- FR-7: README includes verification steps to confirm successful setup

## Non-Goals

- No deployment or production configuration
- No CI/CD pipeline documentation
- No detailed architecture explanations
- No code contribution guidelines (separate document)

## Technical Considerations

- Reuse existing command examples from CLAUDE.md
- Check existing README if present before overwriting
- Consider platform-specific instructions (macOS/Linux/Windows)

## Success Metrics

- New developer can complete setup in under 30 minutes
- Troubleshooting section resolves top 5 common issues
- Zero configuration errors for default setup

## Open Questions

- Should we include VS Code recommended extensions?
- Should we include Git hooks setup (pre-commit)?
- Is there existing documentation to update instead of create fresh?
- Should we create separate backend-java/README.md instead of single root README?
