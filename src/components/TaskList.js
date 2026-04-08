'use client'

// TaskList — Client Component (needs framer-motion)
// AnimatePresence tracks when items leave the DOM and plays exit animations.
// Each motion.li has layout={true} so remaining cards smoothly reflow after a delete.

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
      {/* AnimatePresence must wrap the list so exit animations fire when items are removed.
          mode="popLayout" removes the exiting item from layout immediately so others
          can animate into place without waiting for the exit to finish. */}
      <AnimatePresence mode="popLayout" initial={false}>

        {tasks.length === 0 ? (
          // Empty state — keyed so AnimatePresence can animate it in/out
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
                // layout={true} — when this item is removed, siblings animate into the gap
                <motion.li
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
                  transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  {/* Bind task.id here — TaskCard receives simple () => void callbacks */}
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
