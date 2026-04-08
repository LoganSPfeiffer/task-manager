'use client'

// StatsBar — Client Component (needs framer-motion for animated progress bar)
// Receives the full (unfiltered) tasks array so stats always reflect overall progress,
// not just what's visible in the current filter view.

import { motion } from 'framer-motion';

function Stat({ label, value, color }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className={`text-xl font-bold tabular-nums ${color}`}>{value}</span>
      <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">{label}</span>
    </div>
  );
}

export function StatsBar({ tasks }) {
  const total  = tasks.length;
  const done   = tasks.filter((t) => t.done).length;
  const active = total - done;
  const pct    = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="rounded-xl bg-slate-800/70 backdrop-blur-sm border border-slate-700/50 px-5 py-4 mb-5 flex items-center gap-8">

      {/* Stat numbers */}
      <Stat label="Total"  value={total}  color="text-slate-200" />
      <Stat label="Done"   value={done}   color="text-emerald-400" />
      <Stat label="Active" value={active} color="text-indigo-400" />

      {/* Divider */}
      <div className="h-8 w-px bg-slate-700/60 mx-1" />

      {/* Progress section */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Progress</span>
          <span className="text-xs font-semibold text-slate-300 tabular-nums">{pct}%</span>
        </div>
        {/* Track */}
        <div className="h-1.5 w-full rounded-full bg-slate-700/80 overflow-hidden">
          {/* Animated fill — framer-motion animates width whenever pct changes */}
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          />
        </div>
      </div>

    </div>
  );
}
