'use client'

// TaskBoard — Client Component
// Owns the active filter state and renders filter buttons + filtered task list.
// 'use client' is required here because we use useState (browser-only).
// This is our first Client Component — everything below it in the tree also runs on the client.

import { useState } from 'react';
import { TaskList } from '@/components/TaskList';

// Filter definitions — label shown in the button, and a function that decides
// whether a given task passes the filter.
const FILTERS = [
  { label: 'All',    match: () => true },
  { label: 'Active', match: (task) => !task.done },
  { label: 'Done',   match: (task) => task.done },
];

export function TaskBoard({ tasks }) {
  // useState returns [currentValue, setterFn].
  // React re-renders this component whenever setFilter is called.
  const [activeFilter, setActiveFilter] = useState('All');

  // Derived value — no extra state needed, just compute from what we have.
  // When activeFilter changes, this recalculates automatically on re-render.
  const currentFilter = FILTERS.find((f) => f.label === activeFilter);
  const visibleTasks = tasks.filter(currentFilter.match);

  // Count helpers for the badges on each filter button
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
              {/* Count badge — conditional rendering: only show when count > 0 */}
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

      {/* Filtered task list — empty state is handled inside TaskList */}
      <TaskList tasks={visibleTasks} emptyMessage={
        activeFilter === 'Done'
          ? 'No completed tasks yet.'
          : activeFilter === 'Active'
          ? 'All caught up! No active tasks.'
          : 'No tasks yet. Add one to get started.'
      } />

    </div>
  );
}
