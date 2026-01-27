import type { Processor, Transformer } from "unified";
import type { remark } from "remark";
import { visit } from "unist-util-visit";
import type { MdxJsxAttribute, MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import type { Image, Paragraph } from "mdast";
import {
  createFigmaClient,
  fetchFigmaImageUrls,
  type FetchFigmaImageUrlsOptions,
} from "./fetch-figma-image-urls";

const FIGMA_ID_PROP_SUPPORTED_COMPONENTS = ["DoImage", "DontImage"];

const DEFAULT_IMAGE_SIZE = {
  width: 1080,
  height: 720,
};

// Root type derived from remark processor (same pattern as remark-react-type-table)
// biome-ignore lint/suspicious/noExplicitAny: this is for removing mdast dependency which is actually deprecated
export type Root = typeof remark extends Processor<infer R, any, any, any, any> ? R : never;

export interface RemarkFigmaImageOptions {
  fileKey?: string;
  accessToken?: string;
  fetchUrlsOptions?: FetchFigmaImageUrlsOptions;
}

interface NodeEntry {
  node: MdxJsxFlowElement;
  index: number;
  parent: { children: unknown[] };
}

// Gray placeholder with "Figma" text
const PLACEHOLDER_DATA_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23e5e5e5' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui,sans-serif' font-size='24' fill='%23737373'%3EFigma%3C/text%3E%3C/svg%3E";

/**
 * Remark plugin that transforms Figma node IDs into image URLs at build time.
 *
 * Transforms:
 * - `<FigmaImage id="..." alt="..." />` → `![alt](url)`
 * - `<DoImage figmaId="..." />` → `<DoImage src="..." />`
 * - `<DontImage figmaId="..." />` → `<DontImage src="..." />`
 */
export function remarkFigmaImage({
  accessToken,
  fileKey,
  fetchUrlsOptions,
}: RemarkFigmaImageOptions): Transformer<Root, Root> {
  return async (tree) => {
    const figmaNodes: Map<string, NodeEntry[]> = new Map();

    visit(tree, "mdxJsxFlowElement", (node, index, parent) => {
      if (typeof index !== "number" || !parent) return;

      const figmaId = extractFigmaId(node);

      if (figmaId) {
        if (!figmaNodes.has(figmaId)) figmaNodes.set(figmaId, []);

        figmaNodes.get(figmaId)!.push({ node, index, parent });
      }
    });

    if (figmaNodes.size === 0) return;

    const usePlaceholder = !accessToken || !fileKey;

    const imageUrls: Map<string, string> = usePlaceholder
      ? new Map(Array.from(figmaNodes.keys()).map((id) => [id, PLACEHOLDER_DATA_URI]))
      : await fetchFigmaImageUrls({
          client: createFigmaClient(accessToken),
          fileKey,
          nodeIds: Array.from(figmaNodes.keys()),
          options: fetchUrlsOptions,
        });

    for (const [figmaId, entries] of figmaNodes) {
      const url = imageUrls.get(figmaId);

      if (!url)
        throw new Error(`[remark-figma-image] Failed to get image URL for Figma node: ${figmaId}`);

      for (const { node, index, parent } of entries) {
        if (!node.name) continue;

        if (node.name === "FigmaImage") {
          const altAttr = node.attributes.find(
            (attr): attr is MdxJsxAttribute =>
              attr.type === "mdxJsxAttribute" && attr.name === "alt",
          );

          if (!altAttr?.value)
            throw new Error(
              "[remark-figma-image] FigmaImage requires an 'alt' prop for accessibility",
            );

          const image: Image = {
            type: "image",
            url,
            alt: typeof altAttr.value === "string" ? altAttr.value : "",
            data: {
              // not the actual size, but prevent layout shift through Next.js Image
              hProperties: DEFAULT_IMAGE_SIZE,
            },
          };

          const paragraph: Paragraph = {
            type: "paragraph",
            children: [image],
            position: node.position,
          };

          parent.children[index] = paragraph;

          continue;
        }

        // replace figmaId with resolved src
        if (FIGMA_ID_PROP_SUPPORTED_COMPONENTS.includes(node.name)) {
          node.attributes = node.attributes.filter(
            (attr): attr is MdxJsxAttribute =>
              !(
                attr.type === "mdxJsxAttribute" &&
                (attr.name === "figmaId" || attr.name === "src")
              ),
          );

          node.attributes.push({ type: "mdxJsxAttribute", name: "src", value: url });
        }
      }
    }
  };
}

/**
 * Extract Figma node ID from JSX element attributes
 */
function extractFigmaId({ name, attributes }: MdxJsxFlowElement): string | null {
  if (!name) return null;

  // For <FigmaImage id="..." />
  if (name === "FigmaImage") {
    const idAttr = attributes.find(
      (attr): attr is MdxJsxAttribute => attr.type === "mdxJsxAttribute" && attr.name === "id",
    );

    if (!idAttr) throw new Error("[remark-figma-image] FigmaImage requires an 'id' prop");

    return typeof idAttr?.value === "string" ? idAttr.value : null;
  }

  // For components like <DoImage figmaId="..." /> and <DontImage figmaId="..." />
  if (FIGMA_ID_PROP_SUPPORTED_COMPONENTS.includes(name)) {
    const figmaIdAttr = attributes.find(
      (attr): attr is MdxJsxAttribute => attr.type === "mdxJsxAttribute" && attr.name === "figmaId",
    );

    return typeof figmaIdAttr?.value === "string" ? figmaIdAttr.value : null;
  }

  return null;
}
