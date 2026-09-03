"use client";

import { Autocomplete } from "@base-ui/react/autocomplete";
import { IconHashLine } from "@karrotmarket/react-monochrome-icon";
import { clsx } from "cn";
import type { SortedResult } from "fumadocs-core/search";
import { useSearch } from "fumadocs-ui/components/dialog/search";
import { useRouter } from "next/navigation";
import { ResultMarkdown } from "./result-markdown";
import { Breadcrumbs, ROW_ACTIVE_CLASS_NAME, ROW_CLASS_NAME } from "./row";

/**
 * A single search result, as one cell of the grid the results card is. The row the arrow keys
 * are on takes the neutral selected background, and so does the one the pointer is over — Base
 * UI highlights on hover too, so the two are one state here.
 *
 * Advanced search hands the list one `page` row per matched document followed by the rows that
 * matched inside it, so a `page` row renders as the group's header — breadcrumbs over the
 * document title — and the rest render beneath it, indented and threaded onto a rail that runs
 * down the group the way fumadocs' own result list draws it.
 */
export function SearchResultItem({
  item,
  showSection,
  nested,
}: {
  item: SortedResult;

  /** Whether the trail keeps its section. Dropped under a filter, where it repeats the chip. */
  showSection: boolean;

  /** Whether a header row above owns this one. Decided by the caller, which is what groups
   * the rows. */
  nested: boolean;
}) {
  const { onOpenChange } = useSearch();
  const router = useRouter();

  return (
    <Autocomplete.Item
      value={item.id}
      // The cell opens the document; the anchor inside is what makes it a link the browser
      // recognises. Base UI's own handler would close the dialog without routing anywhere, so
      // it is stopped and the two paths stay one.
      onClick={(event) => {
        event.preventBaseUIHandler();
        // Keep cmd/ctrl-click opening a tab — the anchor below is left to do it.
        if (event.metaKey || event.ctrlKey) return;

        event.preventDefault();
        onOpenChange(false);
        router.push(item.url);
      }}
      className={(state) => clsx(ROW_CLASS_NAME, state.highlighted && ROW_ACTIVE_CLASS_NAME)}
    >
      {/* The rail threads the rows matched inside a document onto the header above them. */}
      {nested ? (
        <span aria-hidden className="absolute inset-y-0 start-3 w-px bg-stroke-neutral-muted" />
      ) : null}
      {nested && item.type === "heading" ? (
        <IconHashLine
          aria-hidden
          className="absolute start-6 top-2.5 size-3.5 text-fg-neutral-subtle"
        />
      ) : null}
      <a href={item.url} className="block after:absolute after:inset-0 after:rounded-lg">
        {item.type === "page" ? (
          <Breadcrumbs trail={(item.breadcrumbs ?? []).slice(showSection ? 0 : 1)} />
        ) : null}
        <span
          className={clsx(
            "block min-w-0",
            // A heading is a place in the document rather than a sentence from it, so it carries
            // the same weight as the title above it; body text stays quieter than both.
            item.type === "text" ? "text-fg-neutral-muted" : "font-medium",
            nested && (item.type === "heading" ? "ps-8" : "ps-4"),
          )}
        >
          {typeof item.content === "string" ? (
            <ResultMarkdown>{item.content}</ResultMarkdown>
          ) : (
            item.content
          )}
        </span>
      </a>
    </Autocomplete.Item>
  );
}
