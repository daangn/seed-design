"use client";

import { Autocomplete } from "@base-ui/react/autocomplete";
import clsx from "clsx";
import { useSearch } from "fumadocs-ui/components/dialog/search";
import { useRouter } from "next/navigation";
import type { RecentPage } from "@/hooks/useRecentPages";
import { Breadcrumbs, ROW_ACTIVE_CLASS_NAME, ROW_CLASS_NAME } from "./row";

/**
 * Empty-state (no query) content for the search dialog: recently visited pages, drawn as the
 * result rows they stand in for — and as entries in the same list, so the arrow keys reach
 * them the moment the dialog opens rather than only once something is typed. With no history
 * yet, shows a friendly prompt.
 */
export function RecentPages({ pages }: { pages: RecentPage[] }) {
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
          show at once, so the only thing keeping them in the same place is the arithmetic.

          Above the list rather than a `GroupLabel` inside it, so the grid is left holding
          nothing but the rows it takes; `aria-label` is what carries the heading into it. */}
      <p className="px-2.5 py-2 text-xs font-medium text-fg-neutral-muted">최근 방문한 페이지</p>
      <Autocomplete.List aria-label="최근 방문한 페이지">
        {pages.map((page) => (
          <Autocomplete.Row key={page.url}>
            <Autocomplete.Item
              value={page.url}
              // Split the way a result row is: the cell opens the page, the anchor inside is
              // what makes it a link the browser recognises, and Base UI's own handler — which
              // would close the dialog without routing anywhere — is stopped.
              onClick={(event) => {
                event.preventBaseUIHandler();
                // Keep cmd/ctrl-click opening a tab — the anchor below is left to do it.
                if (event.metaKey || event.ctrlKey) return;

                event.preventDefault();
                onOpenChange(false);
                router.push(page.url);
              }}
              className={(state) =>
                clsx(ROW_CLASS_NAME, state.highlighted && ROW_ACTIVE_CLASS_NAME)
              }
            >
              <a href={page.url} className="block after:absolute after:inset-0 after:rounded-lg">
                <Breadcrumbs trail={page.section ? [page.section] : []} />
                <span className="block min-w-0 font-medium">{page.title}</span>
              </a>
            </Autocomplete.Item>
          </Autocomplete.Row>
        ))}
      </Autocomplete.List>
    </div>
  );
}
