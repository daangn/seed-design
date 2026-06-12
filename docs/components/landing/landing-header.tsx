"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { NAV_ITEMS } from "./lib/landing-content";
import { SeedMark } from "./seed-mark";

/**
 * - `transparent`: hero only — pills have no background, dark text/icons directly
 *   on the video.
 * - `solid`: every section after hero — the same layout, but the logo / nav /
 *   action pills fade in a translucent-white background.
 * - `hidden`: footer — keeps the solid look but slides up out of view (and slides
 *   back down when you scroll back up).
 *
 * Padding is identical across states (only the background color animates), so the
 * header never shifts layout as it morphs.
 */
export type HeaderVariant = "transparent" | "solid" | "hidden";

const cx = (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(" ");

/** Color morph shared across header parts (background fades, layout stays put). */
const MORPH = "transition-colors duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]";

/** Translucent white capsule background (no stroke / shadow). */
const PILL = "bg-white/80 backdrop-blur-md";

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="m21 21-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ThemeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconButton({
  label,
  pillClass,
  children,
}: {
  label: string;
  pillClass: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cx(
        MORPH,
        "flex size-10 items-center justify-center rounded-full text-[#212121] hover:opacity-70",
        pillClass,
      )}
    >
      {children}
    </button>
  );
}

/**
 * Unified landing header. The logo, nav, and actions each carry a pill whose
 * background fades in after hero and stays put through every section; over the
 * footer the whole bar slides up out of view.
 */
export function LandingHeader({ variant }: { variant: HeaderVariant }) {
  const isTransparent = variant === "transparent";
  const isHidden = variant === "hidden";
  const pill = isTransparent ? "bg-transparent" : PILL;

  return (
    <header
      className={cx(
        "fixed inset-x-0 top-0 z-[100]",
        "transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
        isHidden ? "-translate-y-full" : "translate-y-0",
        isHidden && "pointer-events-none",
      )}
    >
      <div className="mx-auto flex w-full max-w-[1760px] items-center justify-between gap-6 px-8 py-5">
        {/* Left: mark + wordmark on a pill, pinned to the left edge. Padding is
            always present so only the background animates (no layout shift). */}
        <div
          className={cx(
            "flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-[#212121]",
            MORPH,
            pill,
          )}
        >
          <SeedMark className="h-6 w-5" />
          <span className="font-bold text-lg leading-none tracking-tight">SEED</span>
        </div>

        {/* Center: navigation capsule */}
        <nav
          className={cx(
            "flex items-center gap-6 rounded-full px-5 py-2.5 text-[#212121]",
            MORPH,
            pill,
          )}
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-1 whitespace-nowrap font-medium text-sm hover:opacity-70"
            >
              {item.label}
              {item.hasDropdown && <ChevronDown className="size-3.5" />}
            </Link>
          ))}
        </nav>

        {/* Right: actions, pinned to the right edge */}
        <div className="flex shrink-0 items-center gap-2">
          <IconButton label="Toggle theme" pillClass={pill}>
            <ThemeIcon className="size-[18px]" />
          </IconButton>
          <IconButton label="Search" pillClass={pill}>
            <SearchIcon className="size-[18px]" />
          </IconButton>
        </div>
      </div>
    </header>
  );
}
