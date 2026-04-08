// TaskList — middle of the prop chain
// Receives tasks + callback props from TaskBoard, passes them down to each TaskCard.
// TaskList itself doesn't call onToggle or onDelete — it just threads them through.
// This is the "prop drilling" pattern: data and callbacks flow top-down through props.

import { TaskCard } from '@/components/TaskCard';

export function TaskList({
  tasks,
  onToggle,
  onDelete,
  emptyMessage = 'No tasks yet. Add one to get started.',
}) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-xl bg-slate-800/40 border border-slate-700/30 px-6 py-10 text-center">
        <p className="text-slate-500 text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {tasks.map((task) => (
        <li key={task.id}>
          {/* Bind the task id here so TaskCard receives simple () => void callbacks.
              TaskCard doesn't need to know about ids — it just calls onToggle(). */}
          <TaskCard
            title={task.title}
            done={task.done}
            onToggle={() => onToggle(task.id)}
            onDelete={() => onDelete(task.id)}
          />
        </li>
      ))}
    </ul>
  );
}
