import type * as PageTree from "fumadocs-core/page-tree";

/**
 * frontmatter `featured: true`를 page tree 노드에 실어 사이드바로 넘기는 헬퍼 (서버·클라 공용).
 * cast를 이 파일에 모아둔다 — fumadocs-core는 번들 청크 re-export라 `declare module`
 * 증강이 불안정하다(`lib/tabbed.ts`와 같은 방식).
 */
interface FeaturedItem extends PageTree.Item {
  featured?: boolean;
}

/** 빌더 캐시가 원본 참조를 들고 있어 제자리에서 mutate 한다. */
export function markFeatured(node: PageTree.Item): void {
  (node as FeaturedItem).featured = true;
}

export function isFeatured(node: PageTree.Item): boolean {
  return (node as FeaturedItem).featured === true;
}
