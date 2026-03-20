import type { ReactNode } from "react";

/**
 * Minimal layout for block iframe previews.
 * Root layout already provides CSS + theme sync.
 * This layout intentionally adds nothing — no docs navigation, no sidebar.
 */
export default function BlockLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
