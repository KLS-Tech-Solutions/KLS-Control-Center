# KLS Admin — build plan

**Repo:** `admin-dashboard` → `admin.klstechsolutions.in`
**Backend:** shared `kls-api` (already built — 47 endpoints, `docs/API_CONTRACT.md`)
**Decisions locked:** I build all of it · wired to the live API from the start · two roles,
`admin` and `super_admin`

Mirrors the academy build exactly — same stack, same file layout, same conventions — so
one person can move between the two repos without re-learning anything.

---

## 0. What gets cleared

The existing sample is Vite + React Router: 11 pages, 49 files. **All of it goes.**
Nothing is salvageable because the whole app moves to Next.js App Router and the real
data shapes are different. Preserved: `.git` history (new branch off `dev`),
`.gitignore`, and the Vercel SPA rewrite is replaced by the Next preset.

---

## Ground rules

| Do | Don't |
| --- | --- |
| Copy `theme.css` from `academy` verbatim | Add a hex value outside it |
| Copy `types/index.ts` from `academy` verbatim | Redefine domain types |
| Keep JWTs in httpOnly cookies via a Next proxy | Touch localStorage |
| Enforce roles in the UI *and* handle 403 | Assume the frontend check is the only one |
| Fail loudly on a failed approval | Swallow mutation errors |
| Write "KLS Tech Solutions" | Ever write "Pvt. Ltd." |

**Why approvals must fail loudly:** an approval that silently fails leaves a student
frozen with no way forward and no idea why. Every mutation here surfaces its error.

---

# Phase 1 — Foundation and shell

### Step 0 · Clear and branch  *(20 min)*
Branch `feat/admin-mvp-001` off `dev`. Delete `src/`, `index.html`, `vite.config.ts`,
`tsconfig.app.json`, `tsconfig.node.json`, `dist/`, `.oxlintrc.json`, `vercel.json`.

### Step 1 · Next.js 16 migration  *(1 h)*
Same versions as `academy` so both repos upgrade together: Next 16.3, React 19.2,
Tailwind v4, TanStack Query 5, react-hook-form + zod, framer-motion, lucide-react.
Adds `recharts` for analytics. `next.config.ts`, `postcss.config.mjs`, `tsconfig.json`
with `@/*`, `.env.example`.

**Admin is never indexed** — `robots: { index: false }` app-wide plus a `robots.ts`
returning `Disallow: /`.

### Step 2 · Design system  *(1 h)*
`src/styles/theme.css` copied byte-for-byte from `academy`. UI primitives copied over:
Button, Card, Badge, Input/Select/Textarea, Field, Dialog, Accordion, Tabs, Alert,
Progress, Skeleton, Avatar, Toast, `form.tsx` (`useZodForm`, `FormField`).

Admin-specific additions:
- `DataTable` — sortable, empty and loading states, row click-through
- `FilterBar` — search + status filter + count, used by every list screen
- `ConfirmDialog` — destructive actions (delete task, revoke certificate)
- `RoleGate` — hides super-admin-only UI

An admin tool is **denser** than the student app — tighter rows, more per screen — but
uses the same tokens, so it reads as the same product family.

### Step 3 · Layout shell  *(1.5 h)*
- Sidebar: Overview · Reviews (LinkedIn, Tasks) · Students · Catalogue · Payments ·
  Certificates · Analytics · Activity logs · Profile. Super-admin items hidden by role.
- Topbar: breadcrumb, pending-review count, admin avatar menu, sign out.
- `(auth)` layout — centred card on the grid background.
- `not-found.tsx`, `error.tsx`, `forbidden` state for 403s.

### Step 4 · Types, services, query layer  *(2 h)*
- `types/index.ts` copied from `academy`, plus `AdminStudentSummary` and
  `AnalyticsOverview`.
- `lib/api/` copied — client, `ApiError` taxonomy, 401 refresh-and-replay.
- `lib/query-keys.ts` — admin key registry.
- `services/` — one file per area, all calling the live API:
  `auth`, `reviews`, `students`, `catalogue`, `payments`, `certificates`, `analytics`, `logs`.
- `app/api/auth/*` route handlers + `app/api/proxy/[...path]` — identical to academy, so
  the admin JWT never reaches client JavaScript.

**Deliverable:** app boots, signs in against the real API, sidebar renders by role.

---

# Phase 2 — The screens

Ordered by how much each unblocks real students.

### Step 5 · Auth + RBAC  *(1.5 h)*
`/login`, `/forgot-password`, `/reset-password`. `RequireAdmin` guard rejects a student
token with a clear message rather than a redirect loop. Dev-only **role switcher**
(admin ↔ super_admin) mirroring academy's stage switcher, hidden in production.

### Step 6 · Review queues — the engine  *(4 h)*

