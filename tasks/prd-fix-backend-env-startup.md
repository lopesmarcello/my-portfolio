# PRD: Fix Backend Startup — Missing Environment Variables

## Introduction

The backend fails to start because `application.properties` requires three environment variables (`JWT_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`) that are not set in the local dev environment. Spring cannot resolve the placeholders at startup, causing `PlaceholderResolutionException` before any request is served.

The fix is to add safe fallback defaults for local development directly in `application.properties`, and document the required production env vars with an `.env.example` file.

---

## Goals

- Backend starts successfully without manually setting env vars in dev
- Production deployments still use secure env vars (no hardcoded secrets)
- Dev environment clearly documented so other contributors know what to set

---

## User Stories

### US-001: Add dev fallback defaults to `application.properties`

**Description:** As a developer, I want the backend to start without setting env vars locally so I can run it immediately without extra setup.

**Acceptance Criteria:**

- [ ] `application.properties` uses fallback syntax for all three required env vars:
  - `jwt.secret=${JWT_SECRET:dev-only-secret-key-minimum-32-chars-x}` (≥32 chars required by HMAC-SHA256)
  - `admin.username=${ADMIN_USERNAME:admin}`
  - `admin.password=${ADMIN_PASSWORD:admin}`
- [ ] Application starts successfully with `mvn spring-boot:run` and no env vars set
- [ ] When `JWT_SECRET`, `ADMIN_USERNAME`, or `ADMIN_PASSWORD` are set as env vars, those values take precedence over the defaults (standard Spring behavior — no extra code needed)

---

### US-002: Create `.env.example` documenting required env vars

**Description:** As a developer, I want a reference file listing all required environment variables so I know what to configure for production.

**Acceptance Criteria:**

- [ ] File `backend-java/portfolio/.env.example` is created with the following content:
  ```
  # Copy this file to .env and fill in real values before deploying to production.
  # These are NOT used automatically — set them as real environment variables.

  # JWT signing secret — must be at least 32 characters
  JWT_SECRET=replace-with-a-long-random-secret-string

  # Admin login credentials
  ADMIN_USERNAME=admin
  ADMIN_PASSWORD=replace-with-a-secure-password
  ```
- [ ] The file `.env.example` is committed to the repo (it contains no real secrets)
- [ ] Any actual `.env` file (with real secrets) is confirmed to be in `.gitignore`

---

## Functional Requirements

- FR-1: `application.properties` must provide a non-empty fallback value for `JWT_SECRET` that is at least 32 characters so `Keys.hmacShaKeyFor()` does not throw an `IllegalArgumentException`.
- FR-2: `application.properties` must provide fallback values for `ADMIN_USERNAME` and `ADMIN_PASSWORD`.
- FR-3: When env vars are set, they must override the defaults (standard `${VAR:default}` Spring syntax satisfies this automatically).
- FR-4: A `.env.example` file documents the required env vars for production deployments.

---

## Non-Goals

- No changes to security logic, JWT generation, or authentication flow
- No Spring profile setup (no `application-dev.properties`) — a single file with fallbacks is sufficient
- No automatic loading of a `.env` file — the defaults in `application.properties` are enough for dev

---

## Technical Considerations

- The `${VAR:default}` syntax is standard Spring property resolution. No extra dependencies or configuration needed.
- The fallback JWT secret must be ≥32 bytes because `Keys.hmacShaKeyFor()` enforces HMAC-SHA256 minimum key length. A 41-character ASCII string is safe.
- Verify `.gitignore` already excludes `.env` files — if not, add it.

---

## Success Metrics

- `mvn spring-boot:run` succeeds on a fresh clone with no env vars set
- No regression to existing security behavior — JWT auth still works correctly when env vars are set

---

## Open Questions

- None. Root cause is clear and fix is mechanical.
