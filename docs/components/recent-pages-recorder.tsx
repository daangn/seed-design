"use client";

import { useEffect } from "react";
import { recordRecentPage } from "@/hooks/useRecentPages";

/**
 * Mounted once at the root layout (covers landing + docs). Records each visited page so
 * the search dialog's empty state can show recently visited pages. Renders nothing.
 */
export function RecentPagesRecorder() {
  useEffect(() => {
    recordRecentPage(window.location.pathname, window.location.search.replace(/^\?/, ""));
  }, []);

  return null;
}
