"use client";

import { IconChevronUpSmallFill } from "@karrotmarket/react-monochrome-icon";
import { IconSeedArrow } from "@/components/icon-seed-arrow";
import { SideNavigation as SeedSideNavigation } from "@seed-design/react";
import { useSideNavigationContext } from "@seed-design/react/primitive";
import clsx from "clsx";
import type * as PageTree from "fumadocs-core/page-tree";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { isTabbedFolder } from "@/lib/tabbed";
import { isNewPage } from "@/lib/new-page";
import { SidebarNewDot } from "./sidebar-new-dot";
import {
  type SidebarFolderItem,
  type SidebarGroup,
  type SidebarLeafItem,
  isSidebarFolderItem,
} from "./lib/sidebar-items";

const SIDEBAR_ITEM_LABEL_PADDING_BASE = 2;
const SIDEBAR_ITEM_LABEL_PADDING_PER_LEVEL = 6;
const SIDEBAR_ITEM_HEIGHT = 40;
const SIDEBAR_ITEM_RADIUS = 8;
const SIDEBAR_ITEM_LABEL_CLASS = "t4-regular";
const SIDEBAR_GROUP_LABEL_CLASS = "t2-regular px-2.5 pb-1 text-fd-muted-foreground/70";
const SIDEBAR_REGULAR_WEIGHT = "var(--seed-font-weight-regular)";

function getSidebarItemRootClass(current: boolean) {
  // No active background here: the SEED side-navigation-menu-item recipe already paints
  // the current item with `bg-transparent-selected` (hue-0 static-alpha, same token the
  // prev/next cards use). We only set the active text color; adding a `bg-fd-accent`
  // overlay would re-introduce a cool tint and diverge from prev/next.
  return clsx(
    "[&::before]:rounded-[8px]",
    current ? "text-fd-foreground" : "text-fd-muted-foreground",
  );
}

function getSidebarItemRootStyle(): CSSProperties {
  return {
    height: `var(--docs-sidebar-item-height, ${SIDEBAR_ITEM_HEIGHT}px)`,
    flexShrink: 0,
    borderRadius: SIDEBAR_ITEM_RADIUS,
  };
}

function getSidebarItemLabelPadding(level: number) {
  return SIDEBAR_ITEM_LABEL_PADDING_BASE + level * SIDEBAR_ITEM_LABEL_PADDING_PER_LEVEL;
}

function getSidebarItemLabelClass(current: boolean) {
  return clsx(
    SIDEBAR_ITEM_LABEL_CLASS,
    current ? "text-fd-foreground" : "text-fd-muted-foreground",
  );
}

function getSidebarItemLabelStyle(level: number): CSSProperties {
  return {
    paddingLeft: getSidebarItemLabelPadding(level),
    fontWeight: SIDEBAR_REGULAR_WEIGHT,
  };
}

export function usePersistentOpenState(defaultOpen: boolean, current: boolean) {
  const [open, setOpen] = useState(defaultOpen || current);
  const wasCurrent = useRef(current);

  useEffect(() => {
    if (!wasCurrent.current && current) setOpen(true);
    wasCurrent.current = current;
  }, [current]);

  return [open, setOpen] as const;
}

/** Whether this node contains the current route. */
function containsActive(node: PageTree.Node, pathname: string): boolean {
  if (node.type === "page") return node.external !== true && node.url === pathname;
  if (node.type === "folder")
    return (
      (node.index ? containsActive(node.index, pathname) : false) ||
      node.children.some((child) => containsActive(child, pathname))
    );
  return false;
}

interface FlattenedPage {
  page: PageTree.Item;
  level: number;
}

/** All descendant pages of a node, index first. Nested pages stay flat but keep level depth. */
function flattenPages(node: PageTree.Node, level = 1): FlattenedPage[] {
  if (node.type === "page") return [{ page: node, level }];
  if (node.type === "folder")
    return [
      ...(node.index ? [{ page: node.index, level }] : []),
      ...node.children.flatMap((child) => flattenPages(child, level + 1)),
    ];
  return [];
}

/** Fumadocs page tree → SEED SideNavigation groups. A `separator` opens a new group;
 *  `page`/`folder` nodes fill the current group (folders become collapsible sub-lists). */
