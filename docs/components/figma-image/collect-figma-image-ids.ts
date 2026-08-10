import matter from "gray-matter";
import type { MdxJsxAttribute, MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import { remark } from "remark";
import remarkMdx from "remark-mdx";
import { visit } from "unist-util-visit";

export const FIGMA_ID_PROP_SUPPORTED_COMPONENTS = ["DoImage", "DontImage"];

export function collectFigmaImageIdsFromMdx(source: string): string[] {
  const tree = remark().use(remarkMdx).parse(matter(source).content);
  const ids = new Set<string>();

  visit(tree, "mdxJsxFlowElement", (node) => {
    const id = extractFigmaId(node);
    if (id) ids.add(id);
  });

  return [...ids];
}

export function extractFigmaId({ name, attributes }: MdxJsxFlowElement): string | null {
  if (!name) return null;

  if (name === "FigmaImage") {
    const idAttr = attributes.find(
      (attr): attr is MdxJsxAttribute => attr.type === "mdxJsxAttribute" && attr.name === "id",
    );

    if (!idAttr) throw new Error("[remark-figma-image] FigmaImage requires an 'id' prop");

    return typeof idAttr.value === "string" ? idAttr.value : null;
  }

  if (FIGMA_ID_PROP_SUPPORTED_COMPONENTS.includes(name)) {
    const figmaIdAttr = attributes.find(
      (attr): attr is MdxJsxAttribute => attr.type === "mdxJsxAttribute" && attr.name === "figmaId",
    );

    return typeof figmaIdAttr?.value === "string" ? figmaIdAttr.value : null;
  }

  return null;
}
