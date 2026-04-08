'use client'

// TaskCard — Client Component
// Rich card: priority indicator, due date with overdue detection, tag pills, animated toggle/delete.
// Receives a full task object + () => void callbacks (id already bound by TaskList).

import { motion, AnimatePresence } from 'framer-motion';

// Priority config — dot color and left-border accent per level
const PRIORITY = {
  high:   { dot: 'bg-red-400',    border: 'border-l-red-500/70',   label: 'High' },
  medium: { dot: 'bg-amber-400',  border: 'border-l-amber-500/70', label: 'Medium' },
  low:    { dot: 'bg-slate-500',  border: 'border-l-slate-600/50', label: 'Low' },
};

// Tag pill colors — deterministic by hashing the tag string so the same tag
// always gets the same color across renders
const TAG_PALETTE = [
  'bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/25',
  'bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/25',
  'bg-teal-500/20   text-teal-300   ring-1 ring-teal-500/25',
  'bg-pink-500/20   text-pink-300   ring-1 ring-pink-500/25',
  'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/25',
  'bg-amber-500/20  text-amber-300  ring-1 ring-amber-500/25',
];

function tagColor(tag) {
  let h = 0;
  for (const c of tag) h = (h * 31 + c.charCodeAt(0)) % TAG_PALETTE.length;
  return TAG_PALETTE[h];
}

// Format a YYYY-MM-DD string → "Apr 8" and flag overdue
function useDueDate(dateStr, done) {
  if (!dateStr) return null;
  const taskDate = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isOverdue = !done && taskDate < today;
  const formatted = taskDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return { formatted, isOverdue };
}

export function TaskCard({ task, onToggle, onDelete }) {
  const { title, done, priority, dueDate, tags } = task;
  const p = PRIORITY[priority] ?? PRIORITY.low;
  const due = useDueDate(dueDate, done);

  return (
    // whileHover lifts the card; Tailwind handles color/shadow transitions
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`group relative flex items-start gap-3 rounded-xl bg-slate-700/50 backdrop-blur-sm border border-slate-600/40 border-l-2 ${p.border} px-4 pt-3.5 pb-3.5 shadow-md shadow-black/20 hover:bg-slate-700/70 hover:shadow-lg hover:shadow-black/30 transition-colors duration-200`}
    >

      {/* ── Toggle button ─────────────────────────────── */}
      <button
        onClick={onToggle}
        aria-label={done ? 'Mark as not done' : 'Mark as done'}
        className={`mt-0.5 h-5 w-5 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
          done
            ? 'bg-emerald-500 border-emerald-500 shadow-md shadow-emerald-500/30'
            : 'border-slate-500 hover:border-emerald-400 hover:bg-emerald-400/10'
        }`}
      >
        {/* Checkmark draws in with pathLength animation when task is completed */}
        <AnimatePresence>
          {done && (
            <motion.svg
              key="check"
              className="h-2.5 w-2.5 text-white"
              fill="none"
              viewBox="0 0 10 10"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.4 }}
              transition={{ duration: 0.15 }}
            >
              <motion.path
                d="M1.5 5l2.5 2.5 4.5-4.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              />
            </motion.svg>
          )}
        </AnimatePresence>
      </button>

      {/* ── Main content ──────────────────────────────── */}
      <div className="flex-1 min-w-0">

        {/* Title row — priority dot + title text */}
        <div className="flex items-center gap-2">
          <div
            className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${p.dot}`}
            title={`${p.label} priority`}
          />
          <span className={`text-sm font-medium leading-snug transition-all duration-300 ${
            done ? 'line-through text-slate-500' : 'text-white'
          }`}>
            {title}
          </span>
        </div>

        {/* Meta row — due date + tags (only rendered when either exists) */}
        {(due || (tags && tags.length > 0)) && (
          <div className="flex items-center flex-wrap gap-2 mt-2">

            {/* Due date */}
            {due && (
              <span className={`flex items-center gap-1 text-[11px] font-medium ${
                due.isOverdue ? 'text-red-400' : 'text-slate-400'
              }`}>
                {/* Calendar mini-icon */}
                <svg className="h-3 w-3 flex-shrink-0" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="2.5" width="10" height="9" rx="1.5" />
                  <path d="M1 5.5h10M4 1v3M8 1v3" />
                </svg>
                {due.formatted}
                {due.isOverdue && (
                  <span className="ml-0.5 rounded-sm bg-red-500/20 px-1 text-red-400 text-[10px] font-semibold">overdue</span>
                )}
              </span>
            )}

            {/* Tag pills */}
            {tags?.map((tag) => (
              <span
                key={tag}
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${tagColor(tag)}`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Right-side actions ────────────────────────── */}
      <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">

        {/* Done badge — animates in when task is marked complete */}
        <AnimatePresence>
          {done && (
            <motion.span
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.2 }}
              className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 ring-1 ring-emerald-500/30"
            >
              Done
            </motion.span>
          )}
        </AnimatePresence>

        {/* Delete — hidden until card hover, fades in via group-hover */}
        <button
          onClick={onDelete}
          aria-label="Delete task"
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex h-6 w-6 items-center justify-center rounded-md text-slate-500 hover:bg-red-500/15 hover:text-red-400"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <path d="M2 2l10 10M12 2L2 12" />
          </svg>
        </button>

      </div>
    </motion.div>
  );
}
