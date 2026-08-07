# KLS Academy — Admin console

Internal review and management console at `admin.klstechsolutions.in`. Shares one FastAPI
backend and one PostgreSQL database with the student portal.

**Status: production-ready.** Every screen calls the real API. There is no mock data and
no demo login — the backend must be running.

---

## Run it

The API has to be up first:

```bash
cd ../kls-api
.venv\Scripts\activate
uvicorn app.main:app --reload
```

Then:

```bash
npm install
copy .env.example .env.local
npm run dev          # http://localhost:3001
```

Sign in with the super admin created by `kls-api/scripts/seed.py`.

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server on port 3001 |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | TypeScript, no emit |

---

## Stack

Identical to `academy` so one person can move between the repos: Next.js 16 App Router ·
React 19 · TypeScript · Tailwind v4 · TanStack Query · react-hook-form + zod ·
lucide-react · recharts.

**Note:** lucide-react v1 dropped brand icons — `Github` and `Linkedin` do not exist.
Use `FolderGit2` and `Share2`.

---

## What this console does

**It is the engine of the platform.** A student cannot move forward until someone here
approves something:

- Approving a **LinkedIn post** unlocks all of that student's technical tasks
- Approving their **final task** unlocks the ₹50 payment, which issues their certificate

Because of that, every mutation surfaces its error loudly. A silent failure leaves a
student frozen with no idea why.

Rejection remarks are mandatory and go straight to the student — that text is the only
feedback they receive.

---

## Routes

```
/login  /forgot-password  /reset-password  /accept-invite
/                          overview: pending queues, funnel, quick actions
/reviews/tasks             queue · /reviews/tasks/[id] detail with screenshot lightbox
/reviews/linkedin          queue and detail in one split view
/students                  directory with stage column
/students/[id]             the same StudentJourney the student sees
/catalogue/domains         super admin — CRUD, ordering, activate/deactivate
/catalogue/batches         super admin
/catalogue/batches/[id]/tasks   super admin — CRUD, reorder, enable/disable,
                                per-task submission rules
/payments  /certificates  /analytics
/activity-logs             super admin
/team                      super admin — invite administrators
/profile
```

---

## Roles

| Capability | admin | super_admin |
| --- | :---: | :---: |
| Review LinkedIn and task submissions | ✅ | ✅ |
| View students, payments, certificates, analytics | ✅ | ✅ |
| Create / edit / delete domains, batches, tasks | ❌ | ✅ |
| Revoke certificates | ❌ | ✅ |
| Read activity logs | ❌ | ✅ |
| Invite and manage administrators | ❌ | ✅ |

`RoleGate` hides what a role cannot use and `RequireCapability` blocks whole routes —
but **the API enforces all of it**. The UI check is convenience; a 403 is still handled
gracefully if one slips through.

---

## Task configuration

Each task carries its own submission rules, set by a super admin and enforced by the API:

| Setting | Effect |
| --- | --- |
| Minimum / maximum screenshots | 0–20, checked on upload |
| Require GitHub repository | Makes the repo URL mandatory or optional |
| Require explanation + minimum length | Written explanation and how long it must be |
| Require live demo | Makes the demo URL mandatory |
| Task is open | Disabled tasks are hidden from students |

**Disabling a task does not strand anyone.** The journey engine skips inactive tasks, so
a student who finished everything else still reaches `all_tasks_approved`.

**Reordering a live batch changes what is open to students mid-flight**, because tasks
unlock one at a time behind the previous approval. The UI warns before it acts.

---

## Security

- **Auto logout** after 30 minutes of inactivity, coordinated across browser tabs. Only a
  timestamp goes in localStorage; no token ever does.
- **Student accounts cannot sign in here** — `/api/auth/login` checks the role and refuses
  before writing a cookie.
- **A dead session redirects to `/login`** from one place in the API client, with a banner
  explaining why.
- **JWTs live in httpOnly cookies.** The browser calls `/api/proxy/*` and the Next server
  attaches the token. An XSS payload cannot read it.
- On a 401 the client refreshes once and replays; concurrent 401s share one refresh call.

### Administrator invitations

`/team` → Invite creates a **pending** account with an unusable random password hash and
a 7-day single-use link. The invitee sets their own password at `/accept-invite`, so **no
working credential is ever transmitted**.

While email is unconfigured the invite link is shown with a copy button. Once `SMTP_HOST`
is set it arrives by email instead and the box disappears — no code change.

---

## Architecture

```
browser ──► /api/auth/*   (route handlers) ──► FastAPI   sets httpOnly cookies
        └─► /api/proxy/*  (pass-through)   ──► FastAPI   attaches Bearer token
```

---

## Shared with the academy repo

These files are **copied, not forked**. When they change, they change in `academy` first:

| File | Why |
| --- | --- |
| `src/styles/theme.css` | The design contract — never add a hex outside it |
| `src/types/index.ts` | Domain shapes. `GET /admin/students/{id}` returns the same `StudentJourney` the student dashboard uses |
| `src/components/ui/*` | Button, Card, Input, Dialog, Toast, form primitives |
| `src/lib/api/{client,errors}.ts` | HTTP client and error taxonomy |

Admin-only additions: `DataTable`, `FilterBar`, `ConfirmDialog`, `RoleGate`,
`ScreenshotGallery`, `ReviewPanel`, `TaskFormDialog`, `InviteDialog`.

---

## Conventions

- Never write "Pvt. Ltd." — the organisation is **KLS Tech Solutions**, MSME registered
- Support address is `klstechsolutions2025@gmail.com`
- Money is stored in paise; divide by 100 only at the point of display
- Task counts vary per domain; `order_number` 0 is the LinkedIn onboarding task

## Not built yet

- Bulk review actions
- CSV export of students and payments
