import type { ReactNode } from "@lynx-js/react";
import { clsx } from "cn";

const GAP_CLASS_NAMES = {
  "12px": "gap-x3",
  "16px": "gap-x4",
} as const;

export function CatalogExamples({
  title,
  gap,
  children,
}: {
  title: string;
  gap?: string;
  children: ReactNode;
}) {
  const gapClassName =
    gap == null ? undefined : GAP_CLASS_NAMES[gap as keyof typeof GAP_CLASS_NAMES];

  return (
    <scroll-view
      scroll-y
      className={clsx("flex flex-col flex-1 min-h-0 p-x4 bg-bg-layer-default", gapClassName)}
    >
      <text className="t7-bold text-fg-neutral">{title}</text>
      {children}
    </scroll-view>
  );
}

export function CatalogSectionTitle({ children }: { children: string }) {
  return <text className="t5-bold mt-x2 text-fg-neutral">{children}</text>;
}

export function CatalogSectionHeader({ children }: { children: string }) {
  return <text className="t4-bold mt-x4 mb-x2 text-fg-neutral-subtle">{children}</text>;
}
