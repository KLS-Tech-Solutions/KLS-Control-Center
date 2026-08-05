# KLS Control Center

Admin portal UI prototype for **KLS Tech Solutions** — `admin.klstechsolutions.in`.

This is a **frontend-only reference implementation**. There is no backend, no
authentication, no database and no network calls anywhere in the app. Every
screen renders from typed mock modules in `src/data/`, so the development team
can review flows, layout and component behaviour before FastAPI work begins.

## Stack

| Concern | Choice |
|---|---|
| Framework | React + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS v4 (`@theme` tokens, no config file) |
| Routing | React Router (`createBrowserRouter`, lazy routes) |
| Icons | Lucide |
| Motion | Framer Motion |
| Charts | Recharts |
| UI primitives | Hand-built shadcn/ui-style components in `src/components/ui` |

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build to dist/
npm run preview  # serve the production build
npm run lint
```

## Deploying to Vercel

Import the repository and accept the detected Vite preset — `vercel.json`
already rewrites all paths to `index.html` so client-side routes resolve on
refresh and direct links.

- Build command: `npm run build`
- Output directory: `dist`

## Project structure

```
src/
  components/
    layout/        AppLayout · Sidebar · Topbar · Logo
    ui/            Card · Button · Badge · Input · Table · Avatar · Toggle
    charts/        chartTheme · ChartTooltip / ChartLegend
    StatCard.tsx   DashboardCard.tsx  ModuleCard.tsx  PageHeader.tsx
    TableToolbar.tsx  PageSkeleton.tsx
  pages/           Login · Dashboard · Students · Internships · Certificates
                   Payments · Analytics · Settings · Profile · Support · NotFound
  data/            students · internships · certificates · payments
                   analytics · support · admin   (mock JSON-shaped modules)
  routes/          route table + sidebar navigation config
  types/           domain interfaces shared by data and components
  hooks/           useTheme · useMediaQuery · useTableFilters
  utils/           cn · format · status
```

## Routes

| Path | Page |
|---|---|
| `/` | Login (no auth — submitting navigates to `/dashboard`) |
| `/dashboard` | KPI tiles, four charts, quick actions, activity, system status |
| `/students` | Searchable/filterable student table |
| `/internships` | Programme cards for the five KLS tracks |
| `/certificates` | Issuance ledger with download actions |
| `/payments` | Revenue summary, collections chart, transaction table |
| `/analytics` | Growth, channel mix, programme mix, completion, revenue |
| `/settings` | Company · SMTP · Payments · Security · Theme panels |
| `/profile` | Admin profile, sessions, permissions |
| `/support` | Ticket queue |

## Design language

Brand palette is Navy / Azure Blue / White / Light Gray, expressed as Tailwind
`@theme` tokens in `src/index.css`. Components never reference raw hex — they
use semantic roles (`--surface`, `--ink-primary`, `--hairline`, …) which are
redefined once under `.dark`, so light and dark themes swap in a single place.

Chart series colours are declared as CSS custom properties (`--s1`…`--s4`, plus
an ordinal blue ramp `--ord-1`…`--ord-4`) and were validated for colour-vision
separation and contrast against **both** the light (`#ffffff`) and dark
(`#0f1b2e`) card surfaces. Every chart carries a legend when it has two or more
series, plus a hover tooltip, so a value is never communicated by colour alone.

## Swapping mocks for the FastAPI backend

1. Each module in `src/data/` exports plain typed values matching `src/types`.
   Replace the export with a fetch/react-query hook of the same shape.
2. `useTableFilters` is the seam for search and status filtering — point it at
   server-side query params without touching any page component.
3. Add a route guard around the `AppLayout` branch in `src/routes/index.tsx`
   once real authentication exists. Login already lives outside the shell.

## Notes / deviations

- **React 19** is installed (the scaffold shipped with it) rather than React 18.
  Nothing in the codebase uses React 19-only APIs, so it runs on 18 unchanged if
  the team prefers to pin down.
- **shadcn/ui components are hand-written** in `src/components/ui` following the
  same composition and `cva` variant patterns, rather than generated via the CLI.
  This keeps the prototype free of Radix runtime dependencies; swapping in the
  real shadcn primitives later is a drop-in per component.
- All buttons, forms, toggles and download actions are presentational. Only
  search, filters, tabs, sidebar collapse and the theme toggle actually do
  anything.
