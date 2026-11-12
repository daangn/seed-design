import type * as PageTree from "fumadocs-core/page-tree";

/**
 * 탭형 subject 폴더 헬퍼. 빌드 때(`.astro`와 사이드바 목록 계산) 쓴다.
 *
 * meta.json `layout: "tabs"`(source.config.ts docsMetaSchema)가 폴더를 "탭형"으로
 * 선언하면 page tree transformer(lib/source.ts)가 폴더 노드에 같은 값을 스탬프한다.
 * 사이드바는 그 폴더를 펼치지 않고 leaf 하나로, 페이지 상단엔 형제 탭 스트립
 * (DocsTabStrip)을 렌더한다. 둘 다 이 표시를 읽어 빌드 때 목록을 만든다.
 *
 * fumadocs-core는 번들 청크 re-export라 `declare module` 증강이 불안정하다 —
 * 교차 인터페이스 + 이 파일 안의 cast로만 다룬다.
 */
export interface TabbedFolderNode extends PageTree.Folder {
  /** meta.json의 `layout: "tabs"`를 transformer가 그대로 스탬프한 값. */
  layout?: "tabs";
  /** meta.json `coverImage`(고정 헤더 썸네일 base 경로) — transformer가 스탬프. `description`은 PageTree.Folder에 이미 있음. */
  coverImage?: string;
}

/** transformer 전용: 폴더 노드를 제자리에서 탭형으로 표시한다(빌더 캐시가 원본 참조를 들고 있어 mutate). */
export function markTabbedFolder(node: PageTree.Folder): PageTree.Folder {
  (node as TabbedFolderNode).layout = "tabs";
  return node;
}

export function isTabbedFolder(node: PageTree.Node): node is TabbedFolderNode {
  return (
    node.type === "folder" && (node as TabbedFolderNode).layout === "tabs" && node.index != null
  );
}

/** url이 인덱스(첫 탭)거나 직속 자식 페이지(탭)인 탭형 폴더를 재귀 탐색한다. */
export function findTabbedFolder(nodes: PageTree.Node[], url: string): TabbedFolderNode | null {
  for (const node of nodes) {
    if (node.type !== "folder") continue;
    if (isTabbedFolder(node)) {
      const isActive =
        node.index?.url === url ||
        node.children.some((child) => child.type === "page" && child.url === url);
      if (isActive) return node;
    }
    const nested = findTabbedFolder(node.children, url);
    if (nested) return nested;
  }
  return null;
}

export interface TabbedFolderTab {
  name: string;
  url: string;
}

/**
 * 탭 스트립의 탭 목록(인덱스가 첫 탭, 이어서 직속 자식 페이지). island props로 넘기므로 이름은 문자열이어야 한다.
 * 인덱스가 없거나 탭이 2개 미만이면 빈 배열이다(탭 스트립을 그리지 않는다).
 */
export function tabbedFolderTabs(folder: TabbedFolderNode): TabbedFolderTab[] {
  if (!folder.index) return [];
  const pages = [
    folder.index,
    ...folder.children.filter((child): child is PageTree.Item => child.type === "page"),
  ];
  if (pages.length < 2) return [];
  return pages.map((page) => {
    if (typeof page.name !== "string") {
      throw new Error(`탭 이름이 문자열이 아닙니다: ${page.url}`);
    }
    return { name: page.name, url: page.url };
  });
}

/** 탭형 페이지 h1/og용 라벨. 폴더 이름의 원천은 meta.json `title`(string)이다. */
export function tabbedFolderLabel(folder: TabbedFolderNode): string | undefined {
  return typeof folder.name === "string" ? folder.name : undefined;
}
