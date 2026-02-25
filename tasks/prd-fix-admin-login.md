# PRD: Fix Admin Frontend Login

## Introduction

Admin login is broken end-to-end. Despite entering correct credentials, users see an "Invalid credentials" error. There are two root causes:

1. **`spring.config.import` may silently fail to load `.env`**, causing Spring to fall back to the hardcoded defaults (`admin`/`admin`) instead of the real credentials from `.env`. The `optional:` prefix suppresses any loading error, making this invisible at startup.
2. **The `GET /api/auth/me` endpoint is missing from the backend.** The Next.js middleware calls this endpoint on every admin page request to validate the session token. Without it, even a successful login results in an immediate redirect back to the login page (middleware sees the 404/500, treats the user as unauthenticated).

## Goals

- Admin can log in with the credentials stored in `.env`
- After login, the admin stays on `/admin/dashboard` (middleware validates the token correctly)
- Error messages are meaningful: credential errors vs server errors are distinguishable
- Regression tests prevent these bugs from re-appearing silently

## User Stories

---

### US-001: Verify and fix `.env` loading in Spring Boot

**Description:** As a developer, I need to confirm that the `ADMIN_USERNAME` and `ADMIN_PASSWORD` environment variables are actually loaded from `.env` at startup, so that the login check compares against the correct credentials.

**Background:**
- `application.properties` line 2: `spring.config.import=optional:file:../.env[.properties]`
- The `optional:` prefix means Spring silently skips the file if it can't be found or parsed — no startup error, just falls back to `admin`/`admin`
- The `.env` file lives at `backend-java/.env`; Maven is run from `backend-java/portfolio/`, so `../` should resolve to `backend-java/` — verify this is actually working
- If loading is broken, fix the path or mechanism so env vars are reliably loaded

**Acceptance Criteria:**

- [ ] Add a startup log line (INFO level) in `AuthService` or a `@PostConstruct` that prints the loaded `admin.username` (NOT the password) — e.g. `"Admin username loaded: l0p35x3L0"` — confirming the env var was picked up
- [ ] Start the backend with `mvn spring-boot:run` from `backend-java/portfolio/` and confirm the log shows the correct username from `.env`, not the fallback `admin`
- [ ] If the env is not loading, fix `spring.config.import` path (e.g. change to `optional:file:../../.env[.properties]` if needed, or use OS-level env export) so the correct values are loaded
- [ ] Remove or keep the debug log at developer's discretion after verification (if kept, ensure password is never logged)
- [ ] Typecheck/lint passes

---

### US-002: Add `GET /api/auth/me` endpoint to the backend

**Description:** As the Next.js middleware, I need a `GET /api/auth/me` endpoint that validates a Bearer token and returns 200 OK if valid (and 401 if not), so that the middleware can confirm the user's session on every admin page load.

**Background:**
- `frontend/middleware.ts:12` fetches `${API_URL}/auth/me` with `Authorization: Bearer <token>`
- This endpoint does not exist → backend returns 404 → `response.ok` is false → middleware treats every request as unauthenticated → redirects to login regardless of token validity
- The endpoint only needs to verify the JWT signature/expiration and return a success/failure status — no body required

**Acceptance Criteria:**

- [ ] Add `GET /api/auth/me` to `AuthController`
- [ ] Endpoint is protected by Spring Security (requires valid Bearer token in `Authorization` header)
- [ ] Returns `200 OK` with `{ "username": "<admin-username>" }` when token is valid
- [ ] Returns `401 Unauthorized` when token is missing, expired, or invalid (handled automatically by `JwtAuthenticationFilter` + Spring Security)
- [ ] Endpoint is listed as secured in `SecurityConfig` (i.e. NOT in the permitAll list)
- [ ] Add `MeResponseDTO` (or reuse an existing DTO) containing `username`
- [ ] Typecheck/lint passes

---

### US-003: Distinguish credential errors from server errors in the login UI

**Description:** As an admin user, I want to see a clear error message that tells me whether my credentials were wrong or whether there was a server/connection problem, so I know whether to retry with different credentials or check the backend.

**Background:**
- `frontend/app/admin/login/page.tsx` currently shows a single "Invalid credentials" string for all failure cases
- A network error (backend is down) and a 401 response (wrong password) are different problems and should have different messages

**Acceptance Criteria:**

