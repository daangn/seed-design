"use client";

import { createContext } from "react";

/**
 * True when a code block renders inside a tabbed code card (`CodeBlockTabs`). The
 * `pre` wrapper (`SeedCodeBlockAuto`) reads this to render the highlighted `<pre>` bare
 * — the surrounding chip card already provides the surface, header, and copy button —
 * instead of nesting another `SeedCodeBlock` card.
 *
 * Kept in its own client module so the directive-free `code-card.tsx` (imported by server
 * components) stays free of `createContext`.
 */
export const CodeTabContext = createContext(false);