| Route | Contents |
| --- | --- |
| `/reviews/tasks` | Queue filtered by status, batch, task, student. Shows attempt number so resubmissions are obvious |
| `/reviews/tasks/[id]` | Full submission: title, explanation, GitHub link, live demo, **screenshot lightbox**, student context, previous review history. Approve / reject with remarks |
| `/reviews/linkedin` | Pending post queue |
| `/reviews/linkedin/[id]` | Post URL, offer letter reference, approve / reject with comment |

Rejection remarks are mandatory and go straight to the student — the reject dialog says
so, because that text is the only feedback they get.

### Step 7 · Students  *(2 h)*
`/students` — search, batch filter, **stage column** so anyone stuck is visible at a
glance. `/students/[id]` renders `GET /admin/students/{id}`, which returns the same
`StudentJourney` shape the student's own dashboard uses — so the reviewer sees exactly
what the student sees.

### Step 8 · Catalogue — super admin  *(3 h)*
Domains list/create/edit/delete · batches · tasks with **add, remove and drag-reorder**.
Task counts are variable per domain by design.

Reorder writes through `POST /admin/tasks/reorder`. The UI warns before reordering a
batch that already has submissions — students are locked task-by-task behind the
previous approval, so resequencing mid-batch changes what is open to them.

### Step 9 · Money, credentials, ops  *(2.5 h)*
`/payments` — list, status filter, revenue total (paise → ₹ at the edge).
`/certificates` — list, verification link, revoke with reason (super admin, confirm dialog).
`/analytics` — students by stage funnel, pending review counts, certificates, revenue.
`/activity-logs` — super admin, filter by user and module.
`/profile` — admin's own details.

### Step 10 · Polish and verify  *(2 h)*
Responsive 360 → 1440. Loading skeletons, empty states, 403 state on every screen.
`next build` clean, no TypeScript errors, route smoke test against a running API.

---

# Phase 3 — Validation

Same as academy Phase 2, applied to admin forms: `react-hook-form` + `zod`, schemas in
`lib/validation/`, validate on blur then re-validate on change, FastAPI 422 responses
mapped back onto fields via `loc[-1]`.

| Form | Key rules |
| --- | --- |
| Login / password reset | Email format, password ≥ 8 with letter and number |
| Review (approve/reject) | Remarks 3–2000 chars, **required on reject** |
| Domain | Slug lowercase-hyphen unique, title 3–150, difficulty enum |
| Batch | End date after start date, seats 1–1000 |
| Task | Order ≥ 0, title 3–200, description ≥ 10, hours 1–200 |
| Certificate revoke | Reason required — it is a permanent action |

---

# Phase 4 — Verification and handover

- End-to-end run against `kls-api`: approve a LinkedIn post, watch the student's stage
  move to `linkedin_approved`, approve every task, confirm payment unlocks.
- Both roles exercised: confirm `admin` gets 403 on catalogue writes and the UI hides
  them.
- README documenting the same things academy's does.
- Deploy to Vercel on `admin.klstechsolutions.in`, `API_BASE_URL` pointed at the VPS.

---

## Route map

```
/login  /forgot-password  /reset-password
/                          overview: pending queues, stats, recent activity
/reviews/tasks             /reviews/tasks/[id]
/reviews/linkedin          /reviews/linkedin/[id]
/students                  /students/[id]
/catalogue/domains         /catalogue/domains/[id]        super admin
/catalogue/batches         /catalogue/batches/[id]/tasks  super admin
/payments
/certificates
/analytics
/activity-logs                                            super admin
/profile
```

---

## Role capabilities

| Capability | admin | super_admin |
| --- | :---: | :---: |
| Review LinkedIn and task submissions | ✅ | ✅ |
| View students, payments, certificates, analytics | ✅ | ✅ |
| Create / edit / delete domains, batches, tasks | ❌ | ✅ |
| Revoke certificates | ❌ | ✅ |
| Read activity logs | ❌ | ✅ |

The backend enforces all of this. The UI hides what a role cannot do **and** renders a
clear message if a 403 comes back anyway.

---

## Effort

Phase 1 ≈ 5.5 h · Phase 2 ≈ 15 h · Phase 3 ≈ 3 h · Phase 4 ≈ 2 h — **≈ 25 hours.**

If time is short, Steps 5–7 alone (auth, review queues, students) make the platform
operable — a reviewer can move students through the whole journey. Catalogue, analytics
and logs are management convenience and can follow.

---

## Prerequisites

1. `kls-api` running — `docker compose up` in `Desktop\kls-api`
2. Seeded — `docker compose exec api python scripts/seed.py`
3. Super admin credentials from `.env` (`FIRST_SUPERADMIN_EMAIL` / `_PASSWORD`)
4. Developer 2 redirected off this app — suggest Phase 6 (PDF and QR generation) or
   Phase 8 (email delivery); neither collides with this work
