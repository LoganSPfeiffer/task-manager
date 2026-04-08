'use client'

// TaskBoard — Client Component
// Owns the tasks array and filter state. Defines toggle/delete handlers.
// Passes the full tasks list to StatsBar (always shows overall stats)
// and the filtered list to TaskList (shows only what matches the active filter).

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TaskList } from '@/components/TaskList';
import { StatsBar } from '@/components/StatsBar';

const INITIAL_TASKS = [
  {
    id: 1,
    title: 'Design the navigation bar layout',
    done: true,
    priority: 'medium',
    dueDate: '2026-04-06',
    tags: ['design', 'ui'],
  },
  {
    id: 2,
    title: 'Implement Framer Motion page transitions',
    done: false,
    priority: 'high',
    dueDate: '2026-04-08',
    tags: ['frontend', 'animations'],
  },
  {
    id: 3,
    title: 'Add localStorage sync for tasks',
    done: false,
    priority: 'high',
    dueDate: '2026-04-07',   // yesterday — shows overdue styling
    tags: ['storage', 'feature'],
  },
  {
    id: 4,
    title: 'Write module documentation and learning notes',
    done: false,
    priority: 'low',
    dueDate: '2026-04-15',
    tags: ['docs', 'learning'],
  },
  {
    id: 5,
    title: 'Set up App Router page structure',
    done: false,
    priority: 'medium',
    dueDate: '2026-04-10',
    tags: ['architecture', 'routing'],
  },
];

const FILTERS = [
  { label: 'All',    match: () => true },
  { label: 'Active', match: (t) => !t.done },
  { label: 'Done',   match: (t) => t.done },
];

export function TaskBoard() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [activeFilter, setActiveFilter] = useState('All');

  // Immutable toggle — spread old task, flip done
  function handleToggle(id) {
    console.log('toggle', id);
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, done: !t.done } : t));
  }

  // Immutable delete — filter out the removed task
  function handleDelete(id) {
    console.log('delete', id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  const currentFilter = FILTERS.find((f) => f.label === activeFilter);
  const visibleTasks  = tasks.filter(currentFilter.match);

  const counts = {
    All:    tasks.length,
    Active: tasks.filter((t) => !t.done).length,
    Done:   tasks.filter((t) => t.done).length,
  };

  return (
    // Fade in on mount — wraps everything inside the TaskBoard section
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >

      {/* Stats — always shows overall numbers, not filtered */}
      <StatsBar tasks={tasks} />

      {/* Filter bar */}
      <div className="flex gap-2 mb-5">
        {FILTERS.map(({ label }) => {
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

      {/* Task list — filtered */}
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

    </motion.div>
  );
}
