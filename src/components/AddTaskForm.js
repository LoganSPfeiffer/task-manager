// ══════════════════════════════════════════════════════════════
// COMPONENT: AddTaskForm
// PURPOSE:   Controlled form that lets the user type a new task
//            title and submit it. This component does NOT own the
//            task list — it only signals upward via the onAdd
//            callback. "Controlled" means React state, not the DOM,
//            is the single source of truth for the input's value.
// TYPE:      Client Component ('use client') — uses useState and
//            an onSubmit handler, both of which require the browser.
// PROPS:
//   onAdd (fn) — callback fired with the trimmed title string when
//                the user submits. Defined in TaskBoard, which owns
//                the tasks array and is the only component that can
//                legally add to it.
// ══════════════════════════════════════════════════════════════
'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';

export function AddTaskForm({ onAdd }) {

  // Local state: only AddTaskForm needs to know what the user is currently
  // typing. There's no reason to lift this up to TaskBoard — no other
  // component reads or depends on the draft text. Keeping state as low as
  // possible in the tree reduces re-renders and keeps components focused.
  const [title, setTitle] = useState('');

  function handleSubmit(e) {
    // e.preventDefault() stops the browser's default form behavior, which
    // is to serialize the form fields into a query string and reload the page.
    // We want to handle the submission in JavaScript instead.
    e.preventDefault();

    // Validation: .trim() removes leading/trailing whitespace so a submission
    // of "   " (spaces only) is treated as empty and rejected. The early return
    // prevents calling onAdd with meaningless input.
    if (!title.trim()) return;

    // Fire the callback with the cleaned title. TaskBoard receives this and
    // appends a new task object to its state — AddTaskForm never touches the list.
    onAdd(title.trim());

    // Reset the input so the field is ready for the next task immediately.
    setTitle('');
  }

  return (
    // onSubmit fires on both Enter key and button click, which handles
    // keyboard users and improves accessibility over onClick-only approaches.
    <form onSubmit={handleSubmit} className="flex gap-2 mb-5">

      {/* Controlled input: value={title} mirrors state on every render.
          onChange keeps state and the DOM in sync on every keystroke.
          If you removed value={title}, the input would become "uncontrolled"
          — React wouldn't know what text is in it and couldn't validate or reset it. */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new task..."
        className="flex-1 rounded-lg bg-slate-700/50 border border-slate-600/50 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200"
      />

      {/* type="submit" triggers the form's onSubmit, which handles validation.
          Using type="button" here would skip the form entirely. */}
      <motion.button
        type="submit"
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-shadow duration-200"
      >
        {/* Plus icon */}
        <svg className="h-4 w-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
          <path d="M8 3v10M3 8h10" />
        </svg>
        Add
      </motion.button>

    </form>
  );
}
