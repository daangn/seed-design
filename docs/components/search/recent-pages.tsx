"use client";

import clsx from "clsx";
import { useSearch } from "fumadocs-ui/components/dialog/search";
import { useRouter } from "next/navigation";
import { useRecentPages } from "@/hooks/useRecentPages";
import { Breadcrumbs, ROW_CLASS_NAME } from "./row";

/**
 * Empty-state (no query) content for the search dialog: recently visited pages, drawn as the
 * result rows they stand in for. They are plain links rather than entries in fumadocs' list,
 * so the arrow keys never reach them and the ground lights on hover instead of on active.
 * With no history yet, shows a friendly prompt.
 */
export function RecentPages() {
  const pages = useRecentPages();
  const { onOpenChange } = useSearch();
  const router = useRouter();

  if (pages.length === 0) {
    return (
      <p className="px-3 py-10 text-center text-sm text-fg-neutral-subtle">무엇이든 검색해보세요</p>
    );
  }

  return (
    <div className="p-1">
      {/* `py-2` on top of the block's own 4px is what the promoted sections' labels sit at —
          12px above the text, 8px between it and the ground of the first row. The two never
          show at once, so the only thing keeping them in the same place is the arithmetic. */}
      <p className="px-2.5 py-2 text-xs font-medium text-fg-neutral-muted">최근 방문한 페이지</p>
      {pages.map((page) => (
        <a
          key={page.url}
          href={page.url}
          className={clsx(ROW_CLASS_NAME, "hover:bg-bg-transparent-selected")}
          onClick={(event) => {
            // Keep cmd/ctrl-click opening a tab; a plain click routes through the client
            // router and closes the dialog behind it.
            if (event.metaKey || event.ctrlKey) return;

            event.preventDefault();
            onOpenChange(false);
            router.push(page.url);
          }}
        >
          <Breadcrumbs trail={page.section ? [page.section] : []} />
          <span className="block min-w-0 font-medium">{page.title}</span>
        </a>
      ))}
    </div>
  );
}
