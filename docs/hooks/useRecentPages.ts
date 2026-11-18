"use client";

import { useEffect, useState } from "react";
import { CHANGE_EVENT, type RecentPage, readRecentPages } from "@/lib/recent-pages";

export { parseRecentPages, type RecentPage, recordRecentPage } from "@/lib/recent-pages";

/** Reactive recent-pages list, kept fresh via the local change event + cross-tab storage. */
export function useRecentPages(): RecentPage[] {
  const [pages, setPages] = useState<RecentPage[]>([]);

  useEffect(() => {
    const sync = () => setPages(readRecentPages());
    sync();
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return pages;
}
