# Architecture

Full vision: personal productivity hub inspired by Upbase/Notion.
Built incrementally across 7 modules. This doc tracks both what exists now and the full planned design.

---

## Pages & Routes (Planned)

| Route | Page | Purpose |
|-------|------|---------|
| `/` | Dashboard | Overview widgets: today's tasks, recent notes, project progress, mini calendar |
| `/tasks` | Tasks | Kanban board (To Do / In Progress / Done), filters, priorities, tags, due dates |
| `/notes` | Notes | Note-taking with categories (school, personal, work), search |
| `/projects` | Projects | Project tracker with progress bars, subtasks, deadlines |
| `/calendar` | Calendar | Monthly/weekly view synced with task due dates |

---

## Data Models (Planned)

```js
// Task
{
  id: string,         // crypto.randomUUID()
  title: string,
  done: boolean,
  status: 'todo' | 'in-progress' | 'done',
  priority: 'low' | 'medium' | 'high',
  tags: string[],
  dueDate: string | null,   // ISO date string
  projectId: string | null,
  createdAt: string,
}

// Note
{
  id: string,
  title: string,
  content: string,
  category: 'school' | 'personal' | 'work',
  tags: string[],
  createdAt: string,
  updatedAt: string,
}

// Project
{
  id: string,
  title: string,
  description: string,
  color: string,       // for visual grouping
  deadline: string | null,
  subtasks: Subtask[],
  createdAt: string,
}

// Subtask
{
  id: string,
  title: string,
  done: boolean,
}

// CalendarEvent (derived — not separately stored, computed from tasks)
// tasks with a dueDate appear on the calendar automatically
```

---

## Persistence Strategy

All state stored in `localStorage` under namespaced keys:

```
productivity-hub:tasks
productivity-hub:notes
productivity-hub:projects
```

Custom hook `useLocalStorage(key, initialValue)` wraps `useState` + sync.
Introduced in Module 6 (Effects). Later upgrade path: swap localStorage reads/writes for API calls without touching component code.

---

## Full Component Tree (Planned)

```
src/app/layout.js                    Server — root layout, fonts, metadata
├── Sidebar                          Client — nav links, collapsible, active route highlight
│   ├── SidebarLink (×5)             each page link with icon
│   └── CollapseToggle               Client — toggle sidebar width
│
├── src/app/page.js                  Dashboard (Server)
│   ├── DashboardWidget              Server — reusable widget card shell
│   ├── TodayTasksWidget             reads tasks from store, shows due today
│   ├── RecentNotesWidget            last 3 notes
│   ├── ProjectProgressWidget        progress bars per project
│   └── MiniCalendarWidget           Client — month grid, highlights task dates
│
├── src/app/tasks/page.js            Tasks page (Server shell)
│   ├── TaskBoard                    Client — owns filter/sort state
│   │   ├── FilterBar                filter buttons (All/Active/Done/priority)
│   │   ├── SortMenu                 dropdown for sort order
│   │   └── TaskList                 maps tasks → TaskCard
│   │       └── TaskCard             displays one task, done/priority/tag badges
│   └── AddTaskForm                  Client — controlled input, submit adds task
│
├── src/app/notes/page.js            Notes page (Server shell)
│   ├── NoteList                     maps notes → NoteCard
│   │   └── NoteCard                 title, preview, category badge
│   ├── NoteEditor                   Client — textarea, title, category select
│   └── CategoryFilter               Client — filter by category
│
├── src/app/projects/page.js         Projects page
│   ├── ProjectList → ProjectCard    progress bar, deadline, subtask count
│   └── SubtaskList → SubtaskItem    checkboxes per subtask
│
└── src/app/calendar/page.js         Calendar page
    ├── CalendarGrid                 Client — month/week grid
    ├── CalendarDay                  shows dot indicators for tasks due that day
    └── EventList                    tasks for selected date
```

---

## Current Component Tree (Module 2)

```
src/app/layout.js           Server — root layout
└── src/app/page.js         Server — hardcoded tasks
    └── TaskBoard            Client — filter state (All/Active/Done)
        └── TaskList         Server-compatible — maps tasks → TaskCard
            └── TaskCard     displays title, done indicator, status badge
```

---

## State Location Plan (by Module)

| Module | What | Where |
|--------|------|-------|
| 1–2 | Tasks (hardcoded) | `page.js` constant |
| 3 | Filter selection | `TaskBoard` (prop drill intro) |
| 4 | Tasks in real state, add/complete/delete | `TaskBoard` → lifted to page |
| 5 | AddTaskForm, controlled inputs | `AddTaskForm` |
| 6 | localStorage sync | custom `useLocalStorage` hook |
| 7 | Shared state across widgets | Context or lifted to layout |

---

## Design System

**Color tokens (Tailwind classes)**
- Background: `from-slate-900 via-slate-800 to-slate-900` gradient
- Glass card: `bg-slate-800/60 backdrop-blur-sm border border-slate-700/50`
- Glass panel: `bg-slate-800/40 border border-slate-700/40`
- Text primary: `text-white` / `text-slate-200`
- Text muted: `text-slate-400` / `text-slate-500`
- Accent: `indigo-500` (active states, buttons, links)
- Success/done: `emerald-500`
- Warning/overdue: `amber-500`
- Danger/delete: `red-500`

**Priority colors**
- High: `red-400`
- Medium: `amber-400`
- Low: `slate-400`

**Animations (Tailwind transitions)**
- Hover lift: `hover:-translate-y-0.5 transition-all duration-200`
- Button press: `active:scale-95`
- Filter/badge fade: `transition-colors duration-200`
- Page transitions: CSS opacity fade (Module 6+)

---

## File Map

```
src/
├── app/
│   ├── layout.js              Root layout — fonts, metadata, body wrapper
│   ├── page.js                Dashboard / home route
│   ├── globals.css            @import "tailwindcss" only
│   ├── tasks/page.js          (planned Module 4+)
│   ├── notes/page.js          (planned Module 5+)
│   ├── projects/page.js       (planned Module 6+)
│   └── calendar/page.js       (planned Module 7)
├── components/
│   ├── TaskCard.js            Single task display with badges
│   ├── TaskList.js            Maps tasks array → TaskCards, empty state
│   └── TaskBoard.js           Client — filter state + filter bar
└── hooks/                     (planned Module 6)
    └── useLocalStorage.js     useState synced to localStorage
```
