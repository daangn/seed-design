import type * as PageTree from "fumadocs-core/page-tree";

/**
 * 탭형 subject 폴더 헬퍼 (서버·클라이언트 공용).
 *
 * meta.json `layout: "tabs"`(source.config.ts docsMetaSchema)가 폴더를 "탭형"으로
 * 선언하면 page tree transformer(app/source.tsx)가 폴더 노드에 같은 값을 스탬프한다.
 * 사이드바는 그 폴더를 펼치지 않고 leaf 하나로, 페이지 상단엔 형제 탭 스트립
 * (DocsTabStrip)을 렌더한다. 트리는 클라이언트로 직렬화되므로 서버(page.tsx)와
 * 클라이언트(사이드바/탭 스트립)가 같은 노드 prop을 읽는다.
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

/** 탭형 페이지 h1/og용 라벨. 폴더 이름의 원천은 meta.json `title`(string)이다. */
export function tabbedFolderLabel(folder: TabbedFolderNode): string | undefined {
  return typeof folder.name === "string" ? folder.name : undefined;
}
