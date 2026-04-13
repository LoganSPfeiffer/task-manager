// ══════════════════════════════════════════════════════════════
// COMPONENT: NavBar
// PURPOSE:   Horizontal tab navigation bar at the top of the page.
//            Highlights the active tab with an animated underline
//            that slides smoothly between tabs using framer-motion's
//            layoutId. Currently controls only visual state — in a
//            future module each tab will link to its own route.
// TYPE:      Client Component ('use client') — uses useState to
//            track the active tab, and framer-motion's layoutId
//            animation, both of which require the browser.
// PROPS:     none — NavBar manages its own tab state locally.
//            When routing is added, the active state will come from
//            the URL rather than local useState.
// ══════════════════════════════════════════════════════════════
'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';

// Tab definitions live at module level — they never change, so there's
// no reason to re-create this array on every render inside the component.
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
  // The active tab id is UI state — it changes when the user clicks a button
  // and no other component needs to read it, so it belongs here locally.
  // 'tasks' is the default because that's the only section built so far.
  const [active, setActive] = useState('tasks');

  return (
    // sticky top-0 keeps the nav visible as the page scrolls.
    // backdrop-blur-xl frosted-glass effect requires the element to have
    // a semi-transparent background — bg-slate-800/90 provides that.
    <nav className="sticky top-0 z-50 bg-slate-800/90 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="mx-auto max-w-5xl px-8">
        <div className="flex items-center gap-1 h-14">

          {/* Brand mark */}
          <div className="flex items-center gap-2 mr-6">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <path d="M2 4h12M2 8h8M2 12h5" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-white tracking-tight">Focus</span>
          </div>

          {/* Tab buttons */}
          {TABS.map((tab) => {
            // isActive is derived from `active` state — no need to store it separately
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
                {/* Icon gets the accent color when its tab is active */}
                <span className={isActive ? 'text-indigo-400' : ''}>{tab.icon}</span>
                {tab.label}

                {/* Animated underline — the key to the sliding effect.
                    layoutId="tab-indicator" tells framer-motion these divs across
                    different tab buttons are the SAME element. When `active` changes,
                    the old tab's div unmounts and the new tab's div mounts, but
                    framer-motion animates the transition as if the element slid across.
                    This is only possible with layoutId — no CSS transition could do it
                    across separate DOM elements. */}
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
