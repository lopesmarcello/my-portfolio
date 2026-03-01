# PRD: Admin Dark Mode, Toast Notifications & Post-Action Navigation

## Introduction

Improve the admin panel's UX with three complementary enhancements:

1. **Dark mode** — the admin UI follows the OS color scheme by default, with a manual toggle that saves the user's override preference.
2. **Toast notifications** — replace the current inline success/error alerts with floating toast messages using `sonner`, covering all CRUD operations across About, Resume, and Posts.
3. **Post-action navigation** — after a successful save, full-page forms (Posts new/edit) redirect the user back to the post list, while inline edit sections (About/Resume) collapse back to read-only view.

These changes affect the admin panel only (`/admin/*`). The public-facing portfolio site is untouched.

---

## Goals

- Admin panel respects OS dark/light preference automatically
- Admin user can override the OS preference with a persistent toggle
- Every save, create, and delete action surfaces a clear success or failure toast
- After saving a post (new or edit), the user is returned to `/admin/posts`
- After saving an inline section (About/Resume), the section collapses to read-only view

---

## User Stories

### US-001: Install and configure `sonner` toast library

**Description:** As a developer, I need a toast notification provider installed so that all admin pages can fire toasts.

**Acceptance Criteria:**

- [ ] `sonner` is added to `frontend/package.json` dependencies
- [ ] `<Toaster />` is rendered inside the admin CMS layout (`app/admin/(cms)/layout.tsx`) so it is available on all protected pages
- [ ] The `Toaster` component is positioned bottom-right and uses a reasonable default duration (4 seconds)
- [ ] Typecheck/lint passes

---

### US-002: Install and configure `next-themes` for dark mode

**Description:** As a developer, I need a theme provider set up so dark mode can be toggled and persisted in the admin panel.

**Acceptance Criteria:**

- [ ] `next-themes` is added to `frontend/package.json` dependencies
- [ ] A `ThemeProvider` wraps the admin root layout (`app/admin/layout.tsx`) with `attribute="class"` and `defaultTheme="system"` so the OS preference is used by default
- [ ] The `suppressHydrationWarning` prop is added to the `<html>` tag in the root layout (`app/layout.tsx`) to prevent hydration mismatch
- [ ] Tailwind CSS v4 dark mode is configured via the `dark` class strategy in `globals.css` (add `@variant dark (.dark) { ... }` or confirm the existing config handles it)
- [ ] All existing shadcn component CSS variables include dark mode counterparts (verify `globals.css` has `:root` and `.dark` token definitions)
- [ ] Typecheck/lint passes

---

### US-003: Add dark mode toggle to admin sidebar and mobile nav

**Description:** As an admin user, I want a dark/light mode toggle in the navigation so I can override the OS preference when needed.

**Acceptance Criteria:**

- [ ] A sun/moon icon toggle button is visible in the admin sidebar (desktop) and mobile top nav
- [ ] Clicking the toggle switches between light and dark mode immediately
- [ ] The preference persists across page refreshes (stored by `next-themes` in `localStorage`)
- [ ] The correct icon (sun for light, moon for dark) is shown based on the current theme
- [ ] Typecheck/lint passes
- [ ] Verify in browser using dev-browser skill

---

### US-004: Apply dark mode styles to admin layout and navigation

**Description:** As an admin user, I want the admin sidebar, header, and navigation to look correct in dark mode.

**Acceptance Criteria:**

- [ ] Sidebar background, text, border, and active-link highlight all have dark mode variants
- [ ] Mobile top nav has dark mode variants
- [ ] No elements remain hard-coded to white/light backgrounds (replace `bg-white`, `text-gray-900`, etc. with semantic Tailwind dark variants or CSS variables where needed)
- [ ] Typecheck/lint passes
- [ ] Verify in browser using dev-browser skill

---

### US-005: Apply dark mode styles to admin content pages

**Description:** As an admin user, I want all admin CMS pages (About, Resume, Posts list, Post new/edit) to look correct in dark mode.

**Acceptance Criteria:**

- [ ] Dashboard page has dark mode variants
- [ ] About edit page (form inputs, cards, labels) has dark mode variants
- [ ] Resume edit page (experience cards, inputs, collapsible sections) has dark mode variants
- [ ] Posts list page (table/cards, action buttons) has dark mode variants
- [ ] Post new page has dark mode variants
- [ ] Post edit (`/admin/posts/[id]`) page has dark mode variants
- [ ] Form inputs (text, textarea, select) use consistent dark-mode-aware border and background
- [ ] Typecheck/lint passes
- [ ] Verify in browser using dev-browser skill

---

### US-006: Toast notifications on About page save

**Description:** As an admin user, I want to see a toast message when I save About page data so I know whether it succeeded or failed.

**Acceptance Criteria:**

- [ ] On successful save of any About section (bio, tech stack, social links): a green success toast appears with a relevant message (e.g. "About saved successfully")
- [ ] On failed save (network error, API error): a red error toast appears with a message (e.g. "Failed to save about. Please try again.")
- [ ] The existing inline success/error alert divs on the About page are removed and replaced by toasts
- [ ] The save button returns to its default (non-loading) state after the operation completes, whether success or failure
- [ ] Typecheck/lint passes
- [ ] Verify in browser using dev-browser skill

---

### US-007: Toast notifications on Resume page save

**Description:** As an admin user, I want to see a toast message when I save Resume data so I know whether it succeeded or failed.

**Acceptance Criteria:**

