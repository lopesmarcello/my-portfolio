# PRD: Load .env Vars via dotenv-java

## Introduction

The backend currently relies on Spring Boot's `spring.config.import=optional:file:.env`
mechanism to load secrets (`JWT_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`) from a `.env`
file. This approach has proven unreliable — the values are not consistently available to
`application.properties` placeholders at startup. A previous attempt using the `spring-dotenv`
library also did not resolve the issue.

This PRD replaces both approaches with the raw
[dotenv-java](https://github.com/cdimascio/dotenv-java) library, wired in as a Spring
`EnvironmentPostProcessor`. This runs before the Spring context is built, ensuring all three
secrets are present in the `Environment` when any bean (e.g. `JwtService`, `AuthService`) is
initialised.

---

## Goals

- Remove all `spring-dotenv` and `spring.config.import` remnants cleanly.
- Add `dotenv-java` and load `.env` as a Spring `EnvironmentPostProcessor`.
- If `.env` is absent, log a warning and fall back to system environment variables / `application.properties` defaults — do not crash.
- Confirm that `JWT_SECRET`, `ADMIN_USERNAME`, and `ADMIN_PASSWORD` reach `JwtService` and `AuthService` with the real values from `.env`.

---

## User Stories

### US-001: Clean up previous .env loading approaches

**Description:** As a developer, I want to remove the `spring-dotenv` dependency and the
`spring.config.import` line so there is exactly one mechanism responsible for loading `.env`.

**Acceptance Criteria:**

- [ ] `spring-dotenv` dependency removed from `pom.xml` (if present in the committed pom).
- [ ] `spring.config.import=optional:file:.env` line removed from `application.properties`.
- [ ] Any `DotEnvPostProcessor` or related class from the previous attempt is deleted.
- [ ] `mvn package -q` succeeds with no compilation errors.

---

### US-002: Add dotenv-java dependency

**Description:** As a developer, I need the `dotenv-java` library on the classpath so I can
use it to load `.env` at startup.

**Acceptance Criteria:**

- [ ] `io.github.cdimascio:dotenv-java` (latest stable version) added to `pom.xml`.
- [ ] `mvn dependency:resolve -q` resolves without errors.
- [ ] No other dependencies added or removed.

---

### US-003: Implement DotenvEnvironmentPostProcessor

**Description:** As a developer, I want an `EnvironmentPostProcessor` that uses dotenv-java to
load `.env` early in the Spring lifecycle, so all secrets are available before any bean is
created.

**Acceptance Criteria:**

- [ ] A new class `DotenvEnvironmentPostProcessor` is created in the `com.lopesmarcello.portfolio` package (or a `config` sub-package).
- [ ] It implements `org.springframework.boot.env.EnvironmentPostProcessor`.
- [ ] It uses `Dotenv.configure().ignoreIfMissing().load()` so startup does not fail when `.env` is absent.
- [ ] It iterates the dotenv entries and adds them to Spring's `Environment` via a `MapPropertySource` named `"dotenvFile"`, inserted at the **beginning** of the property sources list so it takes precedence over `application.properties` defaults but is overridden by real system environment variables.
- [ ] It is registered in `src/main/resources/META-INF/spring/org.springframework.boot.env.EnvironmentPostProcessor.imports` (Spring Boot 3+ SPI mechanism).
- [ ] When `.env` is missing, a `WARN` log line is printed: `".env file not found — falling back to system environment variables"`.
- [ ] `mvn package -q` succeeds.

> **Note on property source precedence:** By inserting `"dotenvFile"` at position 0 of
> `propertySources`, `.env` values win over `application.properties` defaults but real OS
> environment variables (which are added later by Spring at a higher priority) still override
> them. This is the standard dotenv contract.

---

### US-004: Verify end-to-end login with real credentials

**Description:** As a developer, I want to confirm that the login endpoint returns a valid JWT
when called with the credentials from `.env`, proving the full chain works.

**Acceptance Criteria:**

- [ ] Start the backend with `mvn spring-boot:run` (PostgreSQL must be running via `docker compose up -d`).
- [ ] The startup log shows `"Admin username loaded: <value-from-env>"` (not `"admin"`), confirming `AuthService` received the real value.
- [ ] `curl -s -X POST http://localhost:8080/api/auth/login -H 'Content-Type: application/json' -d '{"username":"<ADMIN_USERNAME>","password":"<ADMIN_PASSWORD>"}'` returns HTTP 200 with a `token` field.
- [ ] Using the default fallback (`"admin"` / `"admin"`) when `.env` is present with real values does **not** succeed — confirming the real credentials are in use.

---

## Functional Requirements

- **FR-1:** Remove `spring.config.import=optional:file:.env` from `application.properties`.
- **FR-2:** Remove `spring-dotenv` dependency from `pom.xml` if it exists.
- **FR-3:** Add `io.github.cdimascio:dotenv-java` (latest stable) to `pom.xml`.
- **FR-4:** Create `DotenvEnvironmentPostProcessor` that loads `.env` via `Dotenv.configure().ignoreIfMissing().load()` and registers entries as a Spring `MapPropertySource`.
- **FR-5:** Register the processor in `META-INF/spring/org.springframework.boot.env.EnvironmentPostProcessor.imports`.
- **FR-6:** If `.env` is missing, log a `WARN` and continue — do not throw an exception.
- **FR-7:** `JWT_SECRET`, `ADMIN_USERNAME`, and `ADMIN_PASSWORD` from `.env` must be resolvable via `${JWT_SECRET}`, `${ADMIN_USERNAME}`, `${ADMIN_PASSWORD}` in `application.properties` (which feeds `${jwt.secret}`, `${admin.username}`, `${admin.password}`).

---

## Non-Goals

- No changes to how the frontend reads env vars.
- No changes to database connection credentials (those are hardcoded in `application.properties` and are not secrets requiring `.env`).
- No support for multiple `.env` profiles (`.env.local`, `.env.test`, etc.).
- No Docker/production deployment changes.

---

## Technical Considerations

- **Spring Boot SPI file location:** `src/main/resources/META-INF/spring/org.springframework.boot.env.EnvironmentPostProcessor.imports` — one fully-qualified class name per line.
- **Property key consistency:** `application.properties` uses `${ADMIN_USERNAME:admin}` to populate `admin.username`. `AuthService` currently reads `@Value("${adminUsername}")` which is a different key — verify this resolves correctly or fix to `@Value("${admin.username}")` during this work.
- **Dotenv-java version:** Check [Maven Central](https://central.sonatype.com/artifact/io.github.cdimascio/dotenv-java) for the latest stable version at implementation time.
- **`.env` file location:** dotenv-java defaults to the current working directory, which when running via `mvn spring-boot:run` from `backend-java/portfolio/` is `backend-java/portfolio/`. The `.env` file already lives there.

---

## Success Metrics

- `mvn package -q` compiles and all tests pass with no `spring-dotenv` on the classpath.
- Login endpoint returns a real JWT when using credentials from `.env`.
- Startup log confirms real admin username (not the `"admin"` default) was loaded.

---

## Open Questions

- Should the `DotenvEnvironmentPostProcessor` also log the names (not values) of the variables it loaded, to aid debugging? (Lean yes — a single `DEBUG` line listing key names.)
- Is there a requirement to support a custom `.env` path (e.g. via a system property `dotenv.path`)? Currently assumed no.
