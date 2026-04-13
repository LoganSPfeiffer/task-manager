// ══════════════════════════════════════════════════════════════
// COMPONENT: TaskCard
// PURPOSE:   Displays a single task row with its title, priority
//            indicator, due date, tags, a toggle button, and a
//            delete button. This component is the bottom of the
//            prop chain — it receives data and callbacks from
//            TaskList and fires events back up, but it never
//            directly touches the task list or any shared state.
// TYPE:      Client Component ('use client') — uses onClick handlers
//            and framer-motion interactive animations (whileHover,
//            AnimatePresence), which require the browser.
// PROPS:
//   task     (object) — the full task object: { id, title, done,
//                        priority, dueDate, tags }
//   onToggle (fn)     — () => void. Called when the toggle button
//                        is clicked. Defined in TaskBoard; bound
//                        with this task's id in TaskList.
//   onDelete (fn)     — () => void. Called when the delete button
//                        is clicked. Same binding pattern as onToggle.
// ══════════════════════════════════════════════════════════════
'use client'

import { motion, AnimatePresence } from 'framer-motion';

// Priority config — maps a priority string to visual styles.
// Defined at module level (outside the component) so it's not
// recreated on every render. It never changes, so it doesn't
// need to live inside the function.
const PRIORITY = {
  high:   { dot: 'bg-red-400',   border: 'border-l-red-500/70',   label: 'High' },
  medium: { dot: 'bg-amber-400', border: 'border-l-amber-500/70', label: 'Medium' },
  low:    { dot: 'bg-slate-500', border: 'border-l-slate-600/50', label: 'Low' },
};

// Tag color palette — six distinct tinted pill styles.
const TAG_PALETTE = [
  'bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/25',
  'bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/25',
  'bg-teal-500/20   text-teal-300   ring-1 ring-teal-500/25',
  'bg-pink-500/20   text-pink-300   ring-1 ring-pink-500/25',
  'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/25',
  'bg-amber-500/20  text-amber-300  ring-1 ring-amber-500/25',
];

// tagColor — deterministic hash so the same tag string always maps to
// the same color across renders without storing color data in the task object.
function tagColor(tag) {
  let h = 0;
  for (const c of tag) h = (h * 31 + c.charCodeAt(0)) % TAG_PALETTE.length;
  return TAG_PALETTE[h];
}

// useDueDate — formats a YYYY-MM-DD string for display and detects overdue.
// Returns null if no date given.
function useDueDate(dateStr, done) {
  if (!dateStr) return null;
  // Appending 'T00:00:00' forces parsing in local time rather than UTC.
  // Without it, new Date('2026-04-07') is midnight UTC, which may appear
  // as the previous day in timezones behind UTC.
  const taskDate = new Date(dateStr + 'T00:00:00');
  const today    = new Date();
  today.setHours(0, 0, 0, 0);
  // A task is only overdue if it's both past due AND not yet completed.
  // Completed tasks have already been handled — showing them as overdue
  // would be misleading.
  const isOverdue = !done && taskDate < today;
  const formatted = taskDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return { formatted, isOverdue };
}

export function TaskCard({ task, onToggle, onDelete }) {
  const { title, done, priority, dueDate, tags } = task;

  // ?? PRIORITY.low: if a task somehow has an unknown priority string,
  // fall back to low styling rather than crashing.
  const p   = PRIORITY[priority] ?? PRIORITY.low;
  const due = useDueDate(dueDate, done);

  return (
    // whileHover lifts the card 2px with a spring animation.
    // Tailwind handles color/shadow changes (transition-colors duration-200)
    // because framer-motion and Tailwind target different CSS properties —
    // transforms vs. color/background — so they don't conflict.
    // border-l-2 + priority border color gives each card a visual priority cue.
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`group relative flex items-start gap-3 rounded-xl bg-slate-700/50 backdrop-blur-sm border border-slate-600/40 border-l-2 ${p.border} px-4 pt-3.5 pb-3.5 shadow-md shadow-black/20 hover:bg-slate-700/70 hover:shadow-lg hover:shadow-black/30 transition-colors duration-200`}
    >

      {/* ── Toggle button ─────────────────────────────────── */}
      {/* Clicking fires onToggle() — a () => void bound by TaskList with this
          task's id. TaskCard doesn't know or need to know the id. The state
          update happens in TaskBoard, which owns the tasks array. */}
      <button
        onClick={onToggle}
        aria-label={done ? 'Mark as not done' : 'Mark as done'}
        className={`mt-0.5 h-5 w-5 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
          done
            ? 'bg-emerald-500 border-emerald-500 shadow-md shadow-emerald-500/30'
            : 'border-slate-500 hover:border-emerald-400 hover:bg-emerald-400/10'
        }`}
      >
        {/* AnimatePresence enables the exit animation when `done` flips to false.
            Without it, React removes the checkmark from the DOM immediately and
            the exit animation never plays. */}
        <AnimatePresence>
          {/* Conditional render: checkmark SVG only exists in the DOM when done is true. */}
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
              {/* pathLength animation: 0 → 1 draws the stroke progressively,
                  making it feel like the checkmark is being hand-drawn. */}
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

      {/* ── Main content ────────────────────────────────────── */}
      <div className="flex-1 min-w-0">

        {/* Title row */}
        <div className="flex items-center gap-2">
          {/* Priority dot — purely decorative; the aria-label on the toggle carries
              semantic meaning. The dot gives a quick visual scan of urgency. */}
          <div className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${p.dot}`} title={`${p.label} priority`} />

          {/* Conditional class: line-through + muted color when done, full white when not.
              The transition-all duration-300 animates the strikethrough fading in. */}
          <span className={`text-sm font-medium leading-snug transition-all duration-300 ${
            done ? 'line-through text-slate-500' : 'text-white'
          }`}>
            {title}
          </span>
        </div>

        {/* Meta row — only rendered when there is at least a due date or one tag.
            If neither exists, the entire row is skipped to keep the card compact. */}
        {(due || (tags && tags.length > 0)) && (
          <div className="flex items-center flex-wrap gap-2 mt-2">

            {/* Due date — conditional render: only exists if dueDate was provided */}
            {due && (
              <span className={`flex items-center gap-1 text-[11px] font-medium ${
                due.isOverdue ? 'text-red-400' : 'text-slate-400'
              }`}>
                <svg className="h-3 w-3 flex-shrink-0" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="2.5" width="10" height="9" rx="1.5" />
                  <path d="M1 5.5h10M4 1v3M8 1v3" />
                </svg>
                {due.formatted}
                {/* Conditional render: overdue badge — only when overdue is true */}
                {due.isOverdue && (
                  <span className="ml-0.5 rounded-sm bg-red-500/20 px-1 text-red-400 text-[10px] font-semibold">overdue</span>
                )}
              </span>
            )}

            {/* Tag pills — each tag hashes to a consistent color from TAG_PALETTE */}
            {tags?.map((tag) => (
              <span key={tag} className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${tagColor(tag)}`}>
                {tag}
              </span>
            ))}

          </div>
        )}
      </div>

      {/* ── Right-side actions ──────────────────────────────── */}
      <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">

        {/* Done badge — conditional render: only appears when task is complete.
            AnimatePresence lets it fade out smoothly if the task is un-toggled. */}
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

        {/* Delete button — opacity-0 hides it by default; group-hover:opacity-100
            fades it in when the card is hovered. Using opacity instead of display:none
            keeps the button in the layout (no width jump on hover). */}
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
