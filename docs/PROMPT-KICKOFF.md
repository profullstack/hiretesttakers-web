# PROMPT-KICKOFF.md — Project Kickoff & Build-Mode System Prompt

> Copy this file into your repo root. Treat it as the **source of truth** for feature prompts.
> When a prompt is completed and merged, **remove it from this file**.

## 🔒 Global Mode Constraints (apply to every prompt)

* **All Supabase calls must go through local, server-side API routes** (client → `/api/*` → server → Supabase). No direct client calls.
* **Testing**: use **Vitest** for unit/integration; **Playwright** for e2e.
* **Principles**: **DRY** and **KISS**.
* **Design asset**: generate and commit `./docs/color-palette.png` with a friendly, unique, modern color scheme.
* **i18n/l10n**: client-side localization (default **English** for SSR). Include **Arabic (RTL)**, **Chinese**, **Japanese**, **Spanish**, **German**.
* **Theme**: light/dark toggle using a **light-bulb** and **moon** icon. Only two themes, no more.
* **E2E coverage**: signup/login flows + all public routes reachable from homepage; assert no console errors, no server errors, and no failed API responses.
* **Package manager**: prefer **pnpm**.
* **Stack preference**: **SvelteKit 5**, **Node.js** server adapters, **Supabase** backend services.

---

## 📁 Repository Baseline (expected)

```
/src
  /routes
    /+layout.svelte
    /+layout.server.js
    /+layout.ts               (only if absolutely needed)
    /+page.svelte
    /api
      /auth
        /signup/+server.js
        /login/+server.js
        /logout/+server.js
      /profile/+server.js
      /health/+server.js
  /lib
    /i18n/
      index.js
      en.json ar.json zh.json ja.json es.json de.json
    /stores/
      theme.js
    /components/
      ThemeToggle.svelte
      LangSwitcher.svelte
      NavBar.svelte
      Footer.svelte
/tests
  /unit
  /e2e
/docs
  color-palette.png
  architecture.md
  decisions.md
```

---

## 🧭 How to Use This File

* Each **Feature Prompt** below is self-contained with **acceptance criteria**, **file paths**, and **test expectations**.
* When you (or an AI build mode) pick the **next prompt**, implement it **fully**: API routes, Svelte components, pages, tests, and docs.
* If you hit a blocker, add a `TODO:` and continue where possible—otherwise **ask me**.

---

# ▶️ Feature Prompt 1 — Project Scaffold, Auth Shell, i18n + Theme

> **Goal**: Ship a production-ready baseline: app shell, local API proxy to Supabase, auth pages, i18n (incl. RTL), theme toggle, color palette image, tests.

## Scope & Deliverables

1. **App Shell & Navigation**

   * `src/routes/+layout.svelte` with sticky header, content slot, and footer.
   * `NavBar.svelte` includes: brand, links (Home, Login, Signup), `LangSwitcher`, `ThemeToggle`.
   * Respect **light/dark** theme at OS preference + persisted user choice (localStorage) with no FOUC.

2. **Theme Toggle**

   * `ThemeToggle.svelte` with **light-bulb** (light) and **moon** (dark) icons.
   * Implements media query fallback and SSR-safe hydration.

3. **Localization**

   * `src/lib/i18n/index.js` using a lightweight Svelte i18n lib or custom store.
   * Default SSR locale: **en**.
   * Bundled locales: `en, ar (RTL), zh, ja, es, de`.
   * `LangSwitcher.svelte` dropdown; persists selection; applies `dir="rtl"` for Arabic.

4. **Auth (proxied through local API)**

   * Pages: `/login`, `/signup` (simple, accessible forms).
   * API routes (server-only):

     * `POST /api/auth/signup` → Supabase auth signUp
     * `POST /api/auth/login` → Supabase auth signIn
     * `POST /api/auth/logout` → Supabase signOut
   * Client calls hit only `/api/*` (fetch with credentials), never Supabase directly.
   * Minimal **profile** endpoint: `GET /api/profile` returns current user (or 401).

5. **Health Check**

   * `GET /api/health` returns `{ status: "ok", time: <iso> }` with 200.

6. **Color Palette**

   * Commit `./docs/color-palette.png` (export from your design tool or generate programmatically).
   * Palette must be accessible (AA at minimum), modern, and brandable (primary/neutral/semantic).

7. **Docs**

   * `./docs/architecture.md` — high-level diagram (text or Mermaid), key decisions, routing, SSR/CSR strategy.
   * `./docs/decisions.md` — ADR-style bullets: i18n choice, theme system, auth proxy, testing stack.

## Implementation Notes

* **Supabase**: read keys server-side only (private env). Do **not** expose anon keys on client.
* **Cookies**: secure, httpOnly where applicable; set session via Supabase helper on server.
* **SvelteKit endpoints**: use `+server.js` with `RequestEvent` (JS over TS unless necessary).
* **Error handling**: standard JSON error shape `{ error: { code, message } }`.

## Acceptance Criteria

