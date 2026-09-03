"use client";

import { clsx } from "cn";
import Link from "next/link";
import { SeedMark } from "../landing/seed-mark";
import { SeedWordmark } from "../landing/seed-wordmark";
import { SearchButton, ThemeToggle } from "./header-actions";
import { SiteNav } from "./nav-menu";

export interface SiteHeaderProps {
  /** Show the light/dark toggle. Off for contexts that manage theme elsewhere. */
  showThemeToggle?: boolean;
  density?: "default" | "docs";
  className?: string;
}

/**
 * Shared desktop header bar (Figma "Header"): logo left, centered nav, actions right.
 * A fixed-height 3-column grid keeps the nav dead-centered regardless of the side
 * clusters' widths. Matches the landing Full header — logo h-10, background-less link
 * nav — so the two read as one header. Docs-only differences: the theme toggle and the
 * opaque bar (background set on DocsHeader); colors use SEED tokens for dark mode. The
 * desktop bar is h-[76px] and landing mirrors it so the fumadocs --fd-header-height never
 * shifts between the two. Width and
 * centering come from the fumadocs `grid-area: header` on DocsHeader (spans sidebar +
 * main + toc), so the logo lines up with the sidebar and actions with the ToC.
 */
export function SiteHeader({
  showThemeToggle = true,
  density = "default",
  className,
}: SiteHeaderProps) {
  const isDocsDensity = density === "docs";
  const actionButtonClassName = isDocsDensity
    ? "min-[968px]:size-8 min-[1120px]:size-9"
    : undefined;

  return (
    <div
      className={clsx(
        "grid h-[76px] w-full grid-cols-[1fr_auto_1fr] items-center px-4",
        isDocsDensity &&
          "min-[968px]:h-[72px] min-[968px]:px-3 min-[1120px]:h-[76px] min-[1120px]:px-4",
        className,
      )}
    >
      <Link
        href="/"
        aria-label="SEED Design System 홈"
        className="flex items-center justify-self-start text-palette-gray-1000 dark:text-palette-static-white"
      >
        <SeedMark
          className={clsx(
            "h-10 w-auto shrink-0",
            isDocsDensity && "min-[968px]:h-8 min-[1120px]:h-9 min-[1280px]:h-10",
          )}
        />
        <SeedWordmark
          className={clsx(
            "ml-2 h-10 w-auto",
            isDocsDensity &&
              "min-[968px]:ml-1.5 min-[968px]:h-8 min-[1120px]:ml-2 min-[1120px]:h-9 min-[1280px]:h-10",
          )}
        />
      </Link>

      <SiteNav density={density} />

      <div className="flex items-center gap-1.5 justify-self-end text-fg-neutral">
        {showThemeToggle && <ThemeToggle className={actionButtonClassName} />}
        <SearchButton className={actionButtonClassName} />
      </div>
    </div>
  );
}
