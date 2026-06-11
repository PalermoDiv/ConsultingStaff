# Consultant Staffing & Capacity Planner — Agent Guide

## Project Overview
Enterprise-style web application for allocating consultants to projects based on skills, availability, and workload capacity.

## Current Tech Stack
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS v4 + React Router v7
- **Backend**: Supabase (managed PostgreSQL + auto-generated REST API + Auth + Realtime)
- **Database**: PostgreSQL via Supabase (SQL schema, optional stored procedures, no ORM required)
- **Deployment**: Vercel (frontend) + Supabase (backend)

## Workflow Rules

### 1. Ask Before Changing
- Always ask user permission before modifying existing code, files, or architecture decisions.
- Never commit or push code without explicit user confirmation.
- Never run `git commit`, `git push`, `git reset`, `git rebase`, or other git mutations unless explicitly asked.

### 2. Branch-Based Development
- `main` must always be deployable.
- All new work happens in feature branches.
- Before merging, verify build passes and no lint errors exist.

### 3. Minimal & Modular Changes
- Make the smallest change necessary to achieve the goal.
- Follow existing code style and patterns.
- Write modular, maintainable code.

### 4. Communication Style
- Guide the user step-by-step; ask them to implement certain parts when it helps learning.
- Explain the "why" behind architectural decisions.
- Keep it stupidly simple (KISS principle).

## Project Structure

### Current (Implemented)
```
ConsultantStaffing/
├── src/
│   ├── context/            ✅ Global state (React Context + useReducer)
│   │   ├── AppContext.tsx
│   │   ├── AppContext.types.ts
│   │   ├── AppContext.reducer.ts
│   │   └── AppContext.actions.ts
│   ├── services/           ✅ API layer (Supabase calls)
│   │   ├── clientService.ts
│   │   ├── consultantService.ts
│   │   ├── skillService.ts
│   │   ├── projectService.ts
│   │   ├── assignmentService.ts
│   │   ├── dashboardService.ts
│   │   └── supabase.ts
│   ├── types/              ✅ TypeScript interfaces
│   │   ├── completetypes.ts
│   │   └── types.ts
│   ├── db/                 ✅ SQL schema
│   │   ├── completeschema.sql
│   │   └── schema.sql
│   ├── components/         ✅ Layout component
│   │   └── Layout.tsx
│   ├── pages/              ✅ Placeholder pages (routing done)
│   │   ├── LandingPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── ConsultantsPage.tsx
│   │   ├── ProjectsPage.tsx
│   │   ├── AssignmentsPage.tsx
│   │   └── RecommendationsPage.tsx
│   ├── hooks/              ❌ Empty (pending custom hooks)
│   └── utils/              ❌ Empty (pending helpers)
├── public/                 ✅ Static assets
├── AGENTS.md               ✅ This file
└── README.md               ✅ Human-facing documentation
```

## Development Phases

### ✅ Phase 0: Project Setup
- React 19 + Vite scaffold
- Tailwind CSS v4 configured
- React Router v7 installed
- Environment variables configured

### ✅ Phase 1: Database Schema
- Complete PostgreSQL schema in `completeschema.sql`
- Tables: clients, consultants, skills, projects, consultant_skills, project_skills, assignments
- Views: consultant_utilization
- Indexes for performance
- Row Level Security (RLS) policies
- Soft delete support (`is_active` on all tables)

### ✅ Phase 2: TypeScript Types
- `completetypes.ts` with all database interfaces
- Enums: ConsultantPosition, ProjectStatus, AssignmentStatus, AvailabilityStatus
- Type-safe with `is_active` fields

