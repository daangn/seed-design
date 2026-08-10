import { fileGenerator, remarkDocGen } from "fumadocs-docgen";
import { defineConfig, defineDocs, frontmatterSchema, metaSchema } from "fumadocs-mdx/config";
import { remarkFigmaImage } from "./components/figma-image/remark-figma-image";
import { readFigmaImageManifest } from "./components/figma-image/figma-image-manifest";
import { filteredTypeTableGenerator } from "./components/type-table/generator";
import { remarkAutoTypeTable } from "fumadocs-typescript";
import { remarkFixObjectKeys } from "./components/type-table/remark-fix-object-keys";
import lastModified from "fumadocs-mdx/plugins/last-modified";
import z from "zod";
import { env } from "@/app/env";
import { COVER_IMAGE_PATH_ERROR_MESSAGE, isValidCoverImagePath } from "./lib/cover-image";

/**
 * 모든 docs 컬렉션이 공유하는 frontmatter 베이스.
 * - `deprecated`: 페이지/컴포넌트 deprecated 표시
 * - `layout`: 콘텐츠 영역 레이아웃 ("docs" 표준 아티클 | "overview" 자체 레이아웃)
 * - `featured`: 사이드바 라벨 뒤에 강조 dot 표시 (lib/featured.ts)
 */
const baseDocsSchema = frontmatterSchema.extend({
  deprecated: z.boolean().optional(),
  layout: z.enum(["docs", "overview"]).default("docs"),
  featured: z.boolean().optional(),
});

const staticCoverImageSchema = {
  // 정적 커버 이미지 베이스 경로(확장자 없이, 예: "/og/default").
  // 페이지 상단 썸네일은 `${coverImage}.webp`, OG 이미지는 `${coverImage}.png`로 해석된다.
  // (resolveCoverImage in lib/seo.ts)
  coverImage: z
    .string()
    .refine(isValidCoverImagePath, { message: COVER_IMAGE_PATH_ERROR_MESSAGE })
    .optional(),
};

/**
 * 사이드바 라벨(frontmatter `title`)과 별개로 콘텐츠 h1·og:title에 쓰는 제목.
 * 예: 사이드바 "Overview" + h1 "Foundations". 없으면 `title`로 폴백한다.
 */
const headingSchema = {
  heading: z.string().optional(),
};

/**
 * 모든 docs 컬렉션이 공유하는 meta.json 스키마.
 * - `layout: "tabs"`: 폴더를 "탭형 subject"로 선언 — 사이드바에선 leaf 하나로 접고,
 *   자식 페이지는 상단 routed tab 스트립으로 렌더한다. page tree transformer
 *   (app/source.tsx)가 이 값을 폴더 노드에 스탬프한다. (기본 metaSchema는 $strip이라
 *   확장 없이는 커스텀 키가 제거됨)
 * - `title`/`description`/`coverImage`: 탭형 폴더의 **고정 헤더**(제목·설명·썸네일) 데이터.
 *   transformer가 폴더 노드에 스탬프해 페이지(서버)와 사이드바 카드(클라)가 공유한다.
 *   (title/description은 metaSchema에 이미 있음; coverImage만 확장)
 */
const docsMetaSchema = metaSchema.extend({
  layout: z.enum(["tabs"]).optional(),
  ...staticCoverImageSchema,
});

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    async: true,
    schema: baseDocsSchema.extend({
      coverImageFigmaId: z.string().optional(),
    }),
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: { schema: docsMetaSchema },
});

/** docs 계열(디자인 스펙) 공유 스키마: overview 레이아웃 + Figma 커버 이미지 지원 */
const designSchema = baseDocsSchema.extend({
  coverImageFigmaId: z.string().optional(),
  ...staticCoverImageSchema,
  ...headingSchema,
});

export const getStartedDocs = defineDocs({
  dir: "content/get-started",
  docs: { async: true, schema: designSchema, postprocess: { includeProcessedMarkdown: true } },
  meta: { schema: docsMetaSchema },
});

export const foundationsDocs = defineDocs({
  dir: "content/foundations",
  docs: { async: true, schema: designSchema, postprocess: { includeProcessedMarkdown: true } },
  meta: { schema: docsMetaSchema },
});

