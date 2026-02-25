# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack personal portfolio with a Next.js frontend and Spring Boot backend. All content (about, resume, blog posts) is served dynamically from the backend API.

## Commands

### Frontend (run from `frontend/`)

```bash
pnpm dev        # Dev server on :3000
pnpm build      # Production build
pnpm start      # Start production server
pnpm lint       # ESLint
```

### Backend (run from `backend-java/portfolio/`)

```bash
mvn spring-boot:run   # Start API server on :8080
mvn test              # Run tests
mvn package           # Build JAR
```

### Infrastructure

```bash
docker compose up -d  # Start PostgreSQL on :5432
```

## Architecture

### Frontend (`frontend/`)

Next.js 16 App Router with TypeScript. Pages are under `app/` with a nested layout pattern:
- `/` — Home (hero, tech stack, about data)
- `/curriculum` — Resume/CV
- `/content` — Blog listing
- `/content/[id]` — Single post

All backend data is fetched via `lib/api.ts`, which exports typed fetch wrappers for each endpoint. This is the single integration point — add new API calls here.

Styling uses Tailwind CSS v4 (PostCSS plugin) + shadcn UI components. The `LiquidEther.jsx` component renders a Three.js/GSAP animated background on the home page.

### Backend (`backend-java/portfolio/`)

Spring Boot 4 with a standard layered architecture: `Controller → Service → Repository → Entity`. Each domain (About, Resume, Posts) has its own controller, service, JPA repository, entity, DTOs, and mapper.

API base: `http://localhost:8080/api`
- `GET /api/about/`
- `GET /api/resume/`
- `GET /api/posts/`
- `GET /api/posts/{id}`

### Environment

Frontend reads `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:8080/api` via `.env.local`). The backend connects to PostgreSQL at `localhost:5432/portfolio` (credentials: `portfolio/portfolio`).

## Key Tech

- **Frontend:** Next.js 16, React 19, TypeScript 5 (strict), Tailwind CSS v4, shadcn UI, Three.js, GSAP
- **Backend:** Java 17, Spring Boot 4, Spring Data JPA, PostgreSQL 16, Lombok, SpringDoc OpenAPI
- **Build tools:** pnpm (frontend), Maven (backend)
