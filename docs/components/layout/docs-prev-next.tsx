import { IconSeedArrow } from "@/components/icon-seed-arrow";
import clsx from "clsx";
import type * as PageTree from "fumadocs-core/page-tree";
import { PageLink as Link } from "@/components/link";

// prev/next 두 카드가 공유하는 베이스. 배경/hover를 side navigation 메뉴 항목의
// active(bg-transparent-selected) / active-hover(bg-transparent-selected-pressed) 색과
// 동일하게 맞춘다. transparent 토큰은 테마 인식형이라 dark: 변형이 필요 없고,
// SEED color-transition 토큰(duration-color-transition) 타이밍에 맞춰 전환된다.
const CARD =
  "flex min-h-[52px] flex-col justify-center gap-x2 rounded-r3 bg-bg-transparent-selected px-x5 py-x3_5 " +
  "text-fg-neutral transition-colors duration-color-transition hover:bg-bg-transparent-selected-pressed";

/**
 * 현재 문서의 이전·다음 문서. fumadocs `useFooterItems`와 같은 순서로 page tree를 평탄화한다
 * (폴더는 index 먼저, external 링크 제외).
 */
export function findPrevNext(
  tree: PageTree.Root,
  pathname: string,
): { previous?: PageTree.Item; next?: PageTree.Item } {
  const list: PageTree.Item[] = [];
  const visit = (node: PageTree.Node) => {
    if (node.type === "folder") {
      if (node.index) visit(node.index);
      for (const child of node.children) visit(child);
    } else if (node.type === "page" && !node.external) list.push(node);
  };
  for (const child of tree.children) visit(child);

  const norm = (url: string) => url.replace(/\/$/, "");
  const index = list.findIndex((item) => norm(item.url) === norm(pathname));
  if (index === -1) return {};
  return { previous: list[index - 1], next: list[index + 1] };
}

/**
 * 상세 문서 하단 이전/다음 네비게이션. 빌드 때 정적으로 그린다.
 * 한쪽만 있어도 이전=왼쪽 / 다음=오른쪽 자리를 고정한다(col-start).
 */
export function DocsPrevNext({
  previous,
  next,
}: {
  previous?: PageTree.Item;
  next?: PageTree.Item;
}) {
  if (!previous && !next) return null;

  return (
    <div className="mt-x16 grid grid-cols-2 gap-x6">
      {previous && (
        <Link href={previous.url} className={clsx(CARD, "col-start-1")}>
          <span className="t4-regular inline-flex items-center gap-x2">
            <IconSeedArrow className="size-x3_5 rotate-180" />
            이전 문서
          </span>
          <span className="t5-medium truncate">{previous.name}</span>
        </Link>
      )}
      {next && (
        <Link href={next.url} className={clsx(CARD, "col-start-2 items-end text-end")}>
          <span className="t4-regular inline-flex items-center gap-x2">
            다음 문서
            <IconSeedArrow className="size-x3_5" />
          </span>
          <span className="t5-medium w-full truncate text-end">{next.name}</span>
        </Link>
      )}
    </div>
  );
}
