# Progress Tracker

## Modules
- [x] **Setup** — Scaffold, clean boilerplate, dev server running
- [x] **Module 1: Components & JSX** — Functions, JSX syntax, Tailwind, Server Components
- [x] **Module 2: Rendering Techniques** — Conditional rendering, .map(), keys, Server vs Client
- [x] **Module 3: Props & Data Flow** — One-way flow, callback props, 'use client'
- [x] **Module 4: State & Rendering** — useState, immutable updates, re-render cycle
- [ ] **Module 5: State Structure & Forms** — Derived state, controlled inputs, form handling
- [ ] **Module 6: Effects** — useEffect, dependency array, cleanup, SSR window guard
- [ ] **Module 7: Lifting State** — Shared state, sibling communication, server-client boundary

## Session Notes

### Module 4 — 2026-04-08
- Installed framer-motion; added animations throughout (fade-in, slide-up, exit, hover lift, pathLength checkmark)
- Created `NavBar` with `layoutId="tab-indicator"` sliding underline between tabs
- Created `StatsBar` with animated progress bar (spring easing on width)
- `TaskCard` fully rewritten: priority colored left-border + dot, due date with overdue detection, tag pills with deterministic hash colors, animated checkmark SVG, hover-reveal delete
- `TaskList` uses `AnimatePresence mode="popLayout"` + `motion.li layout` so deleted tasks collapse smoothly and siblings reflow
- `TaskBoard` wraps in fade-in `motion.div`; filter buttons use `whileTap` for press feedback; `setTasks` uses functional updater form `(prev) => ...` to avoid stale closure bugs
- `page.js` gains fixed radial gradient background accent, max-width increased to 3xl for breathing room

### Module 3 — 2026-04-08
- Tasks array moved into `TaskBoard` (owns its own state now, page.js knows nothing about tasks)
- `handleToggle` and `handleDelete` defined in TaskBoard, passed down as callback props
- `TaskList` threads `onToggle`/`onDelete` through — binds task id so `TaskCard` gets simple `() => void` callbacks
- `TaskCard` grows toggle button (with animated checkmark SVG) and hover-reveal delete button
- Immutable update patterns: `map` to toggle, `filter` to delete — never mutate state directly
- page.js is now a pure Server Component layout wrapper — no data, no interactivity

### Module 2 — 2026-04-08
- Created `TaskBoard` as first Client Component — `'use client'` + `useState` for active filter
- Filter buttons (All/Active/Done) with live count badges — derived state, no extra useState
- Conditional rendering: `done && <Badge />` pattern, filter-specific empty state messages
- `TaskList` updated to accept `emptyMessage` prop — same component, different behavior via props
- `TaskCard` updated with status badge (conditional `{done && ...}` JSX)
- Full app architecture planned and committed to `docs/architecture.md`

### Module 1 — 2026-04-08
- Created `TaskCard` and `TaskList` as Server Components (no `'use client'` needed — no interactivity yet)
- Established dark glassmorphism design language: `bg-slate-800/60 backdrop-blur-sm border border-slate-700/50`
- Wired up hardcoded tasks array in `page.js`; real state comes in Module 4
- App vision: full productivity hub — tasks, notes, projects, calendar, localStorage persistence
