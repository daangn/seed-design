/**
 * Sidebar view-model shared by the two renderers — the desktop SEED SideNavigation
 * (`../docs-side-navigation-items`) and the mobile nav panel (`../../header/mobile-nav-panel`).
 * `buildSidebarGroups` (in docs-side-navigation-items) produces these from the fumadocs
 * page tree; keep this file free of rendering/tree logic so both renderers can import it
 * without pulling one into the other.
 */

import type { Key, ReactNode } from "react";

export interface SidebarLeafItem {
  key: Key;
  label: ReactNode;
  level: number;
  current: boolean;
  href: string;
  /** An `external:` meta entry — rendered with a ↗ suffix icon and opened in a new tab. */
  external?: boolean;
}

export interface SidebarFolderItem {
  key: Key;
  label: ReactNode;
  defaultOpen: boolean;
  current: boolean;
  items: SidebarLeafItem[];
}

export type SidebarItem = SidebarLeafItem | SidebarFolderItem;

export interface SidebarGroup {
  key: Key;
  label?: ReactNode;
  /** A nameless `---` separator opens a group with a hairline divider instead of a label. */
  divider?: boolean;
  items: SidebarItem[];
}

export function isSidebarFolderItem(item: SidebarItem): item is SidebarFolderItem {
  return "items" in item;
}
