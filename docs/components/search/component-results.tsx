"use client";

import clsx from "clsx";
import { useSearch } from "fumadocs-ui/components/dialog/search";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { IconSeedArrow } from "@/components/icon-seed-arrow";
import { COMPONENT_RESULT_LIMIT, type ComponentSearchEntry } from "@/lib/component-search";
import { PLATFORM_CONFIG } from "@/lib/platform-status";
import { splitQueryTerms } from "@/lib/search-text";
import { isExternalUrl } from "@/lib/url";
import { Highlighted, PromotedSection, ShowMore, useExpandable } from "./promoted-section";

/**
 * Three across on the dialog's desktop width, two once it narrows to the viewport — a fixed
 * count rather than `auto-fill`, since the panel is 720px wide at every desktop size and so
 * would never change column count on its own.
 */
const COMPONENT_GRID_CLASS_NAME = "grid grid-cols-2 gap-2 md:grid-cols-3";

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
    <li className="relative flex flex-col gap-2 rounded-xl p-1.5 transition-colors hover:bg-bg-transparent-selected active:bg-bg-transparent-selected-pressed">
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
      {entry.components.length > 0 ? (
        // `mt-auto` drops the badges to the card's floor, so a row of cards lines its
        // platforms up however unevenly the titles and summaries above them ran. `relative`
        // lifts them over the card-wide overlay, which an earlier sibling paints.
        <div className="relative mt-auto flex flex-col gap-1 px-0.5">
          {entry.components.map(({ name, platforms }) => (
            <div key={name} className="flex flex-wrap items-center gap-1">
              {/* A page documenting one component is already named by the card's title;
                  one documenting several names each row, like its own status table. */}
              {entry.components.length > 1 ? (
                <span className="w-full text-[11px] font-medium leading-[1.4] text-fg-neutral">
                  {name}
                </span>
              ) : null}
              {PLATFORM_CONFIG.map(({ key, label }) => {
                const platform = platforms.find((shipped) => shipped.key === key);
                return platform ? (
                  <PlatformBadge key={key} label={label} href={platform.url} />
                ) : null;
              })}
            </div>
          ))}
        </div>
      ) : null}
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
      <ul className={COMPONENT_GRID_CLASS_NAME}>
        {visible.map((entry) => (
          <ComponentCard key={entry.slug} entry={entry} terms={terms} />
        ))}
      </ul>
      <ShowMore hidden={hidden} expanded={expanded} onToggle={toggle} />
    </PromotedSection>
  );
}
