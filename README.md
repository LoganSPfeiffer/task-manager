# Focus — Personal Task Manager

A full-featured personal productivity app built with **Next.js 16**, **React 19**, and **Tailwind CSS v4**. Built as an independent project following a 7-module React workshop.

## Features

| Feature | Description |
|---------|-------------|
| **Add tasks** | Controlled form with blank-input validation |
| **Toggle done** | Animated checkmark; strikethrough + dimmed title |
| **Delete tasks** | Smooth exit animation, siblings reflow |
| **Filter view** | All / Active / Done with live count badges |
| **Stats bar** | Total, active, done counts + animated progress bar |
| **Clear completed** | One-click removal of all done tasks |
| **Persist on refresh** | localStorage sync via useEffect |

## Setup

```bash
git clone https://github.com/LoganSPfeiffer/task-manager.git
cd task-manager
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Design Decisions

**Color palette** — Dark glassmorphism theme using `slate-700/800` backgrounds with semi-transparency (`/50`, `/60` opacity). Accent colors are an indigo→purple gradient throughout, with priority-coded left borders on task cards (red = high, amber = medium, slate = low).

**Animations** — Framer Motion handles all transitions:
- `layoutId="tab-indicator"` slides the nav underline between tabs as a shared element transition
- `AnimatePresence mode="popLayout"` + `layout` on list items means deleted tasks collapse smoothly and siblings reflow without jumping
- `pathLength: 0 → 1` on the checkmark SVG path makes it feel like the check is being drawn by hand

**Tag colors** — A deterministic hash of the tag string picks a consistent color from a palette. The same tag always gets the same color without storing color data in the task object.

**Component split** — Each component has a single responsibility. `TaskBoard` is the only component that calls `setTasks`. Every other component either receives data (props down) or fires a callback (events up), never touching state directly.

## Project Structure

```
src/
├── app/
│   ├── layout.js          Root layout — fonts, metadata
│   ├── page.js            Home route — Server Component shell
│   └── globals.css        @import "tailwindcss" only
└── components/
    ├── NavBar.js           Tab navigation with layoutId animation
    ├── TaskBoard.js        Brain — owns all state, localStorage, handlers
    ├── TaskStats.js        Counts, progress bar, clear-completed button
    ├── AddTaskForm.js      Controlled form with validation
    ├── TaskList.js         AnimatePresence list with delete animations
    └── TaskCard.js         Rich card — priority, due date, tags, toggle/delete
```

## AI Usage Log

- **Architecture planning** — Asked Claude Code to plan the full 7-module component architecture (TaskBoard owning state, callback prop pattern, localStorage in useEffect). Studied each decision before keeping it; rewrote all comments in my own words to explain the *why* rather than the *what*.

- **Framer Motion animations** — Used Claude Code to implement `layoutId` for the nav underline, `AnimatePresence + layout` for the delete animation, and `pathLength` for the SVG checkmark. Read through the framer-motion docs for each API to understand how shared-element transitions work before accepting the code.

- **localStorage SSR guard** — Asked Claude Code why `typeof window === 'undefined'` is needed in the lazy initializer. Learned that Next.js renders components on the server before sending HTML to the browser, so `window` doesn't exist during that phase — without the guard, accessing `localStorage` would crash the server render.

- **Comment depth** — Used Claude Code to generate initial comment drafts, then rewrote each one in my own words, focusing on explaining *why* the pattern is used rather than *what* the code does (e.g. why `.map()` returns a new array instead of mutating, why derived values shouldn't be stored as state).
