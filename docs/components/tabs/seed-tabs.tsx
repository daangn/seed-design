"use client";

import { ChipTabs } from "@seed-design/react";
import { clsx } from "cn";
import {
  Children,
  createContext,
  type ReactElement,
  type ReactNode,
  isValidElement,
  useContext,
} from "react";
import { ChipTabTrigger } from "./chip-tab-trigger";
import { useSyncedTab } from "./use-synced-tab";

type TabProps = { value?: string; children?: ReactNode };

const TabsDepthContext = createContext(0);

/**
 * Structural marker for a content tab. `SeedTabs` reads its `value`/`children` props;
 * this is never mounted directly.
 */
export function SeedTab(_: TabProps) {
  return null;
}

interface SeedTabsProps {
  /** Tab labels (Fumadocs `<Tabs items={[...]}>`). */
  items?: string[];
  groupId?: string;
  className?: string;
  /**
   * Wrap the tabs + panel in a bordered card so the demo reads as one content block.
   * Used for preview/code component demos (`ComponentExample`, `StackflowExample`). The
   * selected panel's code block is stripped of its own border/radius to merge with the card.
   */
  card?: boolean;
  children?: ReactNode;
}

/**
 * SEED chip-styled replacement for Fumadocs' content `<Tabs>`/`<Tab>`: a row of SEED
 * chips above the selected panel. Used for all MDX content tabs (e.g. "CLI로 추가/직접
 * 추가", "Vite 8/Vite 7 이하") and, with `card`, for preview/code component demos. Code
 * blocks inside a panel render as normal `SeedCodeBlock` cards (no `CodeTabContext` here).
 */
export function SeedTabs({ items, groupId, className, card = false, children }: SeedTabsProps) {
  const depth = useContext(TabsDepthContext);
  const nested = depth > 0;

  const tabEls = Children.toArray(children).filter((child): child is ReactElement<TabProps> =>
    isValidElement(child),
  );

  const tabs = tabEls.map((tab, index) => ({
    value: tab.props.value ?? items?.[index] ?? String(index),
    label: (items?.[index] ?? tab.props.value ?? String(index)) as ReactNode,
    content: tab.props.children,
  }));

  const [value, onValueChange] = useSyncedTab(
    tabs.map((tab) => tab.value),
    groupId,
  );

  return (
    <TabsDepthContext.Provider value={depth + 1}>
      <ChipTabs.Root
        value={value}
        onValueChange={onValueChange}
        variant="neutralOutline"
        size="medium"
        className={clsx(
          nested ? "my-3" : "my-4",
          "flex flex-col overflow-visible rounded-r3 border border-solid border-stroke-neutral-muted",
          className,
        )}
      >
        <div className={card || !nested ? "px-x4 pt-x3 pb-x3" : "px-x3 py-x2_5"}>
          <ChipTabs.List className="!px-0">
            {tabs.map((tab) => (
              <ChipTabTrigger key={tab.value} value={tab.value} selected={value === tab.value}>
                {tab.label}
              </ChipTabTrigger>
            ))}
          </ChipTabs.List>
        </div>
        <div className="h-px shrink-0 bg-stroke-neutral-muted" />
        {tabs.map((tab) => (
          <ChipTabs.Content
            key={tab.value}
            value={tab.value}
            // Neutralize carousel-oriented styles. A transformed tab panel becomes the containing
            // block for fixed overlay examples, so sheets/dialogs must opt out of that transform.
            className={clsx(
              "!flex-none !overflow-visible ![transform:none]",
              card
                ? "[&>figure]:my-0 [&>figure]:rounded-none [&>figure]:border-0"
                : nested
                  ? "px-x3 py-x3 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                  : "px-x4 py-x4 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
            )}
          >
            {tab.content}
          </ChipTabs.Content>
        ))}
      </ChipTabs.Root>
    </TabsDepthContext.Provider>
  );
}
