# Learning Log

Track React/Next.js concepts as you learn them. Claude Code updates this after each module.

## Concepts Covered

### Module 1: Components & JSX

**React Components are just functions**
A component is a JS function that returns JSX. React calls it, gets the JSX back, and renders it to the DOM.
```js
export function TaskCard({ title, done }) {
  return <div>{title}</div>;
}
```

**JSX is syntactic sugar for `React.createElement`**
`<div className="foo">Hello</div>` compiles to `React.createElement('div', { className: 'foo' }, 'Hello')`. You write HTML-like syntax; the compiler handles the rest. Two key differences from HTML: `className` instead of `class`, and all tags must be closed.

**Props — passing data into a component**
Props are the arguments to your component function. Parent passes them as JSX attributes; child receives them as an object (usually destructured in the signature).
```js
// Parent passes data down:
<TaskCard title="Read docs" done={true} />

// Child receives via destructuring:
export function TaskCard({ title, done }) { ... }
```
Data only flows one direction: parent → child. Never the other way around.

**Named exports vs default exports**
- `export function TaskCard` → named export, imported as `import { TaskCard } from ...`
- `export default function Home` → default export, imported as `import Home from ...`
Convention here: named exports for components, default for page routes.

**Server Components (Next.js App Router default)**
Every component in the App Router is a Server Component unless you add `'use client'` at the top. Server Components render on the server — no JS sent to the browser for them, no access to browser APIs, no `useState`/`useEffect`. Perfect for static/display components like `TaskCard` and `TaskList`.

**Keys on `.map()` — why they matter**
React uses keys to identify which item in a list changed, was added, or removed. Without a stable key, React re-renders everything. Rules:
- Always put `key` on the outermost element returned by `.map()`
- The key must be unique among siblings
- Never use the array index as a key if the list can change order or have items removed

```js
tasks.map((task) => (
  <li key={task.id}>   // ✅ stable unique ID from the data
    <TaskCard ... />
  </li>
))
```

**Conditional className with template literals**
Use a ternary inside a template literal to conditionally apply Tailwind classes:
```js
className={`text-sm ${done ? "line-through text-slate-500" : "text-slate-200"}`}
```

**Tailwind `group` / `group-hover`**
Add `group` to a parent to let child elements respond to the parent's hover state:
```js
<div className="group ...">
  <span className="text-slate-400 group-hover:text-white">...</span>
</div>
```

**Glassmorphism pattern**
Frosted-glass card effect using Tailwind:
- `bg-slate-800/60` — semi-transparent dark fill (60% opacity)
- `backdrop-blur-sm` — blurs content behind the element
- `border border-slate-700/50` — subtle translucent border
- `shadow-lg` — depth

**`@/*` import alias**
`@/` maps to `src/`. So `import { TaskCard } from "@/components/TaskCard"` works from anywhere in the project.

## Patterns & Mental Models

- **Component tree**: page.js → TaskList → TaskCard. Data (tasks array) lives at the top and flows down via props.
- **Server by default**: Start every component as a Server Component. Only add `'use client'` when you need a browser feature (events, state, effects).
- **Hardcoded → state → server**: Module 1 hardcodes data. Module 4 lifts it into `useState`. Future modules could fetch it from a server/DB.

## Common Mistakes & Fixes

- Forgetting `key` on `.map()` list items — always add it to the outermost element in the callback, not deep inside
- Using `class` instead of `className` in JSX — JSX uses the DOM property name, not the HTML attribute
- Trying to use `useState` in a Server Component — add `'use client'` first, or extract the stateful piece into its own Client Component
