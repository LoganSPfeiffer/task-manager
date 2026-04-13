// ══════════════════════════════════════════════════════════════
// COMPONENT: RootLayout
// PURPOSE:   Root layout wrapper for the entire Next.js app.
//            Every page in the app is rendered inside this layout.
//            Sets up Google Fonts (Geist), global CSS, HTML lang,
//            and document-level metadata.
// TYPE:      Server Component (no 'use client') — layout.js runs
//            on the server. It wraps every page but never re-renders
//            during client-side navigation; Next.js preserves it.
// PROPS:
//   children — the page content rendered inside this layout.
//              Next.js injects the active page automatically.
// ══════════════════════════════════════════════════════════════

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// next/font/google handles font loading at build time — no runtime
// network request, no layout shift. The variable props create CSS
// custom properties (--font-geist-sans, --font-geist-mono) that
// Tailwind references via the antialiased className on <html>.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata is exported from Server Components and injected into
// the <head> by Next.js — no need to write a <head> tag manually.
export const metadata = {
  title: "Focus — Task Manager",
  description: "A personal productivity hub built with Next.js and React",
};

export default function RootLayout({ children }) {
  return (
    // lang="en" improves screen reader behavior and SEO.
    // h-full antialiased: full height and smooth font rendering.
    // Font variables make the Geist fonts available to Tailwind's
    // font-sans and font-mono utility classes globally.
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
