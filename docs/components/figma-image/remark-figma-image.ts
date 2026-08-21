import type { Image, Paragraph } from "mdast";
import { defineMdastPlugin, type MdxJsxAttributeNode } from "satteri";
import {
  createFigmaClient,
  fetchFigmaImageUrls,
  type FetchFigmaImageUrlsOptions,
} from "./fetch-figma-image-urls";
import { extractFigmaId, FIGMA_ID_PROP_SUPPORTED_COMPONENTS } from "./collect-figma-image-ids";
import { type FigmaImageManifest, getFigmaImageUrlsFromManifest } from "./figma-image-manifest";
import { resolveFigmaImageUrls } from "./resolve-figma-image-urls";

declare module "mdast" {
  interface ImageData {
    /**
     * `<FigmaImage>`를 치환해 만든 이미지라는 표시입니다. 검색 색인(`remarkStructure`)은
     * 이 플러그인 뒤에 돌면서 image를 빈 문자열로 직렬화하므로, 이 표시를 보고 원래
     * 컴포넌트 형태를 되살려야 `alt`가 색인에 남습니다 (app/source.tsx).
     */
    figmaImage?: true;
  }
}

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

interface PendingUrlRequest {
  promise: Promise<string>;
  resolve: (url: string) => void;
  reject: (error: Error) => void;
}

type FetchUrlBatch = (nodeIds: string[]) => Promise<ReadonlyMap<string, string>>;

// Gray placeholder with "Figma" text
const PLACEHOLDER_DATA_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23e5e5e5' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui,sans-serif' font-size='24' fill='%23737373'%3EFigma%3C/text%3E%3C/svg%3E";

/** 같은 이벤트 루프에서 요청된 Figma ID를 한 번의 묶음 조회로 합칩니다. */
export function createBatchedFigmaImageUrlResolver(fetchUrls: FetchUrlBatch) {
  const cachedUrls = new Map<string, string>();
  const pendingRequests = new Map<string, PendingUrlRequest>();
  const queuedIds = new Set<string>();
  let batchScheduled = false;

  function scheduleBatch(): void {
    if (batchScheduled) return;
    batchScheduled = true;
    queueMicrotask(() => void flushBatch());
  }

  async function flushBatch(): Promise<void> {
    batchScheduled = false;
    const nodeIds = [...queuedIds];
    queuedIds.clear();
    if (nodeIds.length === 0) return;

    try {
      const urls = await resolveFigmaImageUrls({ nodeIds, fetchUrls });

      for (const nodeId of nodeIds) {
        const pending = pendingRequests.get(nodeId);
        if (!pending) continue;

        pendingRequests.delete(nodeId);
        const url = urls.get(nodeId);
        if (!url) {
          pending.reject(
            new Error(`[remark-figma-image] Failed to get image URL for Figma node: ${nodeId}`),
          );
          continue;
        }

        cachedUrls.set(nodeId, url);
        pending.resolve(url);
      }
    } catch (error) {
      const cause = error instanceof Error ? error : new Error(String(error));
      for (const nodeId of nodeIds) {
        const pending = pendingRequests.get(nodeId);
        if (!pending) continue;
        pendingRequests.delete(nodeId);
        pending.reject(cause);
      }
    }

    if (queuedIds.size > 0) scheduleBatch();
  }

  return function resolveUrl(figmaId: string): Promise<string> {
    const cached = cachedUrls.get(figmaId);
    if (cached) return Promise.resolve(cached);

    const existing = pendingRequests.get(figmaId);
    if (existing) return existing.promise;

    let resolve!: (url: string) => void;
    let reject!: (error: Error) => void;
    const promise = new Promise<string>((resolvePromise, rejectPromise) => {
      resolve = resolvePromise;
      reject = rejectPromise;
    });

    pendingRequests.set(figmaId, { promise, resolve, reject });
    queuedIds.add(figmaId);
    scheduleBatch();
    return promise;
  };
}

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
  const client = accessToken ? createFigmaClient(accessToken) : undefined;
  const fetchUrl =
    client && fileKey
      ? createBatchedFigmaImageUrlResolver((nodeIds) =>
          fetchFigmaImageUrls({ client, fileKey, nodeIds, options }),
        )
      : undefined;

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

    return fetchUrl?.(figmaId) ?? PLACEHOLDER_DATA_URI;
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
            figmaImage: true,
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
