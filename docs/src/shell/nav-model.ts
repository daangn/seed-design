/**
 * 사이드바 view model. 빌드 때 `src/content/source.ts`가 fumadocs page tree에서 만들고 `DocsNav`가 그린다.
 *
 * 불변식
 * - 모든 값은 JSON이다(island props·data script 직렬화). label은 문자열이다(ReactNode 금지).
 * - 경로에 무관하다. "현재 항목" 표시는 `currentPath`로 계산한다. 그래서 같은 섹션의 모든 페이지가 같은
 *   `SectionNav`를 갖는다.
 * - fumadocs 타입을 import하지 않는다(클라이언트 번들에 loader가 딸려 오지 않게).
 */
import type { SectionId } from "../content/sections";

export interface SectionNav {
  section: SectionId;
  label: string;
  groups: NavGroup[];
  /** groups의 내용 hash. 페이지 incremental `cacheKey`가 쓴다(`source.ts`). */
  digest: string;
}

export interface NavGroup {
  key: string;
  /** 이름 있는 separator(`---Foundation---`). */
  label?: string;
  /** 이름 없는 `---`. 라벨 대신 구분선. */
  divider?: boolean;
  items: NavItem[];
}

export type NavItem = NavLink | NavFolder;

export interface NavLink {
  kind: "link";
  /** 안정 키. 폴더 열림 맵과 React key에 쓴다. 원천은 page tree `$id`, 없으면 href. */
  key: string;
  label: string;
  href: string;
  /** 들여쓰기 깊이(평탄화된 하위 페이지). */
  level: number;
  external?: boolean;
  featured?: boolean;
  /**
   * 탭형 폴더(meta.json `layout: "tabs"`)를 leaf 하나로 접은 경우, 하위 탭 페이지 URL들.
   * 이 중 하나가 현재 경로면 이 링크가 현재 항목이다.
   */
  alsoCurrentFor?: string[];
}

export interface NavFolder {
  kind: "folder";
  key: string;
  label: string;
  defaultOpen: boolean;
  collapsible: boolean;
  /** 폴더 자신의 페이지. trigger에 표시한다. */
  index?: NavLink;
  items: NavLink[];
}

/** archive 빌드의 trailing slash 차이를 맞춘다. */
function normalizePath(path: string): string {
  return path.length > 1 ? path.replace(/\/$/, "") : path;
}

export function isCurrentLink(link: NavLink, path: string): boolean {
  if (link.external) return false;
  const current = normalizePath(path);
  return (
    normalizePath(link.href) === current ||
    (link.alsoCurrentFor?.some((href) => normalizePath(href) === current) ?? false)
  );
}

export function folderContains(folder: NavFolder, path: string): boolean {
  return (
    (folder.index ? isCurrentLink(folder.index, path) : false) ||
    folder.items.some((item) => isCurrentLink(item, path))
  );
}

/** 현재 경로를 포함하는 폴더 키. 없으면 undefined. */
export function currentFolderKey(nav: SectionNav, path: string): string | undefined {
  for (const group of nav.groups) {
    for (const item of group.items) {
      if (item.kind === "folder" && folderContains(item, path)) return item.key;
    }
  }
  return undefined;
}

/** 사이드바 순서로 펼친 문서 링크(외부 링크 제외). prev/next가 쓴다. */
export function flattenNavLinks(nav: SectionNav): NavLink[] {
  return nav.groups.flatMap((group) =>
    group.items.flatMap((item) =>
      item.kind === "folder" ? [...(item.index ? [item.index] : []), ...item.items] : [item],
    ),
  );
}
