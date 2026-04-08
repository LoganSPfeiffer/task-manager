'use client'

// TaskBoard — Client Component
// Owns the tasks array and the active filter.
// Defines toggle/delete handlers and passes them down as callback props.
// page.js is a Server Component and knows nothing about tasks — all data lives here.

import { useState } from 'react';
import { TaskList } from '@/components/TaskList';

const INITIAL_TASKS = [
  { id: 1, title: 'Read the React docs', done: true },
  { id: 2, title: 'Build a task manager', done: false },
  { id: 3, title: 'Learn Tailwind CSS', done: false },
  { id: 4, title: 'Understand Server vs Client Components', done: true },
  { id: 5, title: 'Add localStorage persistence', done: false },
];

const FILTERS = [
  { label: 'All',    match: () => true },
  { label: 'Active', match: (task) => !task.done },
  { label: 'Done',   match: (task) => task.done },
];

export function TaskBoard() {
  // Two independent pieces of state — tasks data and which filter is active.
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [activeFilter, setActiveFilter] = useState('All');

  // Immutable update: spread the old task object, override just the done field.
  // Never do task.done = !task.done — mutating state directly breaks React's
  // ability to detect changes and skips the re-render.
  function handleToggle(id) {
    console.log('toggle', id);
    setTasks(tasks.map((task) =>
      task.id === id ? { ...task, done: !task.done } : task
    ));
  }

  // Filter out the deleted task — returns a new array, never mutates the old one.
  function handleDelete(id) {
    console.log('delete', id);
    setTasks(tasks.filter((task) => task.id !== id));
  }

  // Derived values — computed fresh each render, no extra state needed.
  const currentFilter = FILTERS.find((f) => f.label === activeFilter);
  const visibleTasks = tasks.filter(currentFilter.match);

  const counts = {
    All:    tasks.length,
    Active: tasks.filter((t) => !t.done).length,
    Done:   tasks.filter((t) => t.done).length,
  };

  return (
    <div>

      {/* Filter bar */}
      <div className="flex gap-2 mb-5">
        {FILTERS.map(({ label }) => {
          const isActive = activeFilter === label;
          return (
            <button
              key={label}
              onClick={() => setActiveFilter(label)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                  : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
              }`}
            >
              {label}
              {counts[label] > 0 && (
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-600 text-slate-300'
                }`}>
                  {counts[label]}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Pass the handlers down as callback props.
          TaskList doesn't know what they do — it just forwards them to TaskCard. */}
      <TaskList
        tasks={visibleTasks}
        onToggle={handleToggle}
        onDelete={handleDelete}
        emptyMessage={
          activeFilter === 'Done'   ? 'No completed tasks yet.'
          : activeFilter === 'Active' ? 'All caught up! No active tasks.'
          : 'No tasks yet. Add one to get started.'
        }
      />

    </div>
  );
}
