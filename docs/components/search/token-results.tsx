"use client";

import { Autocomplete } from "@base-ui/react/autocomplete";
import clsx from "clsx";
import { useSearch } from "fumadocs-ui/components/dialog/search";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type CSSProperties, type ReactNode, useMemo } from "react";
import { TOKEN_KIND_ICON } from "@/components/token-kind-icon";
import { splitQueryTerms } from "@/lib/search-text";
import {
  type ThemedCss,
  TOKEN_RESULT_LIMIT,
  type TokenSearchEntry,
  tokenReferenceHref,
} from "@/lib/token-search";
import { Highlighted, PromotedSection, ShowMore, toRows, useExpandable } from "./promoted-section";

/**
 * Four across the dialog's desktop width, two once it narrows to the viewport. A counted
 * grid rather than the `auto-fill` this once was: a row has to be a row in the markup for the
 * arrow keys to read it, so the count the panel's fixed 720px was already producing is now
 * stated rather than measured.
 */
const TOKEN_COLUMNS = 4;

const TOKEN_ROW_CLASS_NAME = "grid grid-cols-2 gap-2 md:grid-cols-4";

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
        // The `background` shorthand rather than `bg-*`: gradient tokens put a
        // `linear-gradient()` in the variable, and Tailwind can't see through `var()` to
        // tell a colour from an image, so `bg-[var(…)]` compiles to `background-color` and
        // drops every gradient at computed-value time.
        className="block h-11 w-full rounded-lg border border-stroke-neutral-muted [background:var(--token-preview-light)] dark:[background:var(--token-preview-dark)]"
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
    <Autocomplete.Item
      value={entry.id}
      title={`${entry.id}\n${entry.label}`}
      // The cell opens the reference; the anchor below is what makes it a link the browser
      // recognises. Base UI's own handler would close the dialog without routing, so it is
      // stopped and the two paths stay one.
      onClick={(event) => {
        event.preventBaseUIHandler();
        // Keep cmd/ctrl-click opening a tab — the anchor below is left to do it.
        if (event.metaKey || event.ctrlKey) return;

        event.preventDefault();
        onOpenChange(false);
        router.push(href);
      }}
      // A tile only fills the row its grid cell was stretched to if it takes the height:
      // otherwise a one-line description leaves the highlighted ground short of a two-line
      // neighbour's bottom edge.
      className={(state) =>
        clsx(
          "relative flex h-full flex-col gap-1.5 rounded-xl p-1.5 transition-colors active:bg-bg-transparent-selected-pressed",
          state.highlighted && "bg-bg-transparent-selected",
        )
      }
    >
      <TokenPreview entry={entry} />
      <span className="min-w-0 px-0.5">
        <Link
          href={href}
          // The name wraps across lines and splits into two colours, so spell the id out
          // again for screen readers.
          aria-label={entry.id}
          className="block wrap-anywhere text-[11px] leading-snug after:absolute after:inset-0 after:rounded-xl focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring"
        >
          <span className="text-fg-neutral-subtle">
            <Highlighted text={`${entry.group}.`} terms={terms} />
          </span>
          <span className="font-medium text-fg-neutral">
            <Highlighted text={entry.key} terms={terms} />
          </span>
        </Link>
        {/* No `block` here — line-clamp needs to set `display: -webkit-box` itself, and a
            display utility alongside it silently wins. Two thirds of the tokens have no
            description; the reserved line keeps a row of those from collapsing to a
            different height than its neighbours. */}
        <span className="mt-0.5 line-clamp-2 min-h-4 text-[11px] leading-snug text-fg-neutral-subtle">
          {entry.description ? <Highlighted text={entry.description} terms={terms} /> : null}
        </span>
      </span>
    </Autocomplete.Item>
  );
}

/**
 * Design tokens matching the query, gathered above the document results so a search for
 * `bg.neutral` surfaces the tokens themselves rather than only the pages mentioning
 * them. Each tile links to that token's reference page.
 */
export function TokenResults({ matches, search }: { matches: TokenSearchEntry[]; search: string }) {
  const { visible, hidden, expanded, toggle } = useExpandable({
    search,
    matches,
    limit: TOKEN_RESULT_LIMIT,
  });

  const terms = useMemo(() => splitQueryTerms(search), [search]);

  if (matches.length === 0) return null;

  return (
    <PromotedSection label="토큰" count={matches.length}>
      <div className="flex flex-col gap-2">
        {toRows(visible, TOKEN_COLUMNS).map((row) => (
          <Autocomplete.Row key={row[0].id} className={TOKEN_ROW_CLASS_NAME}>
            {row.map((entry) => (
              <TokenTile key={entry.id} entry={entry} terms={terms} />
            ))}
          </Autocomplete.Row>
        ))}
      </div>
      <ShowMore hidden={hidden} expanded={expanded} onToggle={toggle} />
    </PromotedSection>
  );
}
