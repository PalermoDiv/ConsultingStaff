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

## Project Structure (Planned)
```
ConsultantStaffing/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             # Route-level page components
│   ├── hooks/             # Custom React hooks
│   ├── context/            # Context API state management
│   ├── services/          # API calls / data fetching layer
│   ├── types/             # TypeScript interfaces & types
│   ├── utils/             # Helper functions
│   ├── db/                # SQL schema, stored procedures, migrations
│   └── api/               # Backend API layer (if applicable)
├── public/                # Static assets
├── .github/               # CI/CD workflows (if needed)
├── AGENTS.md              # This file
└── README.md              # Human-facing documentation
```

## Key Features (To Build)
1. Dashboard with KPIs and charts (Recharts)
2. Consultant Management (CRUD + skills tracking)
3. Project Management (CRUD + skill requirements)
4. Assignment Management (allocate consultants, detect overutilization)
5. Staffing Recommendations Engine (skill + availability matching)
6. Utilization Analytics (interactive dashboards)

## Dependencies to Add (Pending User Confirmation)
- `recharts` — Data visualization
- `@tanstack/react-table` — Enterprise data tables
- `react-hook-form` — Form state management
- `zod` — Schema validation
- `@supabase/supabase-js` — Supabase client for database/auth/realtime

## Database Notes
- User is familiar with raw SQL and comfortable writing table schemas directly in Supabase's SQL Editor.
- Table definitions and views are managed via SQL. Stored procedures are optional for complex logic only.
- No ORM required for schema, but modern tools can be considered if complexity demands it.
- Frontend connects via Supabase client (`@supabase/supabase-js`), not direct PostgreSQL connections.

## State Management
- Use React Context API + `useReducer` for global state.
- Avoid Redux unless complexity demands it.

## Deployment Constraints
- `main` branch must always build successfully (`npm run build` passes, `npm run lint` passes).
- Vercel deployment from `main`.

## Reminders for Agents
- Update this file if tech stack or architecture changes.
- Verify build after any structural changes.
- Keep `README.md` in sync with `AGENTS.md` for human contributors.
