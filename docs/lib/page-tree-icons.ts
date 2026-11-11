/** meta.json·frontmatter의 `icon`으로 쓸 수 있는 이름. 사이드바가 이 이름으로 아이콘을 고른다. */
export const PAGE_TREE_ICON_NAMES = ["Lock"] as const;

export type PageTreeIconName = (typeof PAGE_TREE_ICON_NAMES)[number];

export function isPageTreeIconName(name: string): name is PageTreeIconName {
  return (PAGE_TREE_ICON_NAMES as readonly string[]).includes(name);
}
