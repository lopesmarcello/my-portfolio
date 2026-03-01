# PRD: Flyway Migration Management

## Introduction

Introduce Flyway to manage the portfolio database schema through versioned SQL migration files. Currently, the project relies on Hibernate's `ddl-auto=update`, which silently skips column type changes on existing tables (e.g., the recent VARCHAR→TEXT change on `resume.about` was not applied to existing databases). Flyway will give us a single source of truth for schema state and a repeatable, safe upgrade path across environments.

## Goals

- Replace `ddl-auto=update` with `ddl-auto=validate` so Hibernate only checks the schema, never silently mutates it
- Add a V1 baseline migration capturing the complete current schema
- Add a V2 migration applying the `resume.about` VARCHAR(255) → TEXT change
- Keep the setup flexible for both fresh and pre-existing databases via `baselineOnMigrate=true`

## User Stories

### US-001: Add Flyway dependency and configuration

**Description:** As a developer, I want Flyway integrated into the Spring Boot app so that schema migrations run automatically on startup.

**Acceptance Criteria:**

- [ ] `flyway-core` added to `pom.xml` (Spring Boot manages version via BOM)
- [ ] `application.properties` updated:
  - `spring.jpa.hibernate.ddl-auto=validate`
  - `spring.flyway.baseline-on-migrate=true`
  - `spring.flyway.baseline-version=0`
- [ ] App starts without error against a fresh database
- [ ] App starts without error against the existing dev database (baseline-on-migrate handles pre-existing tables)

---

### US-002: Write V1 baseline migration (full schema)

**Description:** As a developer, I want a SQL file that defines the complete current schema so any environment can be built from scratch using migrations alone.

**Acceptance Criteria:**

- [ ] File created at `src/main/resources/db/migration/V1__baseline_schema.sql`
- [ ] File creates all tables: `about`, `about_technologies`, `about_links`, `resume`, `resume_links`, `experience`, `post`
- [ ] All primary keys, foreign keys, and column types match the current Hibernate-generated schema
- [ ] `resume.about` is declared as `TEXT` (the intended final state, not VARCHAR(255))
- [ ] Running the migration against a fresh DB produces a schema that Hibernate validates without error

---

### US-003: Write V2 migration for resume.about column type change

**Description:** As a developer, I want a migration that alters the existing `resume.about` column from VARCHAR(255) to TEXT so pre-existing databases get the fix applied automatically.

**Acceptance Criteria:**

- [ ] File created at `src/main/resources/db/migration/V2__alter_resume_about_to_text.sql`
- [ ] File contains: `ALTER TABLE resume ALTER COLUMN about TYPE TEXT;`
- [ ] On a database where `about` is already TEXT (e.g., freshly created by V1), the migration is a no-op (PostgreSQL allows `ALTER COLUMN ... TYPE TEXT` even if it's already TEXT)
- [ ] App starts and Hibernate validates successfully after V2 runs

---

### US-004: Validate full migration chain

**Description:** As a developer, I want confidence that the migration chain works end-to-end so we don't discover broken migrations in production.

**Acceptance Criteria:**

- [ ] Fresh DB: `docker compose down -v && docker compose up -d`, then `mvn spring-boot:run` — Flyway runs V1 + V2, Hibernate validates, app starts
- [ ] Pre-existing DB: `mvn spring-boot:run` against current dev DB — Flyway baselines at V0, then runs V2, Hibernate validates, app starts
- [ ] `flyway_schema_history` table exists in the database after startup
- [ ] No Hibernate `SchemaManagementException` or Flyway `FlywayException` in logs

---

## Functional Requirements

- **FR-1:** Add `org.flywaydb:flyway-core` to Maven dependencies (no version needed — Spring Boot BOM manages it). Also add `org.flywaydb:flyway-database-postgresql` for PostgreSQL support (required for Flyway 10+).
- **FR-2:** Set `spring.jpa.hibernate.ddl-auto=validate` in `application.properties`.
- **FR-3:** Set `spring.flyway.baseline-on-migrate=true` and `spring.flyway.baseline-version=0` so Flyway safely handles existing databases without a prior `flyway_schema_history` table.
- **FR-4:** Place all migration files under `src/main/resources/db/migration/` following the naming convention `V{version}__{description}.sql`.
- **FR-5:** V1 must be a complete schema baseline — it must be safe to run on a blank database and produce a fully working schema.
- **FR-6:** V2 must only contain the `ALTER TABLE` statement for `resume.about`.

## Non-Goals

- No Flyway repair or undo commands
- No Java-based migrations (SQL only)
- No separate migration configs per environment (dev/prod use the same files)
- No data seeding via migrations
- No CI pipeline changes

## Technical Considerations

- **Flyway 10+ requires** a separate `flyway-database-postgresql` artifact in addition to `flyway-core` — both must be in `pom.xml`.
- **`baseline-on-migrate=true`** tells Flyway: "if the schema history table doesn't exist but the DB has tables, mark everything up to `baseline-version` as already applied." With `baseline-version=0`, V1 and V2 will still run on pre-existing databases. This is intentional — V2 is idempotent on PostgreSQL.
- **`ddl-auto=validate`** will throw at startup if the live schema doesn't match the entity mappings. This is the desired behavior — it catches drift early rather than silently patching it.
- The `experience` table uses a `resume_id` foreign key — the baseline migration must create `resume` before `experience`.
- Hibernate maps `about_text` (Java `aboutText`) as `about_text` in SQL (snake_case by default).

## Success Metrics

- Zero Flyway or Hibernate errors on both fresh and pre-existing databases
- All migration files checked into version control
- Any future schema change requires a new versioned `.sql` file

## Open Questions

- Should `flyway.locations` be explicitly set, or rely on the Spring Boot default (`classpath:db/migration`)? Default is fine unless we add test-only migrations later.