- [ ] On successful save of any Resume section or experience item: a green success toast appears (e.g. "Resume saved successfully")
- [ ] On failed save: a red error toast appears (e.g. "Failed to save resume. Please try again.")
- [ ] Existing inline success/error divs on the Resume page are removed and replaced by toasts
- [ ] Typecheck/lint passes
- [ ] Verify in browser using dev-browser skill

---

### US-008: Toast notifications on Posts CRUD

**Description:** As an admin user, I want toast messages when I create, update, or delete a post so I always know the outcome.

**Acceptance Criteria:**

- [ ] On successful post creation: success toast (e.g. "Post created successfully")
- [ ] On successful post update: success toast (e.g. "Post updated successfully")
- [ ] On successful post delete: success toast (e.g. "Post deleted successfully")
- [ ] On any failed operation (create, update, delete): error toast with a descriptive message
- [ ] Existing inline success/error divs on all Posts pages are removed and replaced by toasts
- [ ] Typecheck/lint passes
- [ ] Verify in browser using dev-browser skill

---

### US-009: Redirect to post list after successful post create or edit

**Description:** As an admin user, I want to be sent back to the posts list after saving a new or existing post so I can see the updated list immediately.

**Acceptance Criteria:**

- [ ] After a successful create on `/admin/posts/new`: fires the success toast, then redirects to `/admin/posts`
- [ ] After a successful save on `/admin/posts/[id]`: fires the success toast, then redirects to `/admin/posts`
- [ ] The redirect happens after the toast is triggered (not before), so the toast is visible on the posts list page
- [ ] On failure: no redirect occurs; error toast is shown and user stays on the form
- [ ] Typecheck/lint passes
- [ ] Verify in browser using dev-browser skill

---

### US-010: Exit edit mode after successful inline save (About & Resume)

**Description:** As an admin user, I want inline edit sections to collapse back to read-only view after a successful save so I get clear confirmation that saving is done.

**Acceptance Criteria:**

- [ ] About page: after a successful save, whichever section was being edited transitions back to its read-only/display state
- [ ] Resume page: after a successful save of an experience item, that item collapses back to its collapsed/read-only state
- [ ] On failure: the section stays in edit mode so the user can correct and retry
- [ ] Typecheck/lint passes
- [ ] Verify in browser using dev-browser skill

---

## Functional Requirements

- **FR-1:** Install `sonner` and mount `<Toaster>` in the admin CMS layout.
- **FR-2:** Install `next-themes` and wrap the admin root layout with `<ThemeProvider defaultTheme="system" attribute="class">`.
- **FR-3:** Configure Tailwind CSS v4 to apply dark styles using the `.dark` class on `<html>`.
- **FR-4:** Add a sun/moon toggle button to the admin sidebar and mobile nav that calls `next-themes`'s `setTheme`.
- **FR-5:** All admin UI elements must have explicit `dark:` Tailwind variants so no content is unreadable in dark mode.
- **FR-6:** Replace all inline `bg-green-50` / `bg-red-50` success/error alert divs in admin pages with `sonner` toast calls (`toast.success(...)` / `toast.error(...)`).
- **FR-7:** After a successful form submission on `/admin/posts/new` or `/admin/posts/[id]`, call `router.push('/admin/posts')` (Next.js `useRouter`).
- **FR-8:** After a successful inline save on About or Resume, set the relevant edit-mode state variable to `false` to collapse the section.
- **FR-9:** Error toasts must not auto-redirect; the user stays on the current page to correct issues.

---

## Non-Goals

- No dark mode on the public-facing portfolio pages (`/`, `/curriculum`, `/content`)
- No per-user dark mode setting stored in the database or backend
- No toast notifications on the login page
- No animated transitions between edit/read-only states (simple state toggle is sufficient)
- No confirmation dialogs before delete (toast-only feedback)

---

## Design Considerations

- **Toast position:** bottom-right, standard `sonner` defaults.
- **Toast duration:** 4 seconds for success, 6 seconds for error (errors need more read time).
- **Dark mode toggle icon:** use `lucide-react`'s `Sun` and `Moon` icons (already a dependency).
- **Sidebar placement:** toggle button sits at the bottom of the sidebar nav, above the Logout button.
- **Tailwind dark variants:** prefer semantic tokens (CSS variables) in `globals.css` over scattering `dark:` classes everywhere. Define `:root` and `.dark` token sets for backgrounds, surfaces, borders, and text.

---

## Technical Considerations

- **Tailwind CSS v4 dark mode:** v4 no longer uses `darkMode: 'class'` in `tailwind.config`. Instead, configure via `@variant dark (.dark) { ... }` in `globals.css` or confirm the `@import "tailwindcss"` layer handles it. Verify the actual v4 API in use.
- **`next-themes` with App Router:** requires a client boundary. Wrap `ThemeProvider` in a `"use client"` component (e.g. `components/providers.tsx`) and import it into the server layout.
- **`sonner` with App Router:** `<Toaster>` is a client component; it can be added directly to the admin layout with `"use client"` or placed in a providers wrapper.
- **Router in client components:** use `useRouter` from `next/navigation` for the redirect after post save.
- **Existing state patterns:** About and Resume pages already manage edit state with `useState` booleans. US-010 is a matter of setting those booleans to `false` on success instead of showing an inline alert.

---

## Success Metrics

- Admin user can switch dark/light mode in under 2 clicks
- After any CRUD action, feedback is visible within 500ms
- After saving a post, the user lands on `/admin/posts` with the toast visible
- Zero inline success/error alert divs remain in the admin codebase after implementation

---

## Open Questions

- Does the RichTextEditor (`TipTap`) component need its own dark mode stylesheet, or does it inherit from Tailwind tokens?
- Are there any other admin pages planned beyond About, Resume, and Posts that should be covered by this PRD?
