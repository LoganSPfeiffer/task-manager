# Coding Rules

- Server Components by default — only add 'use client' when needed
- 'use client' must be the VERY FIRST line (before imports)
- Never use useState or useEffect in a Server Component
- Always provide a unique key prop on .map() rendered elements
- State updates must be immutable — use spread operator, never mutate
- One component per file, named export preferred
- Explain what code does in comments when introducing new concepts
