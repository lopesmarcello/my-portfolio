# PRD: Admin CMS Panel

## Introduction

Add a hidden `/admin` route to the portfolio frontend that acts as a private CMS. The admin can log in with credentials stored in environment variables and manage all site content (About, Resume/Experiences, Blog Posts) through a full-featured UI with a rich text editor, drag-and-drop reordering, and image upload. All write endpoints on the backend must be secured with JWT authentication. The route is not linked anywhere on the public site.

---

## Goals

- Secure all mutating backend endpoints (POST, PUT, PATCH, DELETE) behind JWT auth
- Provide a private `/admin` login page accessible only by direct URL
- Deliver a clean admin dashboard with sidebar navigation for managing all content sections
- Support rich text editing for blog posts (TipTap editor)
- Support drag-and-drop reordering for technologies and experiences
- Support image upload for blog post header images
- Keep all GET endpoints public so the public site continues to function without auth

---

## User Stories

### US-001: Add Spring Security + JWT dependencies to backend

**Description:** As a developer, I need the backend to have Spring Security and JWT libraries configured so I can protect write endpoints.

**Acceptance Criteria:**

- [ ] Add to `pom.xml`:
  - `spring-boot-starter-security`
  - `io.jsonwebtoken:jjwt-api:0.12.x`
  - `io.jsonwebtoken:jjwt-impl:0.12.x` (runtime)
  - `io.jsonwebtoken:jjwt-jackson:0.12.x` (runtime)
- [ ] Application starts successfully after adding dependencies
- [ ] No existing tests break from adding Spring Security defaults

---

### US-002: Create JWT utility service

**Description:** As a developer, I need a JWT utility class to generate and validate tokens so auth can be stateless.

**Acceptance Criteria:**

- [ ] `JwtService.java` (or similar) exists with methods:
  - `generateToken(String username): String` — creates a signed JWT with a configurable expiry (e.g., 24h)
  - `extractUsername(String token): String` — decodes the username claim
  - `isTokenValid(String token): boolean` — returns false if expired or tampered
- [ ] JWT secret is read from environment variable `JWT_SECRET` via `application.properties`
- [ ] JWT expiry is configurable via `application.properties` (default 86400000ms = 24h)
- [ ] Application fails to start if `JWT_SECRET` is not set

---

### US-003: Create authentication endpoints

**Description:** As the admin, I want to log in with my credentials and receive a JWT so I can make authenticated requests.

**Acceptance Criteria:**

- [ ] `POST /api/auth/login` accepts `{ "username": "...", "password": "..." }` JSON body
- [ ] Credentials are validated against environment variables `ADMIN_USERNAME` and `ADMIN_PASSWORD`
- [ ] On success: returns `200 OK` and sets an `httpOnly`, `SameSite=Strict`, `Secure` cookie named `admin_token` containing the JWT
- [ ] On failure: returns `401 Unauthorized` with `{ "error": "Invalid credentials" }`
- [ ] `POST /api/auth/logout` clears the `admin_token` cookie and returns `200 OK`
- [ ] `GET /api/auth/me` returns `200 OK` with `{ "username": "admin" }` if the token is valid, or `401` if not
- [ ] Application fails to start if `ADMIN_USERNAME` or `ADMIN_PASSWORD` is not set

---

### US-004: Create JWT authentication filter and Security configuration

**Description:** As a developer, I need Spring Security configured to protect all write endpoints while keeping GET endpoints public.

**Acceptance Criteria:**

- [ ] `JwtAuthenticationFilter.java` extends `OncePerRequestFilter`:
  - Reads JWT from the `admin_token` httpOnly cookie on every request
  - If valid: sets the `SecurityContext` with the authenticated admin user
  - If missing or invalid: does nothing (request proceeds unauthenticated)
- [ ] `SecurityConfig.java` defines a `SecurityFilterChain` bean:
  - **Public (no auth required):** `GET /api/about/**`, `GET /api/resume/**`, `GET /api/posts/**`, `GET /api/auth/**`, `POST /api/auth/login`
  - **Protected (requires valid JWT):** All `POST`, `PUT`, `PATCH`, `DELETE` on `/api/**`
  - CSRF is disabled (stateless JWT API)
  - Session management set to `STATELESS`