- [ ] If the backend returns `401`, show: _"Invalid username or password."_
- [ ] If the request fails due to a network error or backend returns `5xx`, show: _"Could not reach the server. Please try again."_
- [ ] Error message is visible below the submit button, styled consistently with existing UI
- [ ] Typecheck/lint passes
- [ ] Verify in browser using dev-browser skill

---

### US-004: Add backend integration tests for the auth flow

**Description:** As a developer, I need automated tests covering the login and `/me` endpoints so that credential loading and token validation regressions are caught immediately.

**Background:**
- `PortfolioApplicationTests.java` only contains a context-loads smoke test
- No auth tests exist — this is why both bugs went undetected

**Acceptance Criteria:**

- [ ] `POST /api/auth/login` with correct credentials returns `200 OK` and a non-empty `token`
- [ ] `POST /api/auth/login` with wrong credentials returns `401 Unauthorized`
- [ ] `GET /api/auth/me` with a valid Bearer token returns `200 OK` and `username`
- [ ] `GET /api/auth/me` with no token returns `401 Unauthorized`
- [ ] `GET /api/auth/me` with an expired/invalid token returns `401 Unauthorized`
- [ ] Tests use `@SpringBootTest` + `MockMvc` (or `TestRestTemplate`) — consistent with existing test setup
- [ ] `mvn test` passes

---

### US-005: End-to-end verification of the complete login flow

**Description:** As a developer, I want to manually verify that an admin can log in, stay on the dashboard, and have their session correctly rejected after logout, so that I'm confident the full flow works before shipping.

**Acceptance Criteria:**

- [ ] Start backend (`mvn spring-boot:run`) and frontend (`pnpm dev`) locally
- [ ] Navigate to `http://localhost:3000/admin/login`
- [ ] Enter the credentials from `.env` — form submits successfully, redirects to `/admin/dashboard`
- [ ] Refresh `/admin/dashboard` — user stays on dashboard (middleware validates token via `/api/auth/me`)
- [ ] Navigate to `/admin/login` while logged in — redirected to `/admin/dashboard`
- [ ] Click Logout — redirected to `/admin/login`
- [ ] Enter wrong credentials — see "Invalid username or password." error
- [ ] Take backend offline, attempt login — see "Could not reach the server." error
- [ ] Verify in browser using dev-browser skill

---

## Functional Requirements

- **FR-1:** `GET /api/auth/me` must exist, be protected by JWT auth, and return `200` with `{ "username": "..." }` for valid tokens
- **FR-2:** `POST /api/auth/login` must compare credentials against values loaded from `.env` (not fallback defaults)
- **FR-3:** The login UI must distinguish between `401` errors and network/server errors with different messages
- **FR-4:** Backend integration tests must cover login success, login failure, `/me` success, and `/me` failure scenarios
- **FR-5:** The admin session token must be validated by the middleware on every `/admin/*` page load via `GET /api/auth/me`

## Non-Goals

- No changes to the token expiry duration
- No password hashing (plain-text comparison is acceptable for this single-admin use case)
- No multi-user or role-based access control
- No "remember me" or token refresh functionality
- No changes to the admin dashboard UI beyond the error messages on the login form

## Technical Considerations

- **`JwtAuthenticationFilter`** already handles extracting and validating the Bearer token — the `/api/auth/me` endpoint just needs to exist as a protected route; Spring Security + the filter will handle the 401 automatically for missing/invalid tokens
- **`SecurityConfig`** must NOT add `/api/auth/me` to the `permitAll` list
- When logging the loaded admin username in US-001, use `@Value("${admin.username}")` in `AuthService` and log at `INFO` level; never log the password
- For US-003 frontend error handling, update the `catch` block in `adminLogin()` in `frontend/lib/adminApi.ts` to re-throw with a typed error (or return a result object) so the login page can differentiate error types

## Success Metrics

- Admin can log in with `.env` credentials on first attempt, with no errors
- Refreshing any `/admin/*` page does not log the admin out
- `mvn test` passes with all new auth tests green

## Open Questions

- Should the startup credential log (US-001 debug step) be kept permanently or removed after verification? Recommend removing once the fix is confirmed, to keep logs clean.
- Is the `optional:` prefix intentional for resilience in production (where env vars come from the OS/container, not a file)? If so, it's correct behavior for prod — the fix is just ensuring the file path is right for local dev.