export const componentsDocs = defineDocs({
  dir: "content/components",
  docs: {
    async: true,
    // `componentIds`: 이 페이지가 헤더에 상태를 보여줄 Sanity 컴포넌트 id 목록.
    // 생략하면 slug 하나로 간주. 서브컴포넌트를 여럿 다루는 페이지(list, manner-temp)만 명시한다.
    schema: designSchema.extend({ componentIds: z.array(z.string()).optional() }),
    postprocess: { includeProcessedMarkdown: true },
  },
  meta: { schema: docsMetaSchema },
});

export const patternsDocs = defineDocs({
  dir: "content/patterns",
  docs: { async: true, schema: designSchema, postprocess: { includeProcessedMarkdown: true } },
  meta: { schema: docsMetaSchema },
});

export const reactDocs = defineDocs({
  dir: "content/react",
  docs: {
    async: true,
    schema: baseDocsSchema.extend({ ...staticCoverImageSchema, ...headingSchema }),
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: { schema: docsMetaSchema },
});

export const breezeDocs = defineDocs({
  dir: "content/breeze",
  docs: {
    async: true,
    schema: baseDocsSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: { schema: docsMetaSchema },
});

export const lynxDocs = defineDocs({
  dir: "content/lynx",
  docs: {
    async: true,
    schema: baseDocsSchema.extend({ ...staticCoverImageSchema, ...headingSchema }),
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: { schema: docsMetaSchema },
});

export const aiIntegrationDocs = defineDocs({
  dir: "content/ai-integration",
  docs: {
    async: true,
    schema: baseDocsSchema.extend({ ...staticCoverImageSchema, ...headingSchema }),
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: { schema: docsMetaSchema },
});

export const updatesDocs = defineDocs({
  dir: "content/updates",
  docs: {
    async: true,
    schema: frontmatterSchema.extend({
      publishedAt: z.iso.date().or(z.date()).optional(),
      // 커버는 정적 webp/png(노션 추출 등, `staticCoverImageSchema`) 또는 Figma id 중 하나.
      // 정적 `coverImage`가 있으면 우선하고, 없으면 `coverImageFigmaId`로 폴백한다.
      ...staticCoverImageSchema,
      coverImageFigmaId: z.string().optional(),
    }),
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: { schema: docsMetaSchema },
});

export default defineConfig({
  plugins: [lastModified()],
  mdxOptions: {
    remarkStructureOptions: {
      mdxTypes(node) {
        if (!node.children || node.children.length === 0) return true;

        switch (node.name) {
          case "TypeTable":
          case "Callout":
          case "Card":
            return true;
        }

        return false;
      },
      stringify: {
        filterElement: (node) => {
          if (node.type !== "mdxJsxFlowElement" && node.type !== "mdxJsxTextElement") return true;

          switch (node.name) {
            // fumadocs built-in
            case "File":
            case "Callout":
            case "Card":

            // SEED Docs specific
            case "FigmaImage":
            case "DoImage":
            case "DontImage":
              return true;
          }

          // TypeTable is code-generated with a giant serialized `type={{…}}` prop
          // (remarkAutoTypeTable), so serializing the full tag dumped that JSON blob
          // into the search index. Falling through to "children-only" keeps it out —
          // TypeTable has no children, so it contributes nothing; the `### Prop`
          // headings around each table stay searchable.
          return "children-only";
        },
        filterMdxAttributes: (node, attribute) => {
          if (attribute.type !== "mdxJsxAttribute") return false;

          // if FigmaImage/DoImage/DontImage, remove src
          if (node.name === "FigmaImage" || node.name === "DoImage" || node.name === "DontImage")
            return attribute.name !== "src";

          return true;
        },
      },
    },
    remarkNpmOptions: {
      persist: {
        id: "package-manager",
      },
    },
    remarkPlugins: [
      [remarkDocGen, { generators: [fileGenerator()] }],
      [
        remarkAutoTypeTable,
        {
          generator: filteredTypeTableGenerator,
          name: "react-type-table",
          options: { basePath: process.cwd() },
        },
      ],
      remarkFixObjectKeys,
      [
        remarkFigmaImage,
        {
          fileKey: env.figmaFileKey,
          accessToken: env.figmaPersonalAccessToken,
          manifest: readFigmaImageManifest(),
          fetchUrlsOptions: {
            format: "png",
            scale: 2,
          },
        },
      ],
    ],
    rehypeCodeOptions: {
      lazy: true,
      langs: ["ts", "js", "html", "tsx", "mdx"],
      inline: "tailing-curly-colon",
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    },
  },
});