- [ ] Accessing a protected endpoint without a valid token returns `401 Unauthorized`
- [ ] Existing GET endpoints still work without any token
- [ ] CORS configuration is updated to allow credentials (`allowCredentials(true)`) for `localhost:3000` and `localhost:3001`

---

### US-005: Add `displayOrder` field to Experience entity

**Description:** As a developer, I need experiences to have an explicit order field so drag-and-drop reordering can be persisted.

**Acceptance Criteria:**

- [ ] `Experience` entity has a new `displayOrder` integer field (default 0)
- [ ] `PUT /api/resume/experiences/reorder` accepts `[{ "id": 1, "displayOrder": 0 }, ...]` and bulk-updates order
- [ ] `GET /api/resume/` returns experiences sorted by `displayOrder` ascending
- [ ] Existing experiences get `displayOrder` values assigned based on their current DB order (e.g., via migration or schema update)

---

### US-006: Add image upload endpoint for blog post headers

**Description:** As the admin, I want to upload an image file for a blog post's header image so I don't have to manage external URLs manually.

**Acceptance Criteria:**

- [ ] `POST /api/posts/images` accepts `multipart/form-data` with a file field named `image`
- [ ] Endpoint is protected (requires valid JWT)
- [ ] Uploaded files are stored in a configured directory (e.g., `uploads/` relative to working dir, configurable via `app.upload-dir` in `application.properties`)
- [ ] Returns `{ "url": "/uploads/filename.jpg" }` on success
- [ ] `GET /uploads/**` is served as static resources (publicly accessible, no auth required)
- [ ] File size limit of 10MB enforced; returns `400` if exceeded
- [ ] Only image MIME types accepted (jpeg, png, gif, webp); returns `400` otherwise

---

### US-007: Add admin API functions and auth utilities to frontend

**Description:** As a developer, I need frontend API helpers that include JWT cookies in requests and cover all admin mutations so admin pages can call the backend securely.

**Acceptance Criteria:**

- [ ] New file `frontend/lib/admin-api.ts` created with:
  - `login(username, password): Promise<void>` — POST /api/auth/login with `credentials: 'include'`
  - `logout(): Promise<void>` — POST /api/auth/logout with `credentials: 'include'`
  - `getMe(): Promise<{ username: string }>` — GET /api/auth/me with `credentials: 'include'`
  - All about mutation functions: `updateAbout`, `addTechnology`, `updateTechnology`, `deleteTechnology`, `addLink`, `updateLink`, `deleteLink`
  - All resume mutation functions: `updateResume`, `addExperience`, `updateExperience`, `deleteExperience`, `reorderExperiences`, `updateResumeLink`
  - All post mutation functions: `createPost`, `updatePost`, `deletePost`
  - `uploadImage(file: File): Promise<{ url: string }>` — POST /api/posts/images
- [ ] All functions use `credentials: 'include'` so cookies are sent automatically
- [ ] All functions throw a typed error if the response is `401` (for the middleware to catch)
- [ ] TypeScript compiles without errors

---

### US-008: Create Next.js middleware to protect admin routes

**Description:** As a developer, I need Next.js middleware that redirects unauthenticated visitors away from `/admin/*` so the admin panel is never accessible without a valid session.

**Acceptance Criteria:**

- [ ] `frontend/middleware.ts` created at the root of the Next.js app
- [ ] Matches all paths starting with `/admin` except `/admin/login`
- [ ] For protected admin paths: calls `GET /api/auth/me` server-side; if `401`, redirects to `/admin/login`
- [ ] For `/admin/login`: if already authenticated (`/me` returns `200`), redirects to `/admin/dashboard`
- [ ] No infinite redirect loops between `/admin/login` and `/admin/*`
- [ ] TypeScript compiles without errors

---

### US-009: Create admin layout (no public Header/Footer)

