# Progress Tracker

## Modules
- [x] **Setup** — Scaffold, clean boilerplate, dev server running
- [x] **Module 1: Components & JSX** — Functions, JSX syntax, Tailwind, Server Components
- [ ] **Module 2: Rendering Techniques** — Conditional rendering, .map(), keys, Server vs Client
- [ ] **Module 3: Props & Data Flow** — One-way flow, callback props, 'use client'
- [ ] **Module 4: State & Rendering** — useState, immutable updates, re-render cycle
- [ ] **Module 5: State Structure & Forms** — Derived state, controlled inputs, form handling
- [ ] **Module 6: Effects** — useEffect, dependency array, cleanup, SSR window guard
- [ ] **Module 7: Lifting State** — Shared state, sibling communication, server-client boundary

## Session Notes

### Module 1 — 2026-04-08
- Created `TaskCard` and `TaskList` as Server Components (no `'use client'` needed — no interactivity yet)
- Established dark glassmorphism design language: `bg-slate-800/60 backdrop-blur-sm border border-slate-700/50`
- Wired up hardcoded tasks array in `page.js`; real state comes in Module 4
- App vision: full productivity hub — tasks, notes, projects, calendar, localStorage persistence
