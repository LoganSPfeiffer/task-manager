// page.js — root route, Server Component by default
// Hardcoded tasks for Module 1. State and dynamic data come in later modules.

import { TaskList } from "@/components/TaskList";

const tasks = [
  { id: 1, title: "Read the React docs", done: true },
  { id: 2, title: "Build a task manager", done: false },
  { id: 3, title: "Learn Tailwind CSS", done: false },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="mx-auto max-w-2xl">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Task Manager
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Your personal productivity hub
          </p>
        </div>

        {/* Section card — glassmorphism panel wrapping the task list */}
        <div className="rounded-2xl bg-slate-800/40 backdrop-blur-sm border border-slate-700/40 p-6 shadow-xl">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
            Tasks
          </h2>
          <TaskList tasks={tasks} />
        </div>

      </div>
    </main>
  );
}
