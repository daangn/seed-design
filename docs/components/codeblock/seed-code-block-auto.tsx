"use client";

import { type ReactNode, useContext } from "react";
import { SeedCodeBlock } from "./code-block";
import { CodeTabContext } from "./code-tab-context";

interface SeedCodeBlockAutoProps {
  title?: ReactNode;
  icon?: ReactNode;
  /** Highlighted code, a Fumadocs `<Pre>` element. */
  children: ReactNode;
}

/**
 * The MDX `pre` wrapper. Inside a tabbed code card (`CodeBlockTabs` sets
 * `CodeTabContext`), it renders the highlighted `<pre>` bare — the surrounding chip card
 * already provides the surface, header, and copy button. Otherwise it renders the full
 * `SeedCodeBlock` card.
 */
export function SeedCodeBlockAuto({ title, icon, children }: SeedCodeBlockAutoProps) {
  const inTab = useContext(CodeTabContext);

  if (inTab) return <>{children}</>;

  return (
    <SeedCodeBlock title={title} icon={icon}>
      {children}
    </SeedCodeBlock>
  );
}
