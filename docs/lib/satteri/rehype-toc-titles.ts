import type { HastNode, HastPluginDefinition } from "satteri";

/** TOC 제목의 조각. 문자열은 일반 텍스트, `{ code }`는 inline code다. */
export type TocTitleSegment = string | { code: string };

interface TocItem {
  title: unknown;
  url: string;
}

function isTocItems(value: unknown): value is TocItem[] {
  return Array.isArray(value) && value.every((item) => typeof item?.url === "string");
}

function headingId(node: HastNode): string | undefined {
  if (node.type === "element") {
    const { id } = node.properties;
    return /^h[1-6]$/.test(node.tagName) && typeof id === "string" ? id : undefined;
  }
  if (node.type !== "mdxJsxFlowElement" || !node.name || !/^h[1-6]$/.test(node.name)) {
    return undefined;
  }
  for (const attribute of node.attributes) {
    if (attribute.type === "mdxJsxAttribute" && attribute.name === "id") {
      return typeof attribute.value === "string" ? attribute.value : undefined;
    }
  }
  return undefined;
}

function textOf(node: HastNode): string {
  if (node.type === "text") return node.value;
  return "children" in node ? node.children.map(textOf).join("") : "";
}

function segmentsOf(nodes: readonly HastNode[], out: TocTitleSegment[] = []): TocTitleSegment[] {
  for (const node of nodes) {
    if (node.type === "element" && node.tagName === "code") {
      out.push({ code: textOf(node) });
    } else if ("children" in node) {
      segmentsOf(node.children, out);
    } else if (node.type === "text") {
      const last = out.at(-1);
      if (typeof last === "string") out[out.length - 1] = last + node.value;
      else out.push(node.value);
    }
  }
  return out;
}

/**
 * heading의 inline code를 TOC 제목에도 남긴다.
 *
 * `@fumadocs/astro`는 TOC를 island props로 넘길 수 있게 제목을 일반 문자열로만 내보낸다. 그러면
 * `` ## Using `Checkmark` `` 같은 heading이 TOC에서 code 표시를 잃는다. heading에 inline code가 있으면
 * 제목을 직렬화 가능한 조각 배열로 바꿔 두고, `components/table-of-contents.tsx`가 React 노드로 되돌린다.
 *
 * `rehypeToc` 뒤에 실행해야 한다.
 */
export function rehypeTocTitles(): HastPluginDefinition {
  return {
    name: "seed-docs-toc-titles",
    after(root, ctx) {
      const toc = (ctx.data as { rehypeToc?: unknown }).rehypeToc;
      if (!isTocItems(toc) || toc.length === 0) return;

      const titles = new Map<string, TocTitleSegment[]>();
      const visit = (node: HastNode) => {
        const id = headingId(node);
        if (id !== undefined && "children" in node) {
          titles.set(id, segmentsOf(node.children));
          return;
        }
        if ("children" in node) node.children.forEach(visit);
      };
      visit(root);

      for (const item of toc) {
        const segments = titles.get(item.url.slice(1));
        if (segments?.some((segment) => typeof segment !== "string")) item.title = segments;
      }
    },
  };
}
