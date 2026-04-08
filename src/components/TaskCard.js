// TaskCard — bottom of the prop chain
// Receives onToggle and onDelete as simple () => void callbacks.
// It doesn't know which task it is or what the handler does — it just calls them.
// No 'use client' needed: onClick handlers work fine in components that are
// already part of a Client Component subtree (TaskBoard is 'use client').

export function TaskCard({ title, done, onToggle, onDelete }) {
  return (
    <div className="group flex items-center gap-3 rounded-xl bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 px-4 py-3.5 shadow-lg hover:bg-slate-700/60 hover:border-slate-600/50 hover:-translate-y-0.5 transition-all duration-200">

      {/* Toggle button — clicking marks the task done or undone.
          Replaces the static circle indicator from Module 1. */}
      <button
        onClick={onToggle}
        aria-label={done ? 'Mark as not done' : 'Mark as done'}
        className={`h-5 w-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-300 ${
          done
            ? 'bg-emerald-500 border-emerald-500 shadow-md shadow-emerald-500/30'
            : 'border-slate-500 hover:border-emerald-400 hover:bg-emerald-400/10'
        }`}
      >
        {/* Checkmark — only rendered when done. Animates in via opacity on the parent transition. */}
        {done && (
          <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 10 10" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M1.5 5l2.5 2.5 4.5-4.5" />
          </svg>
        )}
      </button>

      {/* Task title — strikethrough fades in over 300ms when done toggled */}
      <span className={`flex-1 text-sm font-medium transition-all duration-300 ${
        done
          ? 'line-through text-slate-500'
          : 'text-slate-200 group-hover:text-white'
      }`}>
        {title}
      </span>

      {/* Done badge — only rendered when task is complete */}
      {done && (
        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 ring-1 ring-emerald-500/30">
          Done
        </span>
      )}

      {/* Delete button — hidden by default, fades in on card hover via group-hover.
          opacity-0 → opacity-100 keeps layout stable (no layout shift on hover). */}
      <button
        onClick={onDelete}
        aria-label="Delete task"
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-slate-500 hover:bg-red-500/15 hover:text-red-400"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2 2l10 10M12 2L2 12" />
        </svg>
      </button>

    </div>
  );
}
