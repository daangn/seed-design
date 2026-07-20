"use client";

import { useSearch } from "fumadocs-ui/components/dialog/search";
import { useRouter } from "next/navigation";
import { List, ListLinkItem } from "seed-design/ui/list";
import { useRecentPages } from "@/hooks/useRecentPages";

/**
 * Empty-state (no query) content for the search dialog: recently visited pages rendered
 * with the SEED List snippet (title + section detail). With no history yet, shows a
 * friendly prompt.
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
    <div className="p-2">
      <p className="px-2 pb-1 text-xs font-medium text-fg-neutral-muted">최근 방문한 페이지</p>
      <List width="full">
        {pages.map((page) => (
          <ListLinkItem
            key={page.url}
            href={page.url}
            title={page.title}
            detail={page.section || undefined}
            onClick={(e) => {
              // Keep client-side navigation (the snippet renders a plain <a>).
              if (e.metaKey || e.ctrlKey) return;
              e.preventDefault();
              onOpenChange(false);
              router.push(page.url);
            }}
          />
        ))}
      </List>
    </div>
  );
}
