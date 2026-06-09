"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { NAV_ITEMS } from "./lib/landing-content";
import { SeedMark } from "./seed-mark";

export type HeaderVariant = "compact" | "expanded-light" | "dark-translucent";

const cx = (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(" ");

/** Shared morph transition (color + duration + easing) reused across header parts. */
const MORPH = "transition-colors duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]";

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
  textColor,
  bgClass,
  children,
}: {
  label: string;
  textColor: string;
  bgClass: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cx(
        MORPH,
        "flex size-10 items-center justify-center rounded-full hover:opacity-70",
        textColor,
        bgClass,
      )}
    >
      {children}
    </button>
  );
}

/**
 * Morphing landing header. Layout stays identical across states (no reflow); only
 * max-width, background colors, and text color animate. Three states, driven by
 * the active section:
 * - compact: narrow, no backgrounds (section 1)
 * - expanded-light: full width, nav pill + circular actions on neutral-weak (2, 6)
 * - dark-translucent: full-width translucent dark bar, white text, no nav pill (3, 4, 5)
 */
export function LandingHeader({ variant }: { variant: HeaderVariant }) {
  const isCompact = variant === "compact";
  const isDark = variant === "dark-translucent";
  const isLight = variant === "expanded-light";

  const textColor = isDark ? "text-white" : "text-[#212121]";
  const navBg = isLight ? "bg-bg-neutral-weak" : "bg-transparent";
  const iconBg = isLight ? "bg-bg-neutral-weak" : isDark ? "bg-white/10" : "bg-transparent";

  return (
    <header
      className={cx(
        "fixed inset-x-0 top-0 z-[100]",
        MORPH,
        isDark ? "bg-[#1A1C20CC] backdrop-blur-md" : "bg-transparent",
      )}
    >
      <div
        className={cx(
          "mx-auto flex w-full items-center justify-between gap-6 px-8 py-5",
          "transition-[max-width] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          isCompact ? "max-w-[760px]" : "max-w-[1760px]",
        )}
      >
        {/* Left: mark + wordmark (always visible) */}
        <div className="flex shrink-0 items-center gap-2">
          <SeedMark className={cx("h-6 w-5", MORPH, textColor)} />
          <span className={cx("font-bold text-lg leading-none tracking-tight", MORPH, textColor)}>
            SEED
          </span>
        </div>

        {/* Center: navigation */}
        <nav className={cx("flex items-center gap-6 rounded-full px-5 py-2.5", MORPH, navBg)}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cx(
                "flex items-center gap-1 whitespace-nowrap font-medium text-sm hover:opacity-70",
                MORPH,
                textColor,
              )}
            >
              {item.label}
              {item.hasDropdown && <ChevronDown className="size-3.5" />}
            </Link>
          ))}
        </nav>

        {/* Right: actions */}
        <div className="flex shrink-0 items-center gap-2">
          <IconButton label="Toggle theme" textColor={textColor} bgClass={iconBg}>
            <ThemeIcon className="size-[18px]" />
          </IconButton>
          <IconButton label="Search" textColor={textColor} bgClass={iconBg}>
            <SearchIcon className="size-[18px]" />
          </IconButton>
        </div>
      </div>
    </header>
  );
}
