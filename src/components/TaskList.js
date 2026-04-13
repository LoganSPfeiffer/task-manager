// ══════════════════════════════════════════════════════════════
// COMPONENT: TaskList
// PURPOSE:   The middle of the prop chain. Receives a filtered
//            tasks array from TaskBoard and maps it into TaskCard
//            components. Also handles the empty state. Passes
//            callback props down to each TaskCard with the task
//            id already bound, so TaskCard gets clean zero-argument
//            functions and has no knowledge of task IDs.
// TYPE:      Client Component ('use client') — uses framer-motion's
//            AnimatePresence and motion.li, which require the browser.
// PROPS:
//   tasks        (Task[]) — the filtered subset of tasks to render.
//                           TaskList never filters itself; that logic
//                           stays in TaskBoard where the state lives.
//   onToggle     (fn)     — callback from TaskBoard. TaskList binds
//                           each task.id before passing to TaskCard.
//   onDelete     (fn)     — same binding pattern as onToggle.
//   emptyMessage (string) — text shown when tasks array is empty.
//                           Defaults to a generic message; TaskBoard
//                           passes a filter-specific string.
// ══════════════════════════════════════════════════════════════
'use client'

import { motion, AnimatePresence } from 'framer-motion';
import { TaskCard } from '@/components/TaskCard';

export function TaskList({
  tasks,
  onToggle,
  onDelete,
  emptyMessage = 'No tasks yet. Add one to get started.',
}) {
  return (
    <div>
      {/* AnimatePresence must wrap the list so that exit animations fire when
          items leave the DOM. Without it, React removes elements immediately and
          the exit animation never plays.
          mode="popLayout" removes the exiting item from the layout right away,
          so remaining cards can animate into place without waiting for the exit
          to finish — this gives the delete its "collapse and slide up" feel. */}
      <AnimatePresence mode="popLayout" initial={false}>

        {/* Conditional render: empty state vs task list.
            Both branches are keyed so AnimatePresence can animate between them. */}
        {tasks.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-xl bg-slate-800/40 border border-slate-700/30 px-6 py-10 text-center"
          >
            <p className="text-slate-500 text-sm">{emptyMessage}</p>
          </motion.div>
        ) : (
          <motion.ul key="list" className="flex flex-col gap-2">
            <AnimatePresence mode="popLayout">
              {tasks.map((task) => (
                // layout={true}: when this item is removed, siblings animate
                // into the vacated space rather than jumping instantly.
                // key={task.id}: uses a stable ID, not the array index.
                // Index-based keys break AnimatePresence — if index 2 is
                // deleted, what was index 3 becomes index 2, and React thinks
                // the wrong element was removed.
                <motion.li
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
                  transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  {/* Bind task.id into the callbacks here.
                      TaskCard receives () => onToggle(task.id) — a zero-argument
                      function. TaskCard just calls onToggle() with no arguments;
                      the id is already "baked in" via closure. This keeps TaskCard
                      cleanly unaware of the data model. */}
                  <TaskCard
                    task={task}
                    onToggle={() => onToggle(task.id)}
                    onDelete={() => onDelete(task.id)}
                  />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}

      </AnimatePresence>
    </div>
  );
}