**Description:** As the admin, I want a dedicated admin shell with a sidebar so I can navigate between content sections without the public site chrome.

**Acceptance Criteria:**

- [ ] `frontend/app/admin/layout.tsx` created with its own layout (does NOT include the public `<Header>` or `<Footer>`)
- [ ] Sidebar contains navigation links to:
  - Dashboard (`/admin/dashboard`)
  - About (`/admin/about`)
  - Resume (`/admin/resume`)
  - Blog Posts (`/admin/posts`)
- [ ] Active link is visually highlighted
- [ ] "Logout" button in sidebar calls the logout API and redirects to `/admin/login`
- [ ] Layout is responsive (sidebar collapses to top nav on mobile)
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

### US-010: Create admin login page

**Description:** As the admin, I want a login page at `/admin/login` so I can authenticate and access the CMS.

**Acceptance Criteria:**

- [ ] Page at `frontend/app/admin/login/page.tsx`
- [ ] Form with username and password fields + submit button
- [ ] On submit: calls `login(username, password)` from `admin-api.ts`
- [ ] On success: redirects to `/admin/dashboard`
- [ ] On failure: displays a clear error message ("Invalid credentials")
- [ ] Submit button shows a loading state while the request is in flight
- [ ] Password field is type `password` (masked input)
- [ ] Page is NOT wrapped in the admin sidebar layout (login has its own minimal layout)
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

### US-011: Create admin dashboard home page

**Description:** As the admin, I want a simple dashboard landing page so I have a home base after logging in.

**Acceptance Criteria:**

- [ ] Page at `frontend/app/admin/dashboard/page.tsx`
- [ ] Displays a welcome message and quick-link cards to About, Resume, and Posts sections
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

### US-012: Create admin About management page

**Description:** As the admin, I want to edit my About section content so my portfolio bio, tech stack, and social links stay current.

**Acceptance Criteria:**

- [ ] Page at `frontend/app/admin/about/page.tsx`
- [ ] Loads current About data from `GET /api/about/` on mount
- [ ] Editable fields: `name`, `title`, `description`, `aboutText` (plain text areas)
- [ ] "Save About" button calls `updateAbout` and shows a success toast on completion
- [ ] Technologies section:
  - [ ] Lists all current technologies with `name` and `imageUrl` fields editable inline
  - [ ] "Add Technology" button appends a new blank row
  - [ ] Each row has a "Delete" button that calls `deleteTechnology`
  - [ ] Changes saved with a "Save Technologies" button
- [ ] Links section:
  - [ ] Lists all current links with `label` and `url` fields editable inline
  - [ ] "Add Link" button appends a new blank row
  - [ ] Each row has a "Delete" button that calls `deleteLink`
  - [ ] Changes saved with a "Save Links" button
- [ ] Loading and error states handled
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

### US-013: Create admin Resume management page

**Description:** As the admin, I want to edit my resume data and reorder experiences with drag-and-drop so my CV page stays accurate.

**Acceptance Criteria:**

- [ ] Page at `frontend/app/admin/resume/page.tsx`
- [ ] Loads current Resume data on mount
- [ ] Editable fields: `fullName`, `title`, `email`, `phone`, `about` (plain text areas)
- [ ] Resume links: editable `label` and `url` fields with save button
- [ ] "Save Resume" button calls `updateResume` and shows a success toast
- [ ] Experiences section:
  - [ ] Each experience shows `companyName`, `description` (textarea), `startDate`, `endDate` fields
  - [ ] Experiences list is drag-and-drop reorderable using `@dnd-kit/core`
  - [ ] Dragging and dropping reorders the list visually; releasing calls `reorderExperiences` to persist the new order
  - [ ] "Add Experience" button appends a blank experience form
  - [ ] Each experience has a "Delete" button (with a confirmation dialog before deleting)
  - [ ] "Save Experience" button per row calls `updateExperience`
- [ ] Loading and error states handled
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

### US-014: Create admin Blog Posts list page

**Description:** As the admin, I want to see all my blog posts in a list so I can manage, edit, or delete them.

