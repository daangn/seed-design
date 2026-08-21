"use client";

import { ChipTabs } from "@seed-design/react";
import { type CSSProperties, type ReactNode, useState } from "react";

interface ChipTabTriggerProps {
  value: string;
  selected: boolean;
  children: ReactNode;
}

/**
 * A ChipTabs trigger styled like a SEED SideNavigation item: borderless, transparent-alpha
 * backgrounds, muted text (neutral when selected). Applied as an inline `style`, which
 * beats the unlayered chip-tabs recipe by specificity — so no `global.css` override is
 * needed. The selected state comes from the parent (controlled tabs); hover is tracked
 * locally since inline styles can't express `:hover`.
 */
export function ChipTabTrigger({ value, selected, children }: ChipTabTriggerProps) {
  const [hovered, setHovered] = useState(false);

  const backgroundColor = selected
    ? hovered
      ? "var(--seed-color-bg-transparent-selected-pressed)"
      : "var(--seed-color-bg-transparent-selected)"
    : hovered
      ? "var(--seed-color-bg-transparent-pressed)"
      : "var(--seed-color-bg-transparent)";

  const style: CSSProperties = {
    border: "none",
    backgroundColor,
    color: selected ? "var(--seed-color-fg-neutral)" : "var(--seed-color-fg-neutral-muted)",
  };

  return (
    <ChipTabs.Trigger
      value={value}
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </ChipTabs.Trigger>
  );
}
