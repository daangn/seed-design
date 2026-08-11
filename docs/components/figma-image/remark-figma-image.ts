import type { Image, Paragraph } from "mdast";
import { defineMdastPlugin, type MdxJsxAttributeNode } from "satteri";
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

export interface RemarkFigmaImageOptions {
  fileKey?: string;
  accessToken?: string;
  fetchUrlsOptions?: FetchFigmaImageUrlsOptions;
  manifest?: FigmaImageManifest;
}

// Gray placeholder with "Figma" text
const PLACEHOLDER_DATA_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23e5e5e5' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui,sans-serif' font-size='24' fill='%23737373'%3EFigma%3C/text%3E%3C/svg%3E";

/**
 * Satteri plugin that transforms Figma node IDs into image URLs at compile time.
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
}: RemarkFigmaImageOptions) {
  const options = fetchUrlsOptions ?? {};
  const cachedUrls = new Map<string, string>();
  const pendingUrls = new Map<string, Promise<string>>();

  async function resolveUrl(figmaId: string): Promise<string> {
    const cached = cachedUrls.get(figmaId);
    if (cached) return cached;

    const manifestUrl = manifest
      ? getFigmaImageUrlsFromManifest(manifest, [figmaId], options).get(figmaId)
      : undefined;
    if (manifestUrl) {
      cachedUrls.set(figmaId, manifestUrl);
      return manifestUrl;
    }

    if (!accessToken || !fileKey) return PLACEHOLDER_DATA_URI;

    const pending = pendingUrls.get(figmaId);
    if (pending) return pending;

    const request = fetchFigmaImageUrls({
      client: createFigmaClient(accessToken),
      fileKey,
      nodeIds: [figmaId],
      options,
    }).then((urls) => {
      const url = urls.get(figmaId);
      if (!url) {
        throw new Error(`[remark-figma-image] Failed to get image URL for Figma node: ${figmaId}`);
      }
      cachedUrls.set(figmaId, url);
      return url;
    });
    pendingUrls.set(figmaId, request);
    return request;
  }

  return defineMdastPlugin({
    name: "remark-figma-image",
    async mdxJsxFlowElement(node, context) {
      const figmaId = extractFigmaId(node);
      if (!figmaId || !node.name) return;

      const url = await resolveUrl(figmaId);
      if (node.name === "FigmaImage") {
        const altAttr = node.attributes.find(
          (attr): attr is MdxJsxAttributeNode =>
            attr.type === "mdxJsxAttribute" && attr.name === "alt",
        );
        if (!altAttr?.value) {
          throw new Error(
            "[remark-figma-image] FigmaImage requires an 'alt' prop for accessibility",
          );
        }

        const image: Image = {
          type: "image",
          url,
          alt: typeof altAttr.value === "string" ? altAttr.value : "",
          data: {
            // 실제 크기는 아니지만 Next.js Image를 통해 레이아웃 이동을 방지합니다.
            hProperties: DEFAULT_IMAGE_SIZE,
          },
        };
        const paragraph: Paragraph = {
          type: "paragraph",
          children: [image],
          position: node.position,
        };
        context.replaceNode(node, paragraph);
        return;
      }

      if (FIGMA_ID_PROP_SUPPORTED_COMPONENTS.includes(node.name)) {
        const attributes = node.attributes.filter(
          (attr): attr is MdxJsxAttributeNode =>
            !(attr.type === "mdxJsxAttribute" && (attr.name === "figmaId" || attr.name === "src")),
        );
        attributes.push({ type: "mdxJsxAttribute", name: "src", value: url });
        context.replaceNode(node, { ...node, attributes });
      }
    },
  });
}
