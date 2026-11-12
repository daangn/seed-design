/**
 * Sidebar view-model shared by the two renderers — the desktop SEED SideNavigation
 * (`../docs-side-navigation-items`) and the mobile nav panel (`../../header/mobile-nav-panel`).
 * `buildSidebarGroups` (in docs-side-navigation-items) produces these from the fumadocs
 * page tree; keep this file free of rendering/tree logic so both renderers can import it
 * without pulling one into the other.
 *
 * `.astro`가 빌드 때 만들어 내비게이션 island의 props로 넘기므로 값은 직렬화할 수 있어야 한다(label은 문자열).
 * 기본값인 boolean 필드(`current`·`external`·`featured`가 false)는 props 크기를 줄이려고 생략한다.
 */

export interface SidebarLeafItem {
  key: string | number;
  label: string;
  level: number;
  current?: boolean;
  href: string;
  /** An `external:` meta entry — rendered with a ↗ suffix icon and opened in a new tab. */
  external?: boolean;
  /** frontmatter `featured: true` — rendered with an accent dot after the label. */
  featured?: boolean;
}

export interface SidebarFolderItem {
  key: string | number;
  label: string;
  defaultOpen: boolean;
  collapsible: boolean;
  current: boolean;
  /** The folder's own page; rendered on the trigger rather than in the child list. */
  index?: SidebarLeafItem;
  items: SidebarLeafItem[];
}

export type SidebarItem = SidebarLeafItem | SidebarFolderItem;

export interface SidebarGroup {
  key: string | number;
  label?: string;
  /** A nameless `---` separator opens a group with a hairline divider instead of a label. */
  divider?: boolean;
  items: SidebarItem[];
}

export function isSidebarFolderItem(item: SidebarItem): item is SidebarFolderItem {
  return "items" in item;
}