**Acceptance Criteria:**

- [ ] Page at `frontend/app/admin/posts/page.tsx`
- [ ] Lists all posts with `title`, `createdAt`, and action buttons: "Edit" and "Delete"
- [ ] "New Post" button links to `/admin/posts/new`
- [ ] "Edit" button links to `/admin/posts/[id]/edit`
- [ ] "Delete" button shows a confirmation dialog before calling `deletePost`; removes the post from the list on success
- [ ] Empty state shown when no posts exist
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

### US-015: Create admin Blog Post editor with rich text

**Description:** As the admin, I want a rich text editor for blog posts so I can write formatted content without knowing HTML.

**Acceptance Criteria:**

- [ ] Pages at:
  - `frontend/app/admin/posts/new/page.tsx` — create new post
  - `frontend/app/admin/posts/[id]/edit/page.tsx` — edit existing post
- [ ] TipTap editor (`@tiptap/react` + `@tiptap/starter-kit`) used for the `content` field
- [ ] Editor toolbar includes: Bold, Italic, Underline, Strikethrough, Headings (H1–H3), Bullet List, Ordered List, Blockquote, Code Block, Horizontal Rule, Undo/Redo
- [ ] `title` is a plain text input above the editor
- [ ] Header image section (see US-016 for image upload)
- [ ] "Publish" / "Save" button:
  - On new post: calls `createPost` then redirects to `/admin/posts`
  - On edit: calls `updatePost` then redirects to `/admin/posts`
- [ ] "Cancel" button returns to `/admin/posts` without saving
- [ ] On edit page: existing data pre-populated in all fields
- [ ] Loading state while saving
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

### US-016: Add image upload UI for blog post header images

**Description:** As the admin, I want to upload an image file directly in the post editor so I can set a header image without managing URLs externally.

**Acceptance Criteria:**

