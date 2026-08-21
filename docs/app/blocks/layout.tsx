import type { ReactNode } from "react";

import { BlockThemeListener } from "../../components/block-theme-listener";

/**
 * Minimal layout for block iframe previews.
 * Root layout already provides CSS + theme sync.
 * This layout intentionally adds nothing — no docs navigation, no sidebar.
 */
export default function BlockLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <BlockThemeListener />
      {children}
    </>
  );
}
