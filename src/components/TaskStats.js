// ══════════════════════════════════════════════════════════════
// COMPONENT: TaskStats
// PURPOSE:   Displays overall task counts (total, active, done),
//            an animated progress bar, and a "Clear completed"
//            button. Always receives the full, unfiltered task
//            list so the stats reflect global progress — not just
//            what's visible in the current filter view.
// TYPE:      Client Component ('use client') — uses framer-motion
//            for the animated progress bar width transition.
// PROPS:
//   tasks       (Task[]) — the complete task array from TaskBoard.
//                          Read-only here; this component never
//                          modifies it directly.
//   onClearDone (fn)     — callback fired when the user clicks
//                          "Clear completed". Defined in TaskBoard,
//                          which owns the state and is the only
//                          place a deletion can legally happen.
// ══════════════════════════════════════════════════════════════
'use client'

import { motion } from 'framer-motion';

// Small presentational sub-component — not exported because only
// TaskStats uses it. Keeps the JSX in the main render concise.
function StatPill({ label, value, color }) {
  return (
    <div className="flex flex-col gap-0.5 min-w-[48px]">
      <span className={`text-xl font-bold tabular-nums leading-none ${color}`}>{value}</span>
      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">{label}</span>
    </div>
  );
}

export function TaskStats({ tasks, onClearDone }) {

  // ── DERIVED VALUES ──────────────────────────────────────
  // These are computed fresh every render from the tasks prop.
  // They are NOT stored in useState — they'd just be duplicating
  // data that already exists in `tasks`, and keeping duplicates
  // in sync is a common source of bugs. If tasks changes, these
  // recalculate automatically because the component re-renders.
  const total  = tasks.length;
  const done   = tasks.filter((t) => t.done).length;
  const active = total - done;

  // Percentage: guard against division-by-zero when the list is empty.
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  // Conditional visibility: the "Clear completed" button only makes sense
  // when there is at least one completed task to clear.
  const hasDone = done > 0;

  return (
    <div className="rounded-xl bg-slate-800/70 backdrop-blur-sm border border-slate-700/50 px-5 py-4 mb-5">
      <div className="flex items-center gap-6">

        {/* Stat pills — derived from tasks, never from separate state */}
        <StatPill label="Total"  value={total}  color="text-slate-200"  />
        <StatPill label="Done"   value={done}   color="text-emerald-400" />
        <StatPill label="Active" value={active} color="text-indigo-400"  />

        {/* Vertical rule */}
        <div className="h-8 w-px bg-slate-700/60" />

        {/* Progress bar section */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Progress</span>
            <span className="text-xs font-bold text-slate-300 tabular-nums">{pct}%</span>
          </div>
          {/* Track — overflow-hidden is required for the fill to be clipped */}
          <div className="h-1.5 w-full rounded-full bg-slate-700/80 overflow-hidden">
            {/* Animated fill — framer-motion interpolates width to the new
                percentage value each time `pct` changes. The spring-like
                cubic-bezier gives it a satisfying slight overshoot. */}
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
            />
          </div>
        </div>

        {/* Clear completed button — conditional render: only shown when hasDone is true.
            If there are no completed tasks, the button has nothing to do and
            showing it would confuse the user. onClearDone fires up to TaskBoard
            because TaskStats doesn't own the tasks array — it can't delete anything. */}
        {hasDone && (
          <motion.button
            onClick={onClearDone}
            whileTap={{ scale: 0.94 }}
            className="flex-shrink-0 rounded-lg border border-slate-600/60 bg-slate-700/40 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 transition-colors duration-200"
          >
            Clear {done} done
          </motion.button>
        )}

      </div>
    </div>
  );
}