* App renders without visual shift; theme + locale persist across reloads and routes.
* All auth flows function using local API routes only (no direct client→Supabase).
* RTL layout applies correctly when `ar` is selected.
* Color palette image exists and is referenced in `architecture.md`.
* **Vitest** unit tests cover:

  * theme store logic
  * i18n store initialization & locale switching
  * API route handlers (happy + failure paths, mocked Supabase SDK)
* **Playwright** e2e:

  * Navigate from home → login/signup (public links must all work)
  * Signup → redirected or visible success state
  * Login → session visible (e.g., navbar shows “Logout”)
  * Logout works
  * Switch theme, switch language (assert `dir` for Arabic)
  * Assert **no** console errors, network 4xx/5xx (except intentional auth failures)
* CI runs `pnpm vitest` and `pnpm playwright test` without flake.

## File Map (create/update)

* `/src/routes/+layout.svelte` — shell with slots, theme & i18n initialization
* `/src/routes/+layout.server.js` — SSR default locale (en), session load
* `/src/routes/+page.svelte` — basic home with links (public routes)
* `/src/routes/login/+page.svelte` — login form
* `/src/routes/signup/+page.svelte` — signup form
* `/src/routes/api/health/+server.js`
* `/src/routes/api/auth/login/+server.js`
* `/src/routes/api/auth/signup/+server.js`
* `/src/routes/api/auth/logout/+server.js`
* `/src/routes/api/profile/+server.js`
* `/src/lib/components/ThemeToggle.svelte`
* `/src/lib/components/LangSwitcher.svelte`
* `/src/lib/components/NavBar.svelte`
* `/src/lib/components/Footer.svelte`
* `/src/lib/stores/theme.js`
* `/src/lib/i18n/index.js`, `/src/lib/i18n/{en,ar,zh,ja,es,de}.json`
* `/tests/unit/*` (Vitest)
* `/tests/e2e/*` (Playwright)
* `/docs/{color-palette.png,architecture.md,decisions.md}`

## Commands

```bash
# install
pnpm i

# dev
pnpm dev

# unit/integration
pnpm vitest

# e2e (ensure playwright is installed first: pnpm playwright install)
pnpm playwright test
```

---

# ▶️ Feature Prompt 2 — Public Pages Crawl & Link Integrity

> **Goal**: Build out all public pages linked from the homepage and guarantee link integrity.

## Scope & Deliverables

* Implement pages: `/pricing`, `/about`, `/contact`, `/docs` (placeholder index), `/privacy`, `/terms`.
* Footer links mirror header where sensible; ensure semantic landmarks (header/nav/main/footer).
* Add sitemap.xml & robots.txt.

## Acceptance Criteria

* All links reachable from `/` resolve to 200 and render without console errors.
* Playwright e2e crawls navbar/footer + in-page links, asserts **no broken links** and **no 4xx/5xx**.

---

# ▶️ Feature Prompt 3 — Profile Page (Authed), Session Surface

> **Goal**: Add `/me` page, expose current session, and basic profile editor calling `/api/profile`.

## Scope & Deliverables

* `/me` shows email/uid and a display name field (saved via `PATCH /api/profile`).
* SSR guard: unauthenticated users redirected to `/login`.

## Acceptance Criteria

* Unit tests for profile API (patch + validation).
* e2e: login → `/me` → update display name → persistence verified on reload.

---

# 🔁 Prompt Pattern Template (copy for future features)

## Feature Prompt — {Short Name}

**Goal**: {what will exist for users when done}

### Scope & Deliverables

* {bullets for pages, components, API routes, jobs, migrations, etc.}

### Data & DB

* **Tables**: {name, purpose}
* **Schema changes**: {fields, indexes}
* **Migrations**: {path & up/down description}

### API Surface

* **Routes**: `METHOD /api/...` with request/response shapes
* **Auth**: {public, user, admin}
* **Validation**: {what to validate, error format}

### UI/UX

* **Pages/Components**: {paths, states, loading, empty, error}
* **Accessibility**: {focus mgmt, keyboard nav, landmarks}
* **i18n**: strings added to locales

### Testing

* **Unit/Integration (Vitest)**: {modules to cover, mocks}
* **E2E (Playwright)**: {critical user journeys + negative cases}
* **Non-regression**: {link integrity, 500 scans, console error checks}

### Observability

* **Logs**: {what’s logged where, redaction rules}
* **Health**: {endpoints/metrics}
* **Error handling**: {standard error shape}

### Acceptance Criteria

* {bullet list of testable, binary outcomes}

### Files to Create/Update

* `/path/to/file`
* `/path/to/another`

### Completion Checklist

* [ ] Code + tests merged
* [ ] Docs updated (`/docs/architecture.md`, `/docs/decisions.md`)
* [ ] `./docs/color-palette.png` updated if design shifted
* [ ] e2e green in CI
* [ ] Removed this prompt block from PROMPTS.md

---

If you want, I can now output **starter code stubs** for the routes/components/tests listed in **Feature Prompt 1** so you can paste them into your project and run `pnpm dev` immediately.
