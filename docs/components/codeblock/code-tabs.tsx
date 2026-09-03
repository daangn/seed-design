"use client";

import { ChipTabs } from "@seed-design/react";
import { clsx } from "cn";
import type { ReactNode } from "react";
import { ChipTabTrigger } from "../tabs/chip-tab-trigger";
import { useSyncedTab } from "../tabs/use-synced-tab";
import {
  CodeCardDivider,
  codeCardClassName,
  codeCardHeaderClassName,
  codeViewportClassName,
} from "./code-card";
import { CopyButton } from "./copy-button";

export interface CodeTabsShellItem {
  value: string;
  label: ReactNode;
  /** Highlighted code for this tab (a Fumadocs `<Pre>` element). */
  children: ReactNode;
}

interface CodeTabsShellProps {
  items: CodeTabsShellItem[];
  /** Persist + sync the selected tab across sibling blocks (e.g. package managers). */
  groupId?: string;
  className?: string;
}

/**
 * Interactive shell for a tabbed code block: one card whose header holds SEED chip
 * tabs (`ChipTabs`) + the copy button, a divider, then the selected tab's code. When a
 * `groupId` is set, the selection is persisted to localStorage and synced across sibling
 * blocks (mirrors Fumadocs' `groupId`/`persist` package-manager behavior).
 */
export function CodeTabsShell({ items, groupId, className }: CodeTabsShellProps) {
  const [value, onValueChange] = useSyncedTab(
    items.map((item) => item.value),
    groupId,
  );

  return (
    <ChipTabs.Root
      data-code-card
      value={value}
      onValueChange={onValueChange}
      variant="neutralOutline"
      size="medium"
      className={clsx(codeCardClassName, className)}
    >
      <div className={codeCardHeaderClassName}>
        <ChipTabs.List className="flex-1 !px-0">
          {items.map((item) => (
            <ChipTabTrigger key={item.value} value={item.value} selected={value === item.value}>
              {item.label}
            </ChipTabTrigger>
          ))}
        </ChipTabs.List>
        <CopyButton />
      </div>
      <CodeCardDivider />
      {items.map((item) => (
        <ChipTabs.Content
          key={item.value}
          value={item.value}
          tabIndex={value === item.value ? 0 : -1}
          // The chip-tabs recipe CSS is unlayered, so neutralize its carousel-oriented
          // `flex: 0 0 100%` / `overflow-x: hidden` with important utilities. (Display is
          // left untouched so the recipe still hides inactive panels.)
          className={clsx(codeViewportClassName, "!flex-none !overflow-auto")}
        >
          {item.children}
        </ChipTabs.Content>
      ))}
    </ChipTabs.Root>
  );
}
