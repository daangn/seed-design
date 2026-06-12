"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { NAV_ITEMS } from "./lib/landing-content";
import { SeedMark } from "./seed-mark";

/**
 * - `transparent`: hero only — no backgrounds, dark text/icons directly on the video.
 * - `solid`: every section after hero — logo / nav / actions each sit on their own
 *   translucent-white pill, dark text. Unified so the header stops "flickering"
 *   between modes as section backgrounds change.
 * - `hidden`: footer — keeps the solid look but slides up and fades out.
 */
export type HeaderVariant = "transparent" | "solid" | "hidden";

const cx = (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(" ");

/** Color morph shared across header parts (background/text fade). */
const MORPH = "transition-colors duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]";

/** Translucent white capsule for the logo / nav / action pills in the solid state. */
const PILL = "bg-white/80 backdrop-blur-md ring-1 ring-black/5";

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
 * Unified landing header. Layout is identical across states (no reflow); the logo,
 * nav, and actions each carry a translucent-white pill that fades in after hero and
 * stays put through every section, then the whole bar slides away over the footer.
 */
export function LandingHeader({ variant }: { variant: HeaderVariant }) {
  const isTransparent = variant === "transparent";
  const isHidden = variant === "hidden";
  const pill = isTransparent ? "bg-transparent" : PILL;

  return (
    <header
      className={cx(
        "fixed inset-x-0 top-0 z-[100]",
        "transition-[transform,opacity] duration-[500ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
        isHidden ? "-translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100",
      )}
    >
      <div className="mx-auto flex w-full max-w-[1760px] items-center justify-between gap-6 px-8 py-5">
        {/* Left: mark + wordmark on a pill, pinned to the left edge */}
        <div
          className={cx(
            "flex shrink-0 items-center gap-2 rounded-full text-[#212121]",
            MORPH,
            !isTransparent && "px-3 py-1.5",
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
