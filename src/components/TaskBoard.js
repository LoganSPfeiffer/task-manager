// ══════════════════════════════════════════════════════════════
// COMPONENT: TaskBoard  ← the "brain" of the app
// PURPOSE:   Owns all task state. Passes data DOWN to child
//            components as props. Receives events UP from children
//            via callback props. Persists state to localStorage so
//            tasks survive a page refresh.
//            This is the "lifting state up" pattern — state lives
//            in the highest component that needs to share it, and
//            every change flows back up through callbacks.
// TYPE:      Client Component ('use client') — needs useState and
//            useEffect, both of which are browser-only APIs.
// PROPS:     none — TaskBoard is the root of the interactive tree.
//            page.js renders it but passes nothing in; all data
//            originates here.
// ══════════════════════════════════════════════════════════════
'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TaskList }    from '@/components/TaskList';
import { TaskStats }   from '@/components/TaskStats';
import { AddTaskForm } from '@/components/AddTaskForm';

// ── DEMO DATA ──────────────────────────────────────────────────
// Shown only on a user's very first visit (before localStorage has
// any saved data). Once the user adds or modifies tasks, localStorage
// takes over and these are never used again.
const DEMO_TASKS = [
  {
    id: 'demo-1',
    title: 'Design the navigation bar layout',
    done: true,
    priority: 'medium',
    dueDate: '2026-04-06',
    tags: ['design', 'ui'],
  },
  {
    id: 'demo-2',
    title: 'Implement Framer Motion page transitions',
    done: false,
    priority: 'high',
    dueDate: '2026-04-08',
    tags: ['frontend', 'animations'],
  },
  {
    id: 'demo-3',
    title: 'Add localStorage sync for tasks',
    done: false,
    priority: 'high',
    dueDate: '2026-04-07',
    tags: ['storage', 'feature'],
  },
  {
    id: 'demo-4',
    title: 'Write module documentation and learning notes',
    done: false,
    priority: 'low',
    dueDate: '2026-04-15',
    tags: ['docs', 'learning'],
  },
  {
    id: 'demo-5',
    title: 'Set up App Router page structure',
    done: false,
    priority: 'medium',
    dueDate: '2026-04-10',
    tags: ['architecture', 'routing'],
  },
];

// Filter definitions — label shown in the button, and a predicate
// function that decides whether a given task passes the filter.
const FILTERS = [
  { label: 'All',    match: () => true },
  { label: 'Active', match: (t) => !t.done },
  { label: 'Done',   match: (t) => t.done },
];

