'use client'

// NavBar — Client Component
// Horizontal tab navigation with animated active indicator using framer-motion layoutId.
// layoutId="tab-indicator" causes the underline to smoothly slide between tabs
// rather than jumping — framer-motion tracks it across positions in the DOM.

import { useState } from 'react';
import { motion } from 'framer-motion';

const TABS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="7" height="7" rx="1.5" />
        <rect x="11" y="2" width="7" height="7" rx="1.5" />
        <rect x="2" y="11" width="7" height="7" rx="1.5" />
        <rect x="11" y="11" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    id: 'tasks',
    label: 'Tasks',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="4" height="4" rx="1" />
        <path d="M4.5 6l1 1 1.5-1.5" />
        <path d="M9 6h8M9 13h8" />
        <rect x="3" y="11" width="4" height="4" rx="1" />
      </svg>
    ),
  },
  {
    id: 'notes',
    label: 'Notes',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="2" width="14" height="16" rx="2" />
        <path d="M7 7h6M7 11h6M7 15h3" />
      </svg>
    ),
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 7h7V4h2l2 3h5v10H2z" />
      </svg>
    ),
  },
  {
    id: 'calendar',
    label: 'Calendar',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="16" height="14" rx="2" />
        <path d="M2 9h16M7 2v4M13 2v4" />
      </svg>
    ),
  },
];

export function NavBar() {
  const [active, setActive] = useState('tasks');

  return (
    <nav className="sticky top-0 z-50 bg-slate-800/90 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="mx-auto max-w-5xl px-8">
        <div className="flex items-center gap-1 h-14">

          {/* Logo / wordmark */}
          <div className="flex items-center gap-2 mr-6">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 4h12M2 8h8M2 12h5" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-white tracking-tight">Focus</span>
          </div>

          {/* Tabs */}
          {TABS.map((tab) => {
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={`relative flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md transition-colors duration-150 ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                {/* Icon */}
                <span className={isActive ? 'text-indigo-400' : ''}>{tab.icon}</span>
                {tab.label}

                {/* Animated underline — layoutId makes it slide between tabs */}
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
