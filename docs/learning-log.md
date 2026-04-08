# Learning Log

Track React/Next.js concepts as you learn them. Claude Code updates this after each module.

## Concepts Covered

### Module 3: Props & Data Flow

**Callback props — events flow up, data flows down**
React has one-way data flow: data goes parent → child via props. But what about user actions that need to change parent state? The parent passes a *function* as a prop. The child calls it. The state update happens where the state lives.

```
TaskBoard (owns state, defines handlers)
  └── TaskList (receives and threads callbacks)
        └── TaskCard (calls the callbacks on user action)
```

This is the core React mental model: **state flows down as data, events bubble up as function calls.**

**Defining callbacks in the state owner**
The handler always lives in the same component as the state it updates — because only that component can call its own setter:
```js
// In TaskBoard — only TaskBoard can call setTasks
function handleToggle(id) {
  console.log('toggle', id);
  setTasks(tasks.map((task) =>
    task.id === id ? { ...task, done: !task.done } : task
  ));
}
```

**Binding ids at the list level**
TaskCard shouldn't need to know about task ids — it just calls `onToggle()`. The id gets bound one level up, in TaskList's `.map()`:
```js
// In TaskList — close over task.id in the callback
<TaskCard
  onToggle={() => onToggle(task.id)}
  onDelete={() => onDelete(task.id)}
/>
// TaskCard calls onToggle() with no arguments — TaskList already baked in the id
```
This keeps TaskCard clean and reusable. It doesn't care what id means.

**Immutable state updates**
Never mutate state directly — always return a new array or object.

Toggle (update one item):
```js
// ❌ Mutates — React won't detect the change, no re-render
tasks[index].done = true;

// ✅ Returns a new array with the one item replaced
setTasks(tasks.map((task) =>
  task.id === id ? { ...task, done: !task.done } : task
));
// { ...task } spreads all existing fields, then done: !task.done overrides just that one
```

Delete (remove one item):
```js
// ✅ Returns a new array without the deleted task
setTasks(tasks.filter((task) => task.id !== id));
```

**`group-hover` for hover-reveal UI**
The delete button is hidden by default (`opacity-0`) and fades in when the card is hovered (`group-hover:opacity-100`). Using opacity instead of `display:none` keeps the layout stable — no elements jumping around on hover:
```js
<div className="group ...">           {/* parent gets group */}
  <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-150">
    ×
  </button>
</div>
```

**`aria-label` on icon buttons**
Buttons with no visible text need an `aria-label` for screen readers and accessibility tools:
```js
<button aria-label="Delete task"> <svg>...</svg> </button>
```

### Module 2: Rendering Techniques

**Conditional rendering — three patterns**

1. `&&` short-circuit — render something or nothing:
```js
{done && <span>Done</span>}
// If done is false, React renders nothing. If true, renders the span.
```

2. Ternary — render one thing or another:
```js
{done ? <DoneBadge /> : <ActiveDot />}
```

3. Early return — bail out of the whole component:
```js
if (tasks.length === 0) {
  return <EmptyState />;
}
return <ul>...</ul>;
```
Use early return for "guard clauses" — when one condition changes everything about what renders.

**`.map()` — rendering lists from arrays**
`.map()` transforms an array of data into an array of JSX elements. React flattens that array into the DOM.
```js
tasks.map((task) => (
  <li key={task.id}>
    <TaskCard title={task.title} done={task.done} />
  </li>
))
```
Rule: the `key` goes on the outermost element returned by the callback — here that's `<li>`, not `<TaskCard>`.

**Derived state — compute, don't duplicate**
If a value can be calculated from existing state, don't put it in its own `useState`. Just compute it during render.
```js
// ❌ Don't do this:
const [filteredTasks, setFilteredTasks] = useState([]);

// ✅ Do this — recalculates automatically when activeFilter or tasks changes:
const visibleTasks = tasks.filter(currentFilter.match);
```
This keeps state minimal and prevents values from getting out of sync.

**Server vs Client Components — the boundary**
The App Router renders everything on the server by default. When you add `'use client'`, you're saying "this component and everything it imports needs to run in the browser."

Key rule: a Server Component can import and render a Client Component, but a Client Component **cannot** import a Server Component directly. The boundary only goes one direction.

```
page.js (Server) → TaskBoard (Client) → TaskList → TaskCard
                                        ↑ these now run on the client too
```

In practice: push `'use client'` as far down the tree as possible. Only the parts that truly need interactivity should be Client Components.

**`useState` preview (covered fully in Module 4)**
`useState` takes an initial value and returns `[currentValue, setter]`. Calling the setter causes React to re-render the component with the new value.
```js
const [activeFilter, setActiveFilter] = useState('All');
// activeFilter = 'All' initially
// calling setActiveFilter('Done') → re-render with activeFilter = 'Done'
```

**Props with default values**
Give props a default so the component works with or without them:
```js
export function TaskList({ tasks, emptyMessage = "No tasks yet." }) { ... }
// Caller can omit emptyMessage — it falls back to the default
```

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
