"use client";

import clsx from "clsx";
import { useOnChange } from "fumadocs-core/utils/use-on-change";
import { useSearch } from "fumadocs-ui/components/dialog/search";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type CSSProperties, type ReactNode, useMemo, useState } from "react";
import { TOKEN_KIND_ICON } from "@/components/token-kind-icon";
import { splitQueryTerms } from "@/lib/search-text";
import {
  type ThemedCss,
  TOKEN_RESULT_LIMIT,
  type TokenSearchEntry,
  tokenReferenceHref,
} from "@/lib/token-search";
import { Highlighted, PromotedSection, stopEnterPropagation } from "./promoted-section";

/**
 * Tall enough for two rows even when a token id wraps onto a second line, so the cut
 * lands between rows instead of through a description — or one row when the component
 * section is showing too. The grid auto-fills — 2 columns on a phone, 4 on desktop — and
 * "더 보기" pours the remaining matches into this same scroll box rather than growing the
 * dialog.
 */
const TOKEN_GRID_CLASS_NAME =
  "grid grid-cols-[repeat(auto-fill,minmax(148px,1fr))] gap-2 overflow-y-auto";

/**
 * Colour roles read differently depending on where the token is meant to land, so each
 * preview mimics the usage: a background fills the box, a foreground paints letterforms
 * on the page grounds, and a stroke draws the 2px line it would draw.
 */
const COLOR_ROLE_PREVIEW: Record<string, "text" | "line" | undefined> = {
  "$color.fg": "text",
  "$color.stroke": "line",
};

const themed = ({ light, dark }: ThemedCss) =>
  ({ "--token-preview-light": light, "--token-preview-dark": dark }) as CSSProperties;

/**
 * Stand-in for the page canvas, showing both grounds a screen is built from:
 * `layer-default`, the surface most content sits on, and `layer-basement`, the canvas
 * underneath it. Foreground, stroke and shadow tokens are all defined against those, so
 * previewing them on the dialog's own surface would misreport how they land — and picking
 * one of the two would still hide how the token reads on the other. docs/AGENTS.md steers
 * docs *chrome* away from opaque SEED greys; this box is content — the point is to show
 * the real backdrop.
 *
 * Split down the middle rather than across: the box is 44px tall and the two layers sit
 * about 1.1 apart in contrast, so as a pair of 22px bands the seam would vanish.
 */
function PreviewSurface({ children }: { children: ReactNode }) {
  return (
    <span
      aria-hidden
      className="relative flex h-11 w-full overflow-hidden rounded-lg border border-stroke-neutral-muted"
    >
      <span className="flex-1 bg-bg-layer-default" />
      <span className="flex-1 bg-bg-layer-basement" />
      <span className="absolute inset-0 flex items-center justify-center">{children}</span>
    </span>
  );
}

function TokenPreview({ entry }: { entry: TokenSearchEntry }) {
  const { background, boxShadow, group, kind, label } = entry;

  if (background) {
    const role = COLOR_ROLE_PREVIEW[group];

    // Letterforms can't be cut in half, so each ground gets its own pair rather than one
    // word straddling the seam. A stroke is a line already, and reads across it.
    if (role === "text")
      return (
        <PreviewSurface>
          <span
            style={themed(background)}
            className="flex w-full text-[15px] font-semibold leading-none text-[var(--token-preview-light)] dark:text-[var(--token-preview-dark)]"
          >
            <span className="flex-1 text-center">Aa</span>
            <span className="flex-1 text-center">Aa</span>
          </span>
        </PreviewSurface>
      );

    if (role === "line")
      return (
        <PreviewSurface>
          <span
            style={themed(background)}
            className="h-0.5 w-2/3 bg-[var(--token-preview-light)] dark:bg-[var(--token-preview-dark)]"
          />
        </PreviewSurface>
      );

    return (
      <span
        aria-hidden
        style={themed(background)}
        className="block h-11 w-full rounded-lg border border-stroke-neutral-muted bg-[var(--token-preview-light)] dark:bg-[var(--token-preview-dark)]"
      />
    );
  }

  if (boxShadow)
    return (
      <PreviewSurface>
        <span
          style={themed(boxShadow)}
          className="size-6 rounded-md bg-bg-layer-floating shadow-[var(--token-preview-light)] dark:shadow-[var(--token-preview-dark)]"
        />
      </PreviewSurface>
    );

  const Icon = TOKEN_KIND_ICON[kind];

  return (
    <span
      aria-hidden
      className="flex h-11 w-full flex-col items-center justify-center gap-1 rounded-lg bg-bg-transparent-selected px-1 text-fg-neutral-muted"
    >
      {Icon ? <Icon className="size-3.5 flex-none" /> : null}
      <span className="w-full truncate text-center text-[11px] leading-none">{label}</span>
    </span>
  );
}

