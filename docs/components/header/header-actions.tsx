"use client";

import { useTheme as useSeedTheme } from "@/hooks/useTheme";
import {
  IconMagnifyingglassFill,
  IconMoonFill,
  IconSunFill,
} from "@karrotmarket/react-monochrome-icon";
import clsx from "clsx";
import { useSearchContext } from "fumadocs-ui/contexts/search";
import { useTheme as useFumaTheme } from "fumadocs-ui/provider/base";
import type { ReactNode } from "react";

/** Circular icon button (r-full, neutral-weak, 16px icon). */
export function ActionButton({
  label,
  onClick,
  className,
  size = "size-9",
  children,
}: {
  label: string;
  onClick?: () => void;
  className?: string;
  size?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={clsx(
        "flex cursor-pointer items-center justify-center rounded-full bg-bg-transparent-selected text-fg-neutral transition-colors hover:bg-bg-transparent-selected-pressed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring [&_svg]:size-4",
        size,
        className,
      )}
    >
      {children}
    </button>
  );
}

/**
 * Light/dark toggle. Current scheme is read from the SEED attribute (SSR-safe, no
 * next-themes hydration flash); the write goes through fumadocs' theme provider,
 * which useThemeSync mirrors back onto the SEED tokens.
 */
export function ThemeToggle({ className, size }: { className?: string; size?: string }) {
  // Toggle direction comes from next-themes' own state (source of truth). The SEED
  // attribute lags it on load, so basing direction on userColorScheme flips wrong.
  const { resolvedTheme, setTheme } = useFumaTheme();
  const { userColorScheme } = useSeedTheme();
  const isDark = userColorScheme === "dark";
  return (
    <ActionButton
      label="테마 전환"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={className}
      size={size}
    >
      {isDark ? <IconSunFill /> : <IconMoonFill />}
    </ActionButton>
  );
}

export function SearchButton({ className, size }: { className?: string; size?: string }) {
  const { setOpenSearch } = useSearchContext();
  return (
    <ActionButton
      label="검색"
      onClick={() => setOpenSearch(true)}
      className={className}
      size={size}
    >
      <IconMagnifyingglassFill />
    </ActionButton>
  );
}