- [ ] Image upload component in the post editor (used in US-015)
- [ ] "Upload Header Image" button opens a file picker (accepts image/*)
- [ ] On file selection: calls `uploadImage(file)`, shows a loading indicator during upload
- [ ] On success: displays a preview of the uploaded image and sets the `headerImageUrl` field to the returned URL
- [ ] If `headerImageUrl` already set (edit mode): current image is shown with an option to replace it
- [ ] On upload error: shows error message (e.g., "File too large" or "Invalid file type")
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

### US-017: Add drag-and-drop reordering for Technologies

**Description:** As the admin, I want to reorder my technologies list via drag-and-drop so the most relevant skills appear first on my portfolio.

**Acceptance Criteria:**

- [ ] Technologies list in the About page (US-012) is drag-and-drop reorderable using `@dnd-kit/core`
- [ ] Dragging a technology card reorders the list visually
- [ ] Dropping persists the new order — the "Save Technologies" button sends the reordered list
- [ ] Drag handle icon visible on each technology row
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

## Functional Requirements

- **FR-1:** `POST /api/auth/login` validates `ADMIN_USERNAME` and `ADMIN_PASSWORD` from env and sets an httpOnly, SameSite=Strict JWT cookie on success.
- **FR-2:** All `POST`, `PUT`, `PATCH`, `DELETE` endpoints under `/api/**` require a valid JWT in the `admin_token` cookie; return `401` otherwise.
- **FR-3:** All `GET` endpoints remain public and do not require authentication.
- **FR-4:** The JWT secret (`JWT_SECRET`) is never committed to source control; it is read only from environment variables.
- **FR-5:** The frontend `/admin/*` routes (except `/admin/login`) redirect to `/admin/login` if the user is not authenticated.
- **FR-6:** The `/admin` route and all its subroutes are not linked from any public page, header, footer, or sitemap.
- **FR-7:** The TipTap editor stores content as HTML string, which is what the `content` field on `Post` already stores.
- **FR-8:** Image uploads are stored server-side and served as static files; the URL returned is stored in `headerImageUrl`.
- **FR-9:** Experience ordering is persisted via a `displayOrder` integer field; `GET /api/resume/` returns experiences sorted by `displayOrder` asc.
- **FR-10:** Admin credentials are single-user only — no registration flow, no DB user records.

---

## Non-Goals

- No multi-user admin or role-based access control
- No admin account creation, password reset, or email verification UI
- No public user authentication (only the admin panel is auth-gated)
- No audit log of admin changes
- No multi-factor authentication
- No automatic image resizing or CDN integration
- No scheduled publishing or draft/publish states for posts
- No sitemap or SEO auto-generation
- No `/robots.txt` changes (the route is hidden by obscurity + auth, not robots)

---

## Design Considerations

- Admin layout must use a completely separate layout file (`app/admin/layout.tsx`) that does NOT import the public `<Header>` or `<Footer>` components.
- The admin UI should be clean and functional — dark sidebar with white content area is a natural fit given the existing dark-mode support.
- Reuse existing shadcn/ui components (Button, Input, Textarea, Dialog for confirmations, Toast for success/error feedback) wherever possible.
- TipTap editor should be wrapped in a shared component (`components/admin/RichTextEditor.tsx`) for reuse between create and edit pages.
- Image upload component should be a shared component (`components/admin/ImageUpload.tsx`).
- Drag-and-drop uses `@dnd-kit/core` and `@dnd-kit/sortable` (already popular in the Next.js ecosystem, TypeScript-friendly).

---

## Technical Considerations

### Backend

- **Spring Security 6** (included with Spring Boot 4): use `SecurityFilterChain` bean pattern, not `WebSecurityConfigurerAdapter` (deprecated).
- **jjwt 0.12.x**: use `Jwts.builder()` / `Jwts.parserBuilder()` API; ensure the secret is at least 256 bits for HS256.
- **Cookie security**: set `Secure=true` in production. For local dev, `Secure=false` is acceptable (localhost). Use a profile-based property: `app.cookie.secure=true` in prod, `false` in dev.
- **CORS**: must add `allowCredentials(true)` to the existing CORS config, otherwise cookies won't be sent cross-origin from the Next.js dev server.
- **File uploads**: configure `spring.servlet.multipart.max-file-size=10MB` and `spring.servlet.multipart.max-request-size=10MB` in `application.properties`.
- **Static file serving**: configure Spring MVC to serve `/uploads/**` from the upload directory using `ResourceHandlerRegistry`.

### Frontend

- **Next.js Middleware** runs on the Edge Runtime — it cannot use Node.js APIs. The `/api/auth/me` call in middleware must use the native `fetch` API with `credentials: 'include'` and forward the incoming cookie header.
- **No auth state stored in React context** — the source of truth is the httpOnly cookie. After login, pages call `/api/auth/me` to confirm session validity if needed.
- **TipTap**: install `@tiptap/react`, `@tiptap/starter-kit`, and any extension packages used for the toolbar. Render the stored HTML content on the public blog page using `dangerouslySetInnerHTML` with proper sanitization (use `DOMPurify` on the client).
- **Environment variables**: `NEXT_PUBLIC_API_URL` already exists. Ensure the backend URL is correct in `.env.local` for local dev.

---

## Success Metrics

- Admin can log in, make changes to all content sections, and log out in one browser session with no page errors
- All `POST/PUT/PATCH/DELETE` backend endpoints return `401` when called without a valid cookie
- No links or references to `/admin` exist anywhere in the public-facing pages
- Rich text content created in TipTap renders correctly on the public `/content/[id]` page
- Drag-and-drop reordering of experiences and technologies persists after page reload

---

## Open Questions

- Should `Secure=true` on the cookie be enforced via environment variable so the developer can run locally over HTTP without issues?
- Should uploaded images be stored in the backend `uploads/` directory (simplest, but lost on container restart without a volume) or should we plan for an S3/object storage integration from the start?
- The existing `PATCH /api/posts/{id}` endpoint does a partial update — should the admin editor always send a full `PUT` instead to avoid partial-state bugs?
- Should the public blog post page sanitize HTML (using DOMPurify) to prevent XSS from the stored TipTap content, or is admin-only input trusted?