function TokenTile({ entry, terms }: { entry: TokenSearchEntry; terms: string[] }) {
  const { onOpenChange } = useSearch();
  const router = useRouter();
  const href = tokenReferenceHref(entry.id);

  return (
    <Link
      href={href}
      // The name wraps across lines and splits into two colours, so spell the id out
      // again for screen readers.
      aria-label={entry.id}
      title={`${entry.id}\n${entry.label}`}
      onClick={(event) => {
        // Keep cmd/ctrl-click opening a tab; a plain click routes through the client
        // router and closes the dialog behind it.
        if (event.metaKey || event.ctrlKey) return;

        event.preventDefault();
        onOpenChange(false);
        router.push(href);
      }}
      onKeyDown={stopEnterPropagation}
      className="flex flex-col gap-1.5 rounded-xl p-1.5 transition-colors hover:bg-bg-transparent-selected active:bg-bg-transparent-selected-pressed focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring"
    >
      <TokenPreview entry={entry} />
      <span className="min-w-0 px-0.5">
        <span className="block wrap-anywhere text-[11px] leading-snug">
          <span className="text-fg-neutral-subtle">
            <Highlighted text={`${entry.group}.`} terms={terms} />
          </span>
          <span className="font-medium text-fg-neutral">
            <Highlighted text={entry.key} terms={terms} />
          </span>
        </span>
        {/* No `block` here — line-clamp needs to set `display: -webkit-box` itself, and a
            display utility alongside it silently wins. Two thirds of the tokens have no
            description; the reserved line keeps a row of those from collapsing to a
            different height than its neighbours. */}
        <span className="mt-0.5 line-clamp-2 min-h-4 text-[11px] leading-snug text-fg-neutral-subtle">
          {entry.description ? <Highlighted text={entry.description} terms={terms} /> : null}
        </span>
      </span>
    </Link>
  );
}

/**
 * Design tokens matching the query, gathered above the document results so a search for
 * `bg.neutral` surfaces the tokens themselves rather than only the pages mentioning
 * them. Each tile links to that token's reference page.
 */
export function TokenResults({
  matches,
  search,
  compact,
}: {
  matches: TokenSearchEntry[];
  search: string;

  /** One row of tiles instead of two, for when the component section is showing as well. */
  compact: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  // A new query is a new list; carrying the expansion over would dump hundreds of tiles
  // on someone who only added a letter.
  useOnChange(search, () => {
    setExpanded(false);
  });

  const terms = useMemo(() => splitQueryTerms(search), [search]);

  if (matches.length === 0) return null;

  const hidden = matches.length - TOKEN_RESULT_LIMIT;

  return (
    <PromotedSection label="토큰" count={matches.length}>
      <ul className={clsx(TOKEN_GRID_CLASS_NAME, compact ? "max-h-[128px]" : "max-h-[264px]")}>
        {(expanded ? matches : matches.slice(0, TOKEN_RESULT_LIMIT)).map((entry) => (
          <li key={entry.id}>
            <TokenTile entry={entry} terms={terms} />
          </li>
        ))}
      </ul>
      {hidden > 0 ? (
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          onKeyDown={stopEnterPropagation}
          className="mt-1.5 w-full cursor-pointer rounded-lg py-1.5 text-xs text-fg-neutral-subtle transition-colors hover:bg-bg-transparent-selected hover:text-fg-neutral focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring"
        >
          {expanded ? "접기" : `${hidden}개 더 보기`}
        </button>
      ) : null}
    </PromotedSection>
  );
}
