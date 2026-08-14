"use client";

import clsx from "clsx";
import { useSearch } from "fumadocs-ui/components/dialog/search";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { IconSeedArrow } from "@/components/icon-seed-arrow";
import type { ComponentSearchEntry } from "@/lib/component-search";
import { PLATFORM_CONFIG } from "@/lib/platform-status";
import { splitQueryTerms } from "@/lib/search-text";
import { isExternalUrl } from "@/lib/url";
import { Highlighted, PromotedSection, stopEnterPropagation } from "./promoted-section";

/**
 * Two cards tall, or one when the token section is showing too — the dialog's top is pinned
 * as if the card were always at its tallest (`search.tsx`), so a second promoted block has
 * to come out of the height already budgeted rather than push past it. The rest scroll: a
 * query that names a family (`button`) matches five or six components.
 */
const COMPONENT_GRID_CLASS_NAME =
  "grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-2 overflow-y-auto";

const BADGE_CLASS_NAME =
  "inline-flex items-center gap-0.5 rounded-md bg-bg-neutral-weak-alpha px-1.5 py-0.5 text-[11px] leading-[1.4] text-fg-neutral-muted";

const BADGE_LINK_CLASS_NAME =
  "transition-colors hover:text-fg-neutral hover:underline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-stroke-focus-ring";

/**
 * One platform the component has shipped on. A badge without a link still reports the
 * rollout — Sanity carries the URL per platform and only some are filled in.
 */
function PlatformBadge({ label, href }: { label: string; href?: string }) {
  const { onOpenChange } = useSearch();
  const router = useRouter();

  if (!href) return <span className={BADGE_CLASS_NAME}>{label}</span>;

  if (isExternalUrl(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onKeyDown={stopEnterPropagation}
        className={clsx(BADGE_CLASS_NAME, BADGE_LINK_CLASS_NAME)}
      >
        {label}
        <IconSeedArrow external className="size-2.5" />
      </a>
    );
  }

  return (
    <Link
      href={href}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey) return;

        event.preventDefault();
        onOpenChange(false);
        router.push(href);
      }}
      onKeyDown={stopEnterPropagation}
      className={clsx(BADGE_CLASS_NAME, BADGE_LINK_CLASS_NAME)}
    >
      {label}
      <IconSeedArrow className="size-2.5" />
    </Link>
  );
}

function ComponentCard({ entry, terms }: { entry: ComponentSearchEntry; terms: string[] }) {
  const { onOpenChange } = useSearch();
  const router = useRouter();

  return (
    <li className="relative flex gap-2.5 rounded-xl p-1.5 transition-colors hover:bg-bg-transparent-selected active:bg-bg-transparent-selected-pressed">
      <div className="relative aspect-video w-24 shrink-0 overflow-hidden rounded-lg bg-bg-transparent-selected">
        {entry.thumbnail ? (
          <Image
            src={entry.thumbnail}
            alt=""
            fill
            loading="lazy"
            decoding="async"
            sizes="96px"
            className="object-cover"
          />
        ) : null}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        {/* The `after` overlay makes the whole card open the guideline while leaving the
            platform badges as links of their own — an anchor can't nest inside an anchor. */}
        <Link
          href={entry.url}
          onClick={(event) => {
            // Keep cmd/ctrl-click opening a tab; a plain click routes through the client
            // router and closes the dialog behind it.
            if (event.metaKey || event.ctrlKey) return;

            event.preventDefault();
            onOpenChange(false);
            router.push(entry.url);
          }}
          onKeyDown={stopEnterPropagation}
          className="text-[13px] font-medium leading-snug text-fg-neutral after:absolute after:inset-0 after:rounded-xl focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring"
        >
          <span className="block truncate">
            <Highlighted text={entry.title} terms={terms} />
          </span>
        </Link>
        {entry.description ? (
          <p className="line-clamp-1 text-[11px] leading-snug text-fg-neutral-subtle">
            <Highlighted text={entry.description} terms={terms} />
          </p>
        ) : null}
        {entry.platforms.length > 0 ? (
          // `relative` lifts the badges over the card-wide overlay above, which is painted
          // as part of an earlier sibling.
          <div className="relative mt-1 flex flex-wrap gap-1">
            {PLATFORM_CONFIG.map(({ key, label }) => {
              const platform = entry.platforms.find((shipped) => shipped.key === key);
              return platform ? (
                <PlatformBadge key={key} label={label} href={platform.url} />
              ) : null;
            })}
          </div>
        ) : null}
      </div>
    </li>
  );
}

/**
 * Component documents matching the query, promoted above the document results so a search
 * for `button` leads with the components themselves — cover, summary and the platforms they
 * ship on — rather than with whichever page happened to mention one.
 */
export function ComponentResults({
  matches,
  search,
  compact,
}: {
  matches: ComponentSearchEntry[];
  search: string;

  /** One row instead of two, for when the token section is showing as well. */
  compact: boolean;
}) {
  const terms = useMemo(() => splitQueryTerms(search), [search]);

  if (matches.length === 0) return null;

  return (
    <PromotedSection label="컴포넌트" count={matches.length}>
      <ul className={clsx(COMPONENT_GRID_CLASS_NAME, compact ? "max-h-[68px]" : "max-h-[144px]")}>
        {matches.map((entry) => (
          <ComponentCard key={entry.slug} entry={entry} terms={terms} />
        ))}
      </ul>
    </PromotedSection>
  );
}
