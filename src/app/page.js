// ══════════════════════════════════════════════════════════════
// COMPONENT: Home (page.js — root route)
// PURPOSE:   Layout shell for the app. Renders the navigation bar
//            and the main task board. This component intentionally
//            has NO state, NO data, and NO interactivity — it is a
//            pure structural wrapper.
// TYPE:      Server Component (no 'use client') — runs on the server
//            and renders to HTML before reaching the browser. Server
//            Components can render Client Components (NavBar, TaskBoard)
//            but cannot use useState, useEffect, or browser APIs.
// PROPS:     none — Next.js App Router calls this automatically as
//            the root route handler.
// ══════════════════════════════════════════════════════════════

import { NavBar }    from '@/components/NavBar';
import { TaskBoard } from '@/components/TaskBoard';

export default function Home() {
  return (
    // Outer div sets the full-page dark background.
    // The gradient goes from slate-900 → slightly lighter → back,
    // giving the flat background just enough depth to read against.
    <div className="min-h-screen bg-slate-900">

      {/* Fixed radial gradient — creates a subtle indigo glow from the top
          center, making the dark background feel warmer and less flat.
          pointer-events-none ensures it never blocks clicks on content below.
          This uses an inline style because Tailwind cannot generate arbitrary
          radial-gradient values — inline style is the correct exception here. */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.12) 0%, transparent 70%)',
        }}
      />

      {/* NavBar is a Client Component — Server Components CAN render Client
          Components. The boundary only prevents the reverse (Client cannot
          import Server Components). NavBar handles its own tab state. */}
      <NavBar />

      {/* relative z-10 lifts the content above the fixed gradient overlay */}
      <main className="relative z-10 mx-auto max-w-3xl px-6 py-10">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white tracking-tight">Tasks</h1>
          <p className="mt-1 text-sm text-slate-400">
            Track what you need to get done.
          </p>
        </div>

        {/* Glass panel — semi-transparent container wrapping the full task board.
            backdrop-blur-sm creates the frosted glass effect by blurring what's
            behind the element. Requires a background with opacity < 1 to work. */}
        <div className="rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-6 shadow-xl shadow-black/30">
          {/* TaskBoard owns all task state and interactivity.
              page.js passes nothing — TaskBoard is self-contained. */}
          <TaskBoard />
        </div>

      </main>
    </div>
  );
}
