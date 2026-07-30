import type * as PageTree from "fumadocs-core/page-tree";

/**
 * "새 문서" 플래그 헬퍼 (서버·클라이언트 공용).
 *
 * frontmatter `new: true`(source.config.ts baseDocsSchema)가 붙은 페이지를 page tree
 * transformer(app/source.tsx)가 노드에 스탬프하고, 사이드바(데스크톱 SideNavigation·
 * 모바일 nav 패널)가 라벨 뒤에 하이라이트 dot으로 렌더한다. 트리는 클라이언트로
 * 직렬화되므로 두 렌더러가 같은 노드 prop을 읽는다.
 *
 * 노드 확장 방식은 `lib/tabbed.ts`와 같다 — fumadocs-core는 번들 청크 re-export라
 * `declare module` 증강이 불안정하므로 교차 인터페이스 + 이 파일 안의 cast로만 다룬다.
 */
export interface NewPageItem extends PageTree.Item {
  /** frontmatter `new`를 transformer가 그대로 스탬프한 값. */
  new?: boolean;
}

/** transformer 전용: 페이지 노드를 제자리에서 "새 문서"로 표시한다(빌더 캐시가 원본 참조를 들고 있어 mutate). */
export function markNewPage(node: PageTree.Item): PageTree.Item {
  (node as NewPageItem).new = true;
  return node;
}

export function isNewPage(node: PageTree.Item): boolean {
  return (node as NewPageItem).new === true;
}