### ✅ Phase 3: Database Connection
- `supabase.ts` client configured
- Reads from `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### ✅ Phase 4: Service Layer
- 6 service files implementing CRUD operations
- Pattern: `getAllX()`, `getXById()`, `createX()`, `updateX()`, `deactivateX()`, `deleteX()`
- `assignmentService.ts` includes over-utilization protection
- `dashboardService.ts` includes KPIs and staffing recommendations

### ✅ Phase 5: Soft Delete Pattern
- All major tables have `is_active BOOLEAN DEFAULT true`
- List functions filter `is_active = true` by default
- `deactivateX()` functions for safe deletion
- `deleteX()` functions reserved for admin use

### ✅ Phase 6: Global State (React Context + useReducer)
- `AppContext.tsx` — Provider wrapping the app
- `AppContext.types.ts` — State shape and action types
- `AppContext.reducer.ts` — Reducer logic for all entities
- `AppContext.actions.ts` — Async thunks (load, add, edit, remove for each entity)
- `loadAllData()` — Fetches all entities in parallel on app start

### 🔄 Phase 7: UI Components (In Progress)
- ✅ Layout component (sidebar + header) with Tailwind CSS
- ✅ Collapsible sidebar navigation
- ❌ Data tables with `@tanstack/react-table`
- ❌ Forms with `react-hook-form` + `zod`
- ❌ Charts with `recharts`

### ✅ Phase 8: Routing & Pages
- `/` — Landing page
- `/dashboard` — Dashboard
- `/consultants` — Consultant management
- `/projects` — Project management
- `/assignments` — Assignment management
- `/recommendations` — Staffing recommendations

### ❌ Phase 9: Integration & Testing
- End-to-end CRUD testing
- Assignment over-utilization testing
- Dashboard KPI verification

### ❌ Phase 10: Deployment
- Vercel frontend deployment
- Supabase production environment

## Key Features Status

| Feature | Status | Notes |
|---------|--------|-------|
| Dashboard with KPIs | ❌ | Backend ready, needs UI |
| Consultant Management | ✅ Backend | CRUD + skills tracking |
| Project Management | ✅ Backend | CRUD + skill requirements |
| Assignment Management | ✅ Backend | Allocate + overutilization detection |
| Staffing Recommendations | ✅ Backend | Skill + availability matching |
| Utilization Analytics | ✅ Backend | Interactive dashboards pending UI |
| App Layout | ✅ | Sidebar + header + navigation |
| Routing | ✅ | All pages with React Router v7 |

## Dependencies

### ✅ Installed
- `react` ^19.2.6
- `react-dom` ^19.2.6
- `react-router-dom` ^7.17.0
- `@supabase/supabase-js` ^2.108.0
- `tailwindcss` ^4.3.0
- `@tailwindcss/vite` ^4.3.0
- `typescript` ~6.0.2
- `vite` ^8.0.12
- `eslint` ^10.3.0

### ✅ All Dependencies Installed
- `recharts` — Data visualization
- `@tanstack/react-table` — Enterprise data tables
- `react-hook-form` — Form state management
- `zod` — Schema validation

## Architecture Notes

### Data Flow
```
User Action → Component → Context Action → Service → Supabase → Database
     ↑                                                        |
     └────────────── Re-render with new data ←─────────────────┘
```

### Soft Delete Pattern
All entities use `is_active` boolean:
- `getAllX()` → filters `is_active = true` by default
- `deactivateX(id)` → sets `is_active = false` (recommended)
- `deleteX(id)` → hard delete (admin only)

### State Management
- React Context + `useReducer` for global state
- `dispatch` sends actions to reducer
- Reducer updates immutable state
- Components re-render automatically
- Async actions handle loading/error states

## Database Notes
- User is familiar with raw SQL and comfortable writing table schemas directly in Supabase's SQL Editor.
- Table definitions and views are managed via SQL. Stored procedures are optional for complex logic only.
- No ORM required for schema, but modern tools can be considered if complexity demands it.
- Frontend connects via Supabase client (`@supabase/supabase-js`), not direct PostgreSQL connections.

## Deployment Constraints
- `main` branch must always build successfully (`npm run build` passes, `npm run lint` passes).
- Vercel deployment from `main`.

## Reminders for Agents
- Update this file if tech stack or architecture changes.
- Verify build after any structural changes.
- Keep `README.md` in sync with `AGENTS.md` for human contributors.
- Use `type-only imports` for TypeScript interfaces: `import type { X } from '...'`
- Follow the soft delete pattern for all new entities.
