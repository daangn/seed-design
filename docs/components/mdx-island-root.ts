import { Fragment, jsx } from "astro/jsx-runtime";
import type { MdxIslandNode } from "@/lib/satteri/rehype-mdx-islands";

/** Astro JSX 런타임이 만든 노드. MDX 모듈은 JSX를 이 형태로 컴파일한다. */
interface AstroVNode {
  "astro:jsx": true;
  type: unknown;
  props: Record<string, unknown>;
}

function isVNode(value: unknown): value is AstroVNode {
  return typeof value === "object" && value !== null && "astro:jsx" in value;
}

interface MdxIslandRootProps {
  tree: MdxIslandNode[];
  /** 컴파일 타임에 `client:*` 정보가 붙은 `<MdxIsland>` 노드. 정적 slot을 children으로 가진다. */
  children: AstroVNode;
}

/**
 * island tree의 props에 섞인 JSX(예: `TypeTable`의 타입·설명)를 Astro가 렌더링하는 slot으로 옮긴다.
 * React island의 props는 직렬화되어야 해서 JSX 노드를 그대로 넘길 수 없다.
 *
 * `server:root`로 호출되므로 Astro가 props를 렌더링하지 않고 그대로 넘긴다.
 */
export function MdxIslandRoot({ tree, children: island }: MdxIslandRootProps) {
  const slots: unknown[] = [];

  const hoist = (value: unknown): unknown => {
    if (isVNode(value)) {
      const name = `p${slots.length}`;
      slots.push(jsx(Fragment, { slot: name, children: value }));
      return { slot: name };
    }
    if (Array.isArray(value)) return value.map(hoist);
    if (typeof value === "object" && value !== null) {
      return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, hoist(item)]));
    }
    return value;
  };

  const staticSlots = island.props.children;

  return jsx(island.type, {
    ...island.props,
    tree: hoist(tree),
    children: [...(Array.isArray(staticSlots) ? staticSlots : [staticSlots]), ...slots],
  });
}
