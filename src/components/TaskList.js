// TaskList — Server Component
// Receives a tasks array, maps each item to a TaskCard.
// Renders an empty state when the array is empty.

import { TaskCard } from "@/components/TaskCard";

export function TaskList({ tasks }) {
  // Empty state — shown when no tasks exist yet
  if (tasks.length === 0) {
    return (
      <div className="rounded-xl bg-slate-800/40 border border-slate-700/30 px-6 py-12 text-center">
        <p className="text-slate-500 text-sm">No tasks yet. Add one to get started.</p>
      </div>
    );
  }

  return (
    // Each list item needs a unique key so React can track it — never use array index
    <ul className="flex flex-col gap-2">
      {tasks.map((task) => (
        <li key={task.id}>
          <TaskCard title={task.title} done={task.done} />
        </li>
      ))}
    </ul>
  );
}
