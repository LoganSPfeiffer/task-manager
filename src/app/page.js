// page.js — Server Component
// Renders layout and both Client Components (NavBar + TaskBoard).
// Server Components can render Client Components — they just can't use
// client-only APIs themselves.

import { NavBar } from '@/components/NavBar';
import { TaskBoard } from '@/components/TaskBoard';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900">

      {/* Subtle background accent — fixed radial gradient for depth */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.12) 0%, transparent 70%)',
        }}
      />

      {/* Sticky navigation */}
      <NavBar />

      {/* Content area */}
      <main className="relative z-10 mx-auto max-w-3xl px-6 py-10">

        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white tracking-tight">Tasks</h1>
          <p className="mt-1 text-sm text-slate-400">
            Track what you need to get done.
          </p>
        </div>

        {/* Glass panel wrapping the full board */}
        <div className="rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-6 shadow-xl shadow-black/30">
          <TaskBoard />
        </div>

      </main>
    </div>
  );
}
