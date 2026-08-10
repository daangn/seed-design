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
import { extractFigmaId, FIGMA_ID_PROP_SUPPORTED_COMPONENTS } from "./collect-figma-image-ids";
import { type FigmaImageManifest, getFigmaImageUrlsFromManifest } from "./figma-image-manifest";

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
  manifest?: FigmaImageManifest;
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
  manifest,
}: RemarkFigmaImageOptions): Transformer<Root, Root> {
  return (tree) => {
    const figmaNodes: Map<string, NodeEntry[]> = new Map();

    visit(tree, "mdxJsxFlowElement", (node, index, parent) => {
      if (typeof index !== "number" || !parent) return;

      const figmaId = extractFigmaId(node);

      if (figmaId) {
        if (!figmaNodes.has(figmaId)) figmaNodes.set(figmaId, []);

        figmaNodes.get(figmaId)!.push({ node, index, parent });
      }
    });

    if (figmaNodes.size === 0) return tree;

    const nodeIds = [...figmaNodes.keys()];
    if (!accessToken || !fileKey) {
      applyFigmaImageUrls(
        figmaNodes,
        new Map(nodeIds.map((nodeId) => [nodeId, PLACEHOLDER_DATA_URI])),
      );
      return tree;
    }

    const options = fetchUrlsOptions ?? {};
    const imageUrls = manifest
      ? getFigmaImageUrlsFromManifest(manifest, nodeIds, options)
      : new Map<string, string>();

    const missingIds = nodeIds.filter((nodeId) => !imageUrls.has(nodeId));
    if (missingIds.length === 0) {
      applyFigmaImageUrls(figmaNodes, imageUrls);
      return tree;
    }

    return fetchFigmaImageUrls({
      client: createFigmaClient(accessToken),
      fileKey,
      nodeIds: missingIds,
      options,
    }).then((fetchedUrls) => {
      for (const [nodeId, url] of fetchedUrls) imageUrls.set(nodeId, url);
      applyFigmaImageUrls(figmaNodes, imageUrls);
      return tree;
    });
  };
}

function applyFigmaImageUrls(
  figmaNodes: Map<string, NodeEntry[]>,
  imageUrls: ReadonlyMap<string, string>,
): void {
  for (const [figmaId, entries] of figmaNodes) {
    const url = imageUrls.get(figmaId);

    if (!url)
      throw new Error(`[remark-figma-image] Failed to get image URL for Figma node: ${figmaId}`);

    for (const { node, index, parent } of entries) {
      if (!node.name) continue;

      if (node.name === "FigmaImage") {
        const altAttr = node.attributes.find(
          (attr): attr is MdxJsxAttribute => attr.type === "mdxJsxAttribute" && attr.name === "alt",
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
            !(attr.type === "mdxJsxAttribute" && (attr.name === "figmaId" || attr.name === "src")),
        );

        node.attributes.push({ type: "mdxJsxAttribute", name: "src", value: url });
      }
    }
  }
}