export function buildSidebarGroups(nodes: PageTree.Node[], pathname: string): SidebarGroup[] {
  const leaf = (page: PageTree.Item, index: number, level: number): SidebarLeafItem => {
    const external = page.external === true;
    return {
      key: page.$id ?? page.url ?? index,
      label: page.name,
      level,
      // External links (e.g. `external:[llms.txt](/llms.txt)`) are never the current route.
      current: !external && page.url === pathname,
      external,
      isNew: isNewPage(page),
      href: page.url,
    };
  };

  const groups: SidebarGroup[] = [];
  let current: SidebarGroup = { key: "__initial", items: [] };
  const flush = () => {
    if (current.items.length > 0 || current.label != null) groups.push(current);
  };

  nodes.forEach((node, index) => {
    if (node.type === "separator") {
      flush();
      // A named separator (`---Foundation---`) becomes a group label; a bare `---` becomes a
      // hairline divider between groups (used to split Overview/Progress Board from the rest).
      current = {
        key: node.$id ?? `sep-${index}`,
        label: node.name,
        divider: node.name == null,
        items: [],
      };
      return;
    }
    if (node.type === "page") {
      current.items.push(leaf(node, index, 0));
      return;
    }
    if (node.type === "folder") {
      const indexUrl = node.index?.url;
      // 탭형 subject 폴더(meta.json layout: "tabs")는 펼치지 않고 leaf 하나로(인덱스로 링크).
      // 자식(facet)은 사이드바에 노출하지 않고 페이지 상단 탭 스트립(DocsTabStrip)에서만 보여준다.
      if (isTabbedFolder(node) && indexUrl != null) {
        current.items.push({
          key: node.$id ?? `tabbed-folder-${index}`,
          label: node.name,
          level: 0,
          current: containsActive(node, pathname),
          // 폴더 라벨은 meta.json `title`이지만 `new`는 인덱스 페이지 frontmatter에서 온다.
          isNew: node.index ? isNewPage(node.index) : false,
          href: indexUrl,
        });
        return;
      }
      current.items.push({
        key: node.$id ?? `folder-${index}`,
        label: node.name,
        defaultOpen: node.defaultOpen ?? false,
        current: containsActive(node, pathname),
        items: flattenPages(node).map(({ page, level }, pageIndex) => leaf(page, pageIndex, level)),
      });
    }
  });
  flush();

  return groups;
}

function DocsSideNavigationItem({ item }: { item: SidebarLeafItem }) {
  return (
    <SeedSideNavigation.Item
      asChild
      current={item.current}
      className={getSidebarItemRootClass(item.current)}
      style={getSidebarItemRootStyle()}
    >
      <Link
        href={item.href}
        target={item.external ? "_blank" : undefined}
        rel={item.external ? "noopener noreferrer" : undefined}
      >
        <SeedSideNavigation.ItemLabel
          className={getSidebarItemLabelClass(item.current)}
          style={getSidebarItemLabelStyle(item.level)}
        >
          {item.label}
          {item.isNew && <SidebarNewDot />}
        </SeedSideNavigation.ItemLabel>
        {item.external && (
          // A plain icon child, not `ItemSuffixIcon`: that slot is the collapsible folder chevron,
          // which the recipe rotates 180° whenever it isn't `open` — flipping this arrow to ↙. The
          // label's `flex-grow: 1` pushes this to the right edge, matching the site footer's ↗.
          <IconSeedArrow external className="size-3.5 text-fd-muted-foreground/80" />
        )}
      </Link>
    </SeedSideNavigation.Item>
  );
}

function DocsSideNavigationFolder({ item }: { item: SidebarFolderItem }) {
  const { collapsed } = useSideNavigationContext();
  const [open, setOpen] = usePersistentOpenState(item.defaultOpen, item.current);
  const triggerCurrent = collapsed && item.current;

  return (
    <SeedSideNavigation.ItemCollapsibleRoot open={open} onOpenChange={setOpen}>
      <SeedSideNavigation.ItemCollapsibleTrigger
        current={triggerCurrent}
        className={getSidebarItemRootClass(triggerCurrent)}
        style={getSidebarItemRootStyle()}
      >
        <SeedSideNavigation.ItemLabel
          className={getSidebarItemLabelClass(triggerCurrent)}
          style={getSidebarItemLabelStyle(0)}
        >
          {item.label}
        </SeedSideNavigation.ItemLabel>
        <SeedSideNavigation.ItemSuffixIcon
          svg={
            <IconChevronUpSmallFill
              className={triggerCurrent ? "text-fd-foreground" : "text-fd-muted-foreground/80"}
            />
          }
        />
      </SeedSideNavigation.ItemCollapsibleTrigger>
      <SeedSideNavigation.ItemCollapsibleContent
        // 2px gap between nested folder items, matching top-level item spacing.
        className="flex flex-col gap-0.5"
      >
        {item.items.map((sub) => (
          <DocsSideNavigationItem key={sub.key} item={sub} />
        ))}
      </SeedSideNavigation.ItemCollapsibleContent>
    </SeedSideNavigation.ItemCollapsibleRoot>
  );
}

function DocsSideNavigationGroup({ group, isFirst }: { group: SidebarGroup; isFirst: boolean }) {
  return (
    <SeedSideNavigation.Group
      className={clsx(
        !isFirst && "mt-4",
        // 2px gap between menu items.
        "gap-0.5",
      )}
    >
      {group.divider && <hr className="mx-2 my-1 border-0 border-t border-fd-border" />}
      {group.label && (
        <SeedSideNavigation.GroupLabel
          className={SIDEBAR_GROUP_LABEL_CLASS}
          style={{ fontWeight: SIDEBAR_REGULAR_WEIGHT }}
        >
          {group.label}
        </SeedSideNavigation.GroupLabel>
      )}
      {group.items.map((item) =>
        isSidebarFolderItem(item) ? (
          <DocsSideNavigationFolder key={item.key} item={item} />
        ) : (
          <DocsSideNavigationItem key={item.key} item={item} />
        ),
      )}
    </SeedSideNavigation.Group>
  );
}

export function DocsSideNavigationGroups({ groups }: { groups: SidebarGroup[] }) {
  return groups.map((group, index) => (
    <DocsSideNavigationGroup key={group.key} group={group} isFirst={index === 0} />
  ));
}
