import { clsx } from "cn";
import type { ReactNode } from "react";

const TONES = {
  neutral: "bg-bg-neutral-weak text-fg-neutral",
  warning: "bg-bg-warning-weak text-fg-warning",
  informative: "bg-bg-informative-weak text-fg-informative",
  positive: "bg-bg-positive-weak text-fg-positive",
  critical: "bg-bg-critical-weak text-fg-critical",
  brand: "bg-bg-brand-weak text-fg-brand",
} as const satisfies Record<string, string>;

interface BadgeProps {
  tone?: keyof typeof TONES;
  className?: string;
  children: ReactNode;
}

export function Badge({ tone = "neutral", children, ...props }: BadgeProps) {
  const className = TONES[tone] ?? TONES.neutral;

  return (
    <span
      className={clsx(
        "not-prose inline-flex items-center rounded-full px-2 py-1 text-sm font-medium",
        className,
        props.className,
      )}
    >
      {children}
    </span>
  );
}
