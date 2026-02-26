# Portfolio

A full-stack personal portfolio with a Next.js frontend and Spring Boot backend. All content (about, resume, blog posts) is served dynamically from the backend API.

## Table of Contents

- [Quick Start](#quick-start)
- [Prerequisites](#prerequisites)
- [Frontend Setup](#frontend-setup)
- [Backend Setup](#backend-setup)
- [Database Setup](#database-setup)
- [Environment Configuration](#environment-configuration)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

For experienced developers:

```bash
# 1. Start the database
docker compose up -d

# 2. Start the backend (from backend-java/portfolio/)
./mvnw spring-boot:run

# 3. Start the frontend (from frontend/)
pnpm install && pnpm dev
```

Frontend runs on http://localhost:3000, backend API on http://localhost:8080/api.

---

## Prerequisites

Install the following tools before setting up the project.

### Node.js (v20+)

Required for running the Next.js frontend.

- **Download:** https://nodejs.org/en/download
- **Verify:** `node --version` → should print `v20.x.x` or higher

### pnpm (v9+)

Package manager for the frontend.

- **Install:** `npm install -g pnpm`
- **Docs:** https://pnpm.io/installation
- **Verify:** `pnpm --version`

### Java 17 (JDK)

Required for the Spring Boot backend.

- **Download:** https://adoptium.net/temurin/releases/?version=17 (Eclipse Temurin recommended)
- **macOS (Homebrew):** `brew install temurin@17`
- **Verify:** `java --version` → should print `openjdk 17.x.x` or similar

### Maven (included via wrapper)

The backend includes a Maven wrapper (`./mvnw`) — no separate Maven installation is required. However, if you want Maven globally:

- **Download:** https://maven.apache.org/download.cgi
- **Verify:** `mvn --version`

### Docker (with Docker Compose)

Required to run PostgreSQL locally.

- **Download:** https://www.docker.com/products/docker-desktop
- **Verify:** `docker --version` and `docker compose version`

### PostgreSQL 16 (via Docker)

The database runs inside Docker — no manual PostgreSQL installation required. Docker Compose handles this automatically (see [Database Setup](#database-setup)).

---

## Frontend Setup

The frontend is a Next.js 16 app located in `frontend/`.

### Install dependencies

```bash
cd frontend
pnpm install
```

### Run the development server

```bash
pnpm dev
```

The dev server starts on **http://localhost:3000** with hot-reload enabled.

### Available scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server on :3000 |
| `pnpm build` | Create production build |
| `pnpm start` | Start production server (requires build first) |
| `pnpm lint` | Run ESLint |

---

## Backend Setup

The backend is a Spring Boot 4 app located in `backend-java/portfolio/`. It uses the included Maven wrapper, so no system-wide Maven install is needed.

### Run the application

```bash
cd backend-java/portfolio
./mvnw spring-boot:run
```

The API starts on **http://localhost:8080/api**.

### Available Maven commands

| Command | Description |
|---------|-------------|
| `./mvnw spring-boot:run` | Start the API server |
| `./mvnw test` | Run unit tests |
| `./mvnw package` | Build executable JAR |
| `./mvnw clean` | Clean build artifacts |
| `./mvnw package -DskipTests` | Build JAR without running tests |

> **Windows:** Use `mvnw.cmd` instead of `./mvnw`.

---

## Database Setup

PostgreSQL 16 runs in Docker. The `docker-compose.yml` at the project root manages it.

### Start PostgreSQL

```bash
docker compose up -d
```

This starts a `postgres:16` container named `portfolio_postgres` on port `5432`.

### Database connection settings

| Setting | Value |
|---------|-------|
| Host | `localhost` |
| Port | `5432` |
| Database | `portfolio` |
| Username | `portfolio` |
| Password | `portfolio` |

JDBC URL: `jdbc:postgresql://localhost:5432/portfolio`

### Schema migrations

The backend uses Spring JPA with `ddl-auto=update`, which automatically creates and updates tables on startup. No manual migration step is needed for development.

> If you're looking at Flyway migration files, they live in `backend-java/portfolio/src/main/resources/db/migration/`.

### Reset the database

To wipe and recreate the database:

```bash
docker compose down -v   # removes the postgres_data volume
docker compose up -d     # starts fresh
```

---

## Environment Configuration

### Frontend (`frontend/.env.local`)

Create `frontend/.env.local` if it doesn't exist:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

This is the only required variable. It defaults to `http://localhost:8080/api` when not set.

### Backend (`backend-java/portfolio/.env` or environment variables)

The backend reads configuration from `application.properties` with environment variable overrides. For local development, defaults work out of the box.

For production or custom setups, create a `.env` file in `backend-java/portfolio/` or set these environment variables:

```env
# Database (defaults work with docker compose)
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/portfolio
SPRING_DATASOURCE_USERNAME=portfolio
SPRING_DATASOURCE_PASSWORD=portfolio

# JWT (generate a strong secret for production — min 32 chars)
JWT_SECRET=dev-only-secret-key-minimum-32-chars-x

# Admin credentials (change for production)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin
```

> **Security:** Never commit real JWT secrets or admin passwords. The defaults are safe for local development only.

---

## Verification

Confirm everything is running correctly.

### Verify the database

```bash
docker compose ps
# Should show portfolio_postgres as "running"

docker exec portfolio_postgres psql -U portfolio -c "\l"
# Should list the "portfolio" database
```

### Verify the backend

```bash
curl http://localhost:8080/api/about/
# Should return JSON with about data (or empty array on fresh DB)
```

Or open http://localhost:8080/actuator/health in your browser — should return `{"status":"UP"}`.

### Verify the frontend

Open http://localhost:3000 in your browser. The home page should load (it may show empty content on a fresh database — that's expected).

### Verify API connectivity from the frontend

Open your browser's DevTools (F12) → Network tab, reload the page, and confirm requests to `localhost:8080/api/...` return `200 OK`.

### Test API endpoints directly

```bash
curl http://localhost:8080/api/about/
curl http://localhost:8080/api/resume/
curl http://localhost:8080/api/posts/
```

All should return `200 OK` with JSON (empty arrays are fine on a new database).

---

## Troubleshooting

### Port 3000 already in use

```bash
# Find the process using port 3000
lsof -i :3000        # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill it, then re-run pnpm dev
kill -9 <PID>
```

Alternatively, run the frontend on a different port: `pnpm dev -- --port 3001`

### Port 8080 already in use

Another application is using port 8080. Find and stop it:

```bash
lsof -i :8080        # macOS/Linux
```

Or change the backend port in `application.properties`: `server.port=8081`

### Port 5432 already in use

A local PostgreSQL instance may be running. Either stop it or change the Docker port mapping in `docker-compose.yml`:

```yaml
ports:
  - "5433:5432"  # use 5433 on host
```

Then update `SPRING_DATASOURCE_URL` to use port `5433`.

### Database connection failure

1. Confirm Docker is running: `docker compose ps`
2. Check container logs: `docker compose logs postgres`
3. Confirm the port mapping: `docker port portfolio_postgres`
4. Try connecting manually: `docker exec -it portfolio_postgres psql -U portfolio`

### Frontend cannot reach the backend

1. Confirm the backend is running on port 8080
2. Check `frontend/.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:8080/api`
3. Restart the Next.js dev server after changing `.env.local`

### Maven wrapper permission denied (macOS/Linux)

```bash
chmod +x backend-java/portfolio/mvnw
```

### Clean and rebuild

**Frontend:**

```bash
cd frontend
rm -rf .next node_modules
pnpm install
pnpm dev
```

**Backend:**

```bash
cd backend-java/portfolio
./mvnw clean package
./mvnw spring-boot:run
```

**Database:**

```bash
docker compose down -v
docker compose up -d
```
