import type { Nodes } from "mdast";
import type { MdastVisitorContext } from "satteri";

/**
 * 대체 Markdown을 함수로 넘기면 출력할 때 불린다. 원문 범위를 다른 편집이 반영된 Markdown으로 읽는다.
 * 노드는 방문이 끝나면 읽을 수 없으므로, 필요한 범위는 방문 중에 `childrenRange`로 구해 둔다.
 */
export interface SourceStringifier {
  slice(start: number, end: number): string;
}

export type SourceReplacement = string | ((s: SourceStringifier) => string);

interface SourceEdit {
  start: number;
  end: number;
  text: SourceReplacement;
  owner: undefined;
  namespace: string | undefined;
}

/**
 * `@fumadocs/satteri`의 내부 `replaceSource`와 같은 일을 합니다. `remarkLlms`와 `remarkStructure`는
 * 작성한 원문을 잘라 출력하고, 플러그인은 `ctx.data._sourceEdits`에 노드 범위의 대체 Markdown을 남겨
 * 그 출력을 바꿉니다. satteri가 이 함수를 export하지 않아 같은 계약으로 둡니다.
 *
 * - `namespace`가 없으면 llms와 검색 출력 모두에, `"search"`면 검색 row에만 적용됩니다.
 * - 같은 노드에 편집이 여럿이면 마지막 것이 이깁니다. `remarkStructure`는 JSX·링크·이미지를 자기
 *   규칙으로 다시 쓰므로, 그 노드에 남긴 편집은 검색 row에서 무시됩니다.
 * - position이 없는 노드(플러그인이 만든 노드)는 원문에 없어 편집할 수 없습니다.
 */
export function replaceSource(
  ctx: MdastVisitorContext,
  node: Readonly<Pick<Nodes, "position">>,
  text: SourceReplacement,
  namespace?: "search",
): void {
  const range = sourceRange(node);
  if (range) replaceRange(ctx, range, text, namespace);
}

export interface SourceRange {
  start: number;
  end: number;
}

/** 노드의 원문 범위. 위치가 없으면 `undefined`. */
export function sourceRange(node: Readonly<Pick<Nodes, "position">>): SourceRange | undefined {
  const start = node.position?.start.offset;
  const end = node.position?.end.offset;
  return start === undefined || end === undefined ? undefined : { start, end };
}

/** 원문 범위를 대체 Markdown으로 바꿉니다. 노드가 사라진 뒤에 기록해 둔 범위를 쓸 때 부릅니다. */
export function replaceRange(
  ctx: MdastVisitorContext,
  { start, end }: SourceRange,
  text: SourceReplacement,
  namespace?: "search",
): void {
  if (end <= start) return;

  const data = ctx.data as { _sourceEdits?: SourceEdit[] };
  data._sourceEdits ??= [];
  data._sourceEdits.push({ start, end, text, owner: undefined, namespace });
}

type ChildrenNode = Readonly<
  Pick<Nodes, "position"> & { children?: readonly Readonly<Pick<Nodes, "position">>[] }
>;

/**
 * 자식들이 차지하는 원문 범위. 위치가 있는 첫 자식부터 마지막 자식까지이며, 그런 자식이 없으면
 * `undefined`. 노드는 방문이 끝나면 읽을 수 없으므로 방문 중에 부릅니다.
 */
export function childrenRange(node: ChildrenNode) {
  const offsets = (node.children ?? []).flatMap(({ position }) =>
    position?.start.offset === undefined || position.end.offset === undefined
      ? []
      : [{ start: position.start.offset, end: position.end.offset }],
  );
  const first = offsets[0];
  const last = offsets.at(-1);
  return first && last ? { start: first.start, end: last.end } : undefined;
}

/**
 * 노드를 자식 Markdown으로 바꿉니다. satteri의 `s.inner`처럼, 다른 플러그인이 원문 위치 없는 노드로
 * 바꿔 넣은 자식(예: `remarkDocGen`의 코드 블록)도 그 자리의 편집으로 출력되도록 범위를 넓힙니다.
 */
export function replaceWithChildren(
  ctx: MdastVisitorContext,
  node: ChildrenNode,
  namespace?: "search",
): void {
  const outer = sourceRange(node);
  if (!outer) return;

  const children = childrenRange(node);
  const data = ctx.data as { _sourceEdits?: SourceEdit[] };
  replaceRange(
    ctx,
    outer,
    (s) => {
      let start = children?.start ?? outer.end;
      let end = children?.end ?? outer.start;
      for (const edit of data._sourceEdits ?? []) {
        if (edit.namespace !== undefined && edit.namespace !== namespace) continue;
        if (edit.start <= outer.start || edit.end > outer.end) continue;
        start = Math.min(start, edit.start);
        end = Math.max(end, edit.end);
      }
      return end > start ? s.slice(start, end) : "";
    },
    namespace,
  );
}
