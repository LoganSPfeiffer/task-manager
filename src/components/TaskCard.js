// TaskCard — Server Component
// Displays a single task. Props: title (string), done (boolean).
// No 'use client' needed — purely presentational, no interactivity yet.

export function TaskCard({ title, done }) {
  return (
    // group lets child elements react to hover on the parent card
    <div className="group flex items-center gap-3 rounded-xl bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 px-4 py-3.5 shadow-lg hover:bg-slate-700/60 hover:border-slate-600/50 hover:-translate-y-0.5 transition-all duration-200">

      {/* Completion indicator — filled circle when done, outlined when not */}
      <div className={`h-4 w-4 rounded-full border-2 flex-shrink-0 transition-colors duration-200 ${
        done
          ? "bg-emerald-500 border-emerald-500"
          : "border-slate-500 group-hover:border-slate-400"
      }`} />

      {/* Task title — strikethrough + dimmed when done */}
      <span className={`flex-1 text-sm font-medium transition-colors duration-200 ${
        done
          ? "line-through text-slate-500"
          : "text-slate-200 group-hover:text-white"
      }`}>
        {title}
      </span>

      {/* Status badge — conditional rendering: only shown when done */}
      {done && (
        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 ring-1 ring-emerald-500/30">
          Done
        </span>
      )}

    </div>
  );
}
