"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { recordRecentPage } from "@/hooks/useRecentPages";

/**
 * Mounted once at the root layout (covers landing + docs). Records each visited page so
 * the search dialog's empty state can show recently visited pages. Renders nothing.
 */
export function RecentPagesRecorder() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  useEffect(() => {
    recordRecentPage(pathname, query);
  }, [pathname, query]);

  return null;
}
