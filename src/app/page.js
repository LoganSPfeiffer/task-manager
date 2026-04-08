// page.js — Server Component (no 'use client', no state, no data)
// Its only job is layout and rendering TaskBoard.
// All task data and interactivity lives inside TaskBoard (Client Component).
// This is the Server/Client split in action: server handles structure,
// client handles everything interactive.

import { TaskBoard } from '@/components/TaskBoard';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="mx-auto max-w-2xl">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Task Manager
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Your personal productivity hub
          </p>
        </div>

        <div className="rounded-2xl bg-slate-800/40 backdrop-blur-sm border border-slate-700/40 p-6 shadow-xl">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
            Tasks
          </h2>
          <TaskBoard />
        </div>

      </div>
    </main>
  );
}
