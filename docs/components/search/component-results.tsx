"use client";

import { Autocomplete } from "@base-ui/react/autocomplete";
import clsx from "clsx";
import { useSearch } from "fumadocs-ui/components/dialog/search";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { COMPONENT_RESULT_LIMIT, type ComponentSearchEntry } from "@/lib/component-search";
import { splitQueryTerms } from "@/lib/search-text";
import { Highlighted, PromotedSection, ShowMore, toRows, useExpandable } from "./promoted-section";

/**
 * How many cards one arrow-key row holds — the desktop column count, so there a row in the
 * markup is a row on screen. A fixed count rather than `auto-fill`, since the panel is 720px
 * wide at every desktop size and so would never change column count on its own.
 */
const COMPONENT_COLUMNS = 3;

/**
 * One grid for the whole block rather than one per row, the rows inside it laid out as
 * `display: contents`, so the cards pack across the boundaries between them. Rows of three
 * laying themselves out each would leave a hole at the end of every one below `md`, where the
 * grid narrows to two columns — what the token block escapes only because four divides in two.
 */
const COMPONENT_GRID_CLASS_NAME = "grid grid-cols-2 gap-2 md:grid-cols-3";

function ComponentCard({ entry, terms }: { entry: ComponentSearchEntry; terms: string[] }) {
  const { onOpenChange } = useSearch();
  const router = useRouter();

  return (
    <Autocomplete.Item
      value={entry.url}
      // The cell owns the opening, so pointer and Enter arrive at one handler rather than at
      // the anchor for one and Base UI's own selection for the other. Its handler is stopped
      // because that one would close the dialog without ever routing anywhere.
      onClick={(event) => {
        event.preventBaseUIHandler();
        // Keep cmd/ctrl-click opening a tab — the anchor below is left to do it.
        if (event.metaKey || event.ctrlKey) return;

        event.preventDefault();
        onOpenChange(false);
        router.push(entry.url);
      }}
      className={(state) =>
        clsx(
          "relative flex flex-col gap-2 rounded-xl p-1.5 transition-colors",
          state.highlighted && "bg-bg-transparent-pressed",
        )
      }
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-bg-transparent-selected">
        {entry.thumbnail ? (
          <Image
            src={entry.thumbnail}
            alt=""
            fill
            loading="lazy"
            decoding="async"
            sizes="(min-width: 768px) 224px, 45vw"
            className="object-cover"
          />
        ) : null}
      </div>
      <div className="flex min-w-0 flex-col px-0.5">
        {/* The `after` overlay hands the whole card the anchor's own behaviour — the address
            in the status bar, cmd-click, "open in new tab" — from an anchor that wraps only
            the title, so the cover above it is not read out as part of the link's name. */}
        <Link
          href={entry.url}
          className="text-[13px] font-medium leading-snug text-fg-neutral after:absolute after:inset-0 after:rounded-xl focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring"
        >
          <span className="block truncate">
            <Highlighted text={entry.title} terms={terms} />
          </span>
        </Link>
        {entry.description ? (
          <p className="line-clamp-2 text-[11px] leading-snug text-fg-neutral-subtle">
            <Highlighted text={entry.description} terms={terms} />
          </p>
        ) : null}
      </div>
    </Autocomplete.Item>
  );
}

/**
 * Component documents matching the query, promoted above the document results so a search
 * for `button` leads with the components themselves — cover and summary — rather than with
 * whichever page happened to mention one.
 */
export function ComponentResults({
  matches,
  search,
}: {
  matches: ComponentSearchEntry[];
  search: string;
}) {
  const { visible, hidden, expanded, toggle } = useExpandable({
    search,
    matches,
    limit: COMPONENT_RESULT_LIMIT,
  });

  const terms = useMemo(() => splitQueryTerms(search), [search]);

  if (matches.length === 0) return null;

  return (
    <PromotedSection label="컴포넌트" count={matches.length}>
      <div className={COMPONENT_GRID_CLASS_NAME}>
        {toRows(visible, COMPONENT_COLUMNS).map((row) => (
          <Autocomplete.Row key={row[0].slug} className="contents">
            {row.map((entry) => (
              <ComponentCard key={entry.slug} entry={entry} terms={terms} />
            ))}
          </Autocomplete.Row>
        ))}
      </div>
      <ShowMore hidden={hidden} expanded={expanded} onToggle={toggle} />
    </PromotedSection>
  );
}
