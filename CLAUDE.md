# Task Manager — Claude Code Context

## Project
React workshop: building a Task Manager app across 7 modules to learn React fundamentals.
Next.js 16 App Router · React 19 · Tailwind CSS v4 · JavaScript (no TypeScript)

## Stack & Structure
- `src/app/page.js` — main route
- `src/app/layout.js` — root layout wrapper
- `src/components/` — reusable components (Server or Client, decided per file)
- Server Components by default — add `'use client'` only when interactivity needed
- Import alias: `@/*` maps to `src/*`

## Code Style
- Tailwind utility classes only — no custom CSS except `@import "tailwindcss"` in globals.css
- Functional components, named exports preferred
- Props destructured in function signature
- One component per file
- Clear, descriptive variable names

## Workflow
- Read this file at session start
- After each module: `git add . && git commit -m "Module X: description"`
- End of session: update `docs/progress.md`
- Reference `docs/learning-log.md` when explaining concepts

## Key Rules
- Every `useState` / `useEffect` requires `'use client'` at top of file
- Keys on `.map()` list items — never use array index as key if list changes
- State updates are immutable — spread/copy, never mutate directly
- Understand every line before keeping it — no blind paste

## Docs
- `docs/progress.md` — module checklist and session notes
- `docs/learning-log.md` — concepts learned, patterns, React mental models
- `docs/core-memories.md` — key decisions, gotchas, things to remember across sessions
- `docs/architecture.md` — component tree and data flow as it evolves

## @imports
- @docs/progress.md — check what's done and what's next
- @docs/learning-log.md — review concepts already covered
- @docs/core-memories.md — recall key decisions and gotchas
