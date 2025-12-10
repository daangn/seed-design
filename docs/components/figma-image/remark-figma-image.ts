import type { Processor, Transformer } from "unified";
import type { remark } from "remark";
import { visit } from "unist-util-visit";
import type { MdxJsxAttribute, MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import {
  createFigmaClient,
  fetchFigmaImageUrls,
  type FetchFigmaImageUrlsOptions,
} from "./fetch-figma-image-urls";

const DEFAULT_IMAGE_WIDTH = 1080;
const DEFAULT_IMAGE_HEIGHT = 720;

const FIMGA_ID_PROP_SUPPORTED_COMPONENTS = ["DoImage", "DontImage"];

// Root type derived from remark processor (same pattern as remark-react-type-table)
// biome-ignore lint/suspicious/noExplicitAny: this is for removing mdast dependency which is actually deprecated
export type Root = typeof remark extends Processor<infer R, any, any, any, any> ? R : never;

export interface RemarkFigmaImageOptions {
  fileKey: string;
  accessToken: string;
  fetchUrlsOptions?: FetchFigmaImageUrlsOptions;
}

/**
 * Remark plugin that transforms Figma node IDs into image URLs at build time.
 *
 * Transforms:
 * - `<FigmaImage id="..." alt="..." />` → `<ImageZoom src="..." alt="..." />`
 * - `<DoImage figmaId="..." />` → `<DoImage src="..." />`
 * - `<DontImage figmaId="..." />` → `<DontImage src="..." />`
 */
export function remarkFigmaImage({
  accessToken,
  fileKey,
  fetchUrlsOptions,
}: RemarkFigmaImageOptions): Transformer<Root, Root> {
  return async (tree) => {
    const figmaNodes: Map<string, MdxJsxFlowElement[]> = new Map();

    visit(tree, "mdxJsxFlowElement", (node: MdxJsxFlowElement) => {
      const figmaId = extractFigmaId(node);

      if (figmaId) {
        if (!figmaNodes.has(figmaId)) figmaNodes.set(figmaId, []);

        figmaNodes.get(figmaId)!.push(node);
      }
    });

    if (figmaNodes.size === 0) return;

    const client = createFigmaClient(accessToken);
    const imageUrls = await fetchFigmaImageUrls({
      client,
      fileKey,
      nodeIds: Array.from(figmaNodes.keys()),
      options: fetchUrlsOptions,
    });

    for (const [figmaId, nodes] of figmaNodes) {
      const url = imageUrls.get(figmaId);

      if (!url)
        throw new Error(`[remark-figma-image] Failed to get image URL for Figma node: ${figmaId}`);

      for (const node of nodes) {
        transformNode(node, url);
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
  if (FIMGA_ID_PROP_SUPPORTED_COMPONENTS.includes(name)) {
    const figmaIdAttr = attributes.find(
      (attr): attr is MdxJsxAttribute => attr.type === "mdxJsxAttribute" && attr.name === "figmaId",
    );

    return typeof figmaIdAttr?.value === "string" ? figmaIdAttr.value : null;
  }

  return null;
}

/**
 * Transform JSX node by replacing figmaId/id with resolved src URL
 */
function transformNode(node: MdxJsxFlowElement, imageUrl: string): void {
  if (node.name === "FigmaImage") {
    // Validate alt prop is present
    const hasAlt = node.attributes.some(
      (attr) => attr.type === "mdxJsxAttribute" && attr.name === "alt",
    );
    if (!hasAlt) {
      throw new Error("[remark-figma-image] FigmaImage requires an 'alt' prop for accessibility");
    }

    // Transform <FigmaImage id="..." /> to <ImageZoom src="..." width={...} height={...} />
    node.name = "ImageZoom";
    node.attributes = node.attributes.filter(
      (attr) => !(attr.type === "mdxJsxAttribute" && attr.name === "id"),
    );
    node.attributes.push(
      { type: "mdxJsxAttribute", name: "src", value: imageUrl },
      { type: "mdxJsxAttribute", name: "width", value: `${DEFAULT_IMAGE_WIDTH}` },
      { type: "mdxJsxAttribute", name: "height", value: `${DEFAULT_IMAGE_HEIGHT}` },
      {
        type: "mdxJsxAttribute",
        name: "className",
        value: "bg-palette-gray-100 dark:bg-palette-gray-900 rounded-r2 overflow-hidden",
      },
    );

    return;
  }

  // For DoImage/DontImage: remove figmaId and any existing src, then add resolved src
  node.attributes = node.attributes.filter(
    (attr) =>
      !(attr.type === "mdxJsxAttribute" && (attr.name === "figmaId" || attr.name === "src")),
  );

  node.attributes.push({ type: "mdxJsxAttribute", name: "src", value: imageUrl });
}