export function TaskBoard() {

  // ── STATE ──────────────────────────────────────────────────

  // Lazy initializer: the arrow function passed to useState runs ONLY on the
  // very first render, never on re-renders. This is important for localStorage
  // because reading from it on every render would be wasteful.
  //
  // typeof window === 'undefined' is the SSR guard.
  // Next.js renders components on the SERVER before sending HTML to the browser.
  // The server has no window, no document, and no localStorage — accessing them
  // without this guard throws a ReferenceError and crashes the server render.
  // When window IS defined (i.e. we're in the browser), we safely read localStorage.
  const [tasks, setTasks] = useState(() => {
    if (typeof window === 'undefined') return DEMO_TASKS;
    const saved = localStorage.getItem('focus:tasks');
    // JSON.parse turns the stored string back into a JavaScript array.
    // The fallback to DEMO_TASKS runs on first ever visit (nothing saved yet).
    return saved ? JSON.parse(saved) : DEMO_TASKS;
  });

  // The active filter lives in its own useState because it changes independently
  // of task data. A user clicking "Done" filter doesn't touch any task object.
  // Mixing it into the tasks array or deriving it from tasks would be wrong —
  // it's purely UI state.
  const [activeFilter, setActiveFilter] = useState('All');

  // ── EFFECTS ────────────────────────────────────────────────

  // Persist tasks to localStorage after every render where tasks changed.
  // The dependency array [tasks] is the key: React compares [tasks] to its
  // value from the previous render. If tasks didn't change (e.g. only the
  // filter changed), this effect is SKIPPED — no unnecessary write.
  // This is the canonical pattern for syncing React state to an external system.
  useEffect(() => {
    localStorage.setItem('focus:tasks', JSON.stringify(tasks));
  }, [tasks]);

  // ── DERIVED VALUES ─────────────────────────────────────────

  // These are NOT stored in state. They are computed on every render from
  // the two pieces of state we already have (tasks + activeFilter).
  // Storing derived values in a third useState would mean keeping three things
  // in sync manually — a classic source of stale-data bugs in React.
  // By computing them inline, they are always guaranteed to be up to date.
  const currentFilter = FILTERS.find((f) => f.label === activeFilter);
  const visibleTasks  = tasks.filter(currentFilter.match);

  // Count badges on the filter buttons — derived from tasks, never stored.
  const counts = {
    All:    tasks.length,
    Active: tasks.filter((t) => !t.done).length,
    Done:   tasks.filter((t) => t.done).length,
  };

  // ── HANDLERS ───────────────────────────────────────────────
  // All handlers use the functional updater (prev) => ... rather than
  // referencing `tasks` directly. React batches state updates inside event
  // handlers, so `tasks` inside a handler could be a stale snapshot from
  // before the batch. The functional form always receives the latest value.

  function handleAdd(title) {
    // crypto.randomUUID() produces a globally unique identifier.
    // Using array index as an ID is unsafe — when a task is deleted,
    // indices shift and React's key-based reconciliation breaks, causing
    // wrong tasks to be highlighted or animated.
    setTasks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title,
        done: false,
        priority: 'medium',
        dueDate: null,
        tags: [],
      },
    ]);
  }

  function handleToggle(id) {
    // .map() returns a brand-new array — React sees a new reference and
    // schedules a re-render. Mutating the existing array (task.done = true)
    // would leave the same reference in memory; React's shallow comparison
    // would see "no change" and skip the re-render, leaving the UI out of sync.
    // { ...t } spreads all existing fields; done: !t.done overrides just that one.
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  function handleDelete(id) {
    // .filter() returns a new array containing only tasks where id does NOT match.
    // Same immutability principle — new reference = React knows to re-render.
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function handleClearDone() {
    // Remove every completed task in one operation.
    // !t.done keeps only tasks that are still active.
    setTasks((prev) => prev.filter((t) => !t.done));
  }

  // ── RENDER ─────────────────────────────────────────────────

  return (
    // motion.div fades the board in on mount. initial is the starting state
    // (invisible, shifted down 12px); animate is the target (visible, in place).
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >

      {/* TaskStats receives the FULL unfiltered tasks array so counts always show
          overall progress regardless of which filter is active.
          onClearDone is a callback prop — TaskStats can't modify tasks directly
          because it doesn't own that state. It signals up; TaskBoard acts. */}
      <TaskStats tasks={tasks} onClearDone={handleClearDone} />

      {/* AddTaskForm only needs onAdd. Passing the minimum required props reduces
          coupling — AddTaskForm has no reason to know about existing tasks. */}
      <AddTaskForm onAdd={handleAdd} />

      {/* ── Filter bar ──────────────────────────────────────── */}
      <div className="flex gap-2 mb-5">
        {FILTERS.map(({ label }) => {
          // isActive is a derived boolean — not stored in state, just computed
          // inline from activeFilter. No need to store "which button is active"
          // separately when we already store activeFilter as a string.
          const isActive = activeFilter === label;
          return (
            <motion.button
              key={label}
              onClick={() => setActiveFilter(label)}
              whileTap={{ scale: 0.94 }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'bg-slate-700/60 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
              }`}
            >
              {label}
              {/* Conditional render: count badge only shown when count > 0.
                  An empty badge on the "Done" button (showing "0") adds visual
                  noise with no benefit — hiding it keeps the UI clean. */}
              {counts[label] > 0 && (
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${
                  isActive ? 'bg-white/25 text-white' : 'bg-slate-600 text-slate-300'
                }`}>
                  {counts[label]}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* TaskList receives only the FILTERED tasks — it doesn't need the full list.
          Callbacks are passed as-is; TaskList binds each task's id before passing
          them on to TaskCard, so TaskCard receives clean () => void functions
          and never needs to know about the task data model. */}
      <TaskList
        tasks={visibleTasks}
        onToggle={handleToggle}
        onDelete={handleDelete}
        emptyMessage={
          activeFilter === 'Done'
            ? 'No completed tasks yet.'
            : activeFilter === 'Active'
            ? 'All caught up! No active tasks.'
            : 'No tasks yet — add one above.'
        }
      />

    </motion.div>
  );
}
