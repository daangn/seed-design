---
"@ride-developer/react": patch
---

Add 'use client' directive to all React components for Next.js App Router compatibility.

Previously, components lacked the directive causing "Invalid hook call" errors when used
in Next.js SSR context. All 74 component files now include 'use client' at the top.
