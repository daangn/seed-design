import { IconLockLine } from "@karrotmarket/react-monochrome-icon";
import { localMd, type SatteriLocalMarkdown } from "@fumadocs/satteri/local-md";
import { watchWithDevServer } from "@fumadocs/satteri/local-md/dev/ws";
import { remarkAutoTypeTable } from "@fumadocs/satteri/remark-auto-type-table";
import { remarkLlms, type LLMsOptions } from "@fumadocs/satteri/remark-llms";
import type { StructureOptions } from "@fumadocs/satteri/remark-structure";
import type { SatteriPresetOptions } from "@fumadocs/satteri/preset";
import { dynamicLoader } from "fumadocs-core/source/dynamic";
import {
  type ContentStorage,
  type DynamicSource,
  type PageTreeTransformer,
} from "fumadocs-core/source";
import { metaSchema, pageSchema } from "fumadocs-core/source/schema";
import { fileGenerator } from "fumadocs-docgen";
import type { ComponentType, SVGProps } from "react";
import z from "zod";
import { env } from "@/app/env";
import { readFigmaImageManifest } from "@/components/figma-image/figma-image-manifest";
import { remarkFigmaImage } from "@/components/figma-image/remark-figma-image";
import { filteredTypeTableGenerator } from "@/components/type-table/generator";
import { markFeatured } from "@/lib/featured";
import { COVER_IMAGE_PATH_ERROR_MESSAGE, isValidCoverImagePath } from "@/lib/cover-image";
import { remarkDocGen } from "@/lib/satteri/remark-doc-gen";
import { remarkApplyLlmsFilter } from "@/lib/satteri/remark-llms-filter";
import { markTabbedFolder, type TabbedFolderNode } from "@/lib/tabbed";
import { updatesFrontmatterSchema } from "@/lib/updates-frontmatter";

interface SatteriExports extends Record<string, unknown> {
  processed?: string;
}

const iconMap: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  Lock: IconLockLine,
};

const iconHandler = (icon: string | undefined) => {
  if (!icon || !(icon in iconMap)) return undefined;

  const Icon = iconMap[icon];
  return <Icon />;
};

/**
 * 모든 문서 컬렉션이 공유하는 frontmatter 베이스입니다.
 *
 * - `deprecated`: 페이지나 컴포넌트의 지원 중단 표시
 * - `layout`: 표준 문서와 자체 overview 레이아웃 구분
 * - `featured`: 사이드바 라벨 뒤의 강조 점 표시
 */
const baseDocsSchema = pageSchema.extend({
  deprecated: z.boolean().optional(),
  layout: z.enum(["docs", "overview"]).default("docs"),
  featured: z.boolean().optional(),
});

const staticCoverImageSchema = {
  coverImage: z
    .string()
    .refine(isValidCoverImagePath, { message: COVER_IMAGE_PATH_ERROR_MESSAGE })
    .optional(),
};

const headingSchema = {
  heading: z.string().optional(),
};

/** `layout: "tabs"`인 meta.json의 고정 헤더 데이터를 보존합니다. */
const docsMetaSchema = metaSchema.extend({
  layout: z.enum(["tabs"]).optional(),
  ...staticCoverImageSchema,
});

const designSchema = baseDocsSchema.extend({
  coverImageFigmaId: z.string().optional(),
  ...staticCoverImageSchema,
  ...headingSchema,
});

const filterStructureElement: NonNullable<LLMsOptions["filterElement"]> = (node) => {
  if (node.type !== "mdxJsxFlowElement" && node.type !== "mdxJsxTextElement") return true;

  switch (node.name) {
    case "File":
    case "Callout":
    case "Card":
    case "FigmaImage":
    case "DoImage":
    case "DontImage":
      return true;
    default:
      // TypeTable의 거대한 type 속성과 UI 전용 컴포넌트 태그는 검색 본문에서 제외합니다.
      return "children-only";
  }
};

const filterLlmsElement: NonNullable<LLMsOptions["filterElement"]> = (node) => {
  if (
    (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") &&
    (node.name === "ComponentExample" || node.name === "LynxComponentExample")
  ) {
    return true;
  }
  return filterStructureElement(node);
};

const structureStringify: NonNullable<StructureOptions["stringify"]> = {
  filterElement: filterStructureElement,
  filterMdxAttributes(node, attribute) {
    if (attribute.type !== "mdxJsxAttribute") return false;

    if (node.name === "FigmaImage" || node.name === "DoImage" || node.name === "DontImage") {
      return attribute.name !== "src";
    }

    return true;
  },
};

const structureOptions: StructureOptions = {
  mdxTypes(node) {
    if (!("children" in node) || node.children.length === 0) return true;
    if (!("name" in node)) return false;

    switch (node.name) {
      case "TypeTable":
      case "Callout":
      case "Card":
        return true;
      default:
        return false;
    }
  },
  stringify: structureStringify,
};

const llmsOptions: LLMsOptions = {
  as: "processed",
  filterElement: filterLlmsElement,
  filterMdxAttributes: structureStringify.filterMdxAttributes,
};

const figmaImageManifest = readFigmaImageManifest();
const customMdastPlugins = [
  remarkDocGen({ generators: [fileGenerator()] }),
  remarkAutoTypeTable({
    generator: filteredTypeTableGenerator,
    name: "react-type-table",
    options: { basePath: process.cwd() },
  }),
  remarkFigmaImage({
    fileKey: env.figmaFileKey,
    accessToken: env.figmaPersonalAccessToken,
    manifest: figmaImageManifest,
    fetchUrlsOptions: {
      format: "png",
      scale: 2,
    },
  }),
  remarkApplyLlmsFilter(filterLlmsElement),
  remarkLlms(llmsOptions),
];

function createSatteriOptions(): SatteriPresetOptions {
  return {
    // 문서에서 directive 문법을 쓰지 않습니다. 켜 두면 한국어의 `2:1로` 같은 비율을
    // textDirective로 해석해 LLM용 Markdown 직렬화가 실패합니다.
    features: { directive: false },
    // Local Markdown는 런타임 함수 본문으로 컴파일하므로 이미지 import 식별자를 만들지 않습니다.
    // public 경로는 그대로 유지하고 크기만 읽어 레이아웃 이동을 방지합니다.
    remarkImageOptions: { useImport: false },
    remarkStructureOptions: structureOptions,
    remarkNpmOptions: {
      persist: {
        id: "package-manager",
      },
    },
    // 컬렉션 사이에서 같은 플러그인을 공유해 Figma URL 요청 상태를 재사용합니다.
    mdastPlugins: customMdastPlugins,
    rehypeCodeOptions: {
      lazy: true,
      langs: ["ts", "js", "html", "tsx", "mdx"],
      inline: "tailing-curly-colon",
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    },
  };
}

const docs = localMd({
  dir: "content/docs",
  frontmatterSchema: baseDocsSchema.extend({ coverImageFigmaId: z.string().optional() }),
  metaSchema: docsMetaSchema,
  satteriOptions: createSatteriOptions,
});

const getStartedDocs = localMd({
  dir: "content/get-started",
  frontmatterSchema: designSchema,
  metaSchema: docsMetaSchema,
  satteriOptions: createSatteriOptions,
});

const foundationsDocs = localMd({
  dir: "content/foundations",
  frontmatterSchema: designSchema,
  metaSchema: docsMetaSchema,
  satteriOptions: createSatteriOptions,
});

const componentsDocs = localMd({
  dir: "content/components",
  frontmatterSchema: designSchema.extend({ componentIds: z.array(z.string()).optional() }),
  metaSchema: docsMetaSchema,
  satteriOptions: createSatteriOptions,
});

const patternsDocs = localMd({
  dir: "content/patterns",
  frontmatterSchema: designSchema,
  metaSchema: docsMetaSchema,
  satteriOptions: createSatteriOptions,
});

const reactDocs = localMd({
  dir: "content/react",
  frontmatterSchema: baseDocsSchema.extend({ ...staticCoverImageSchema, ...headingSchema }),
  metaSchema: docsMetaSchema,
  satteriOptions: createSatteriOptions,
});

const breezeDocs = localMd({
  dir: "content/breeze",
  frontmatterSchema: baseDocsSchema,
  metaSchema: docsMetaSchema,
  satteriOptions: createSatteriOptions,
});

const lynxDocs = localMd({
  dir: "content/lynx",
  frontmatterSchema: baseDocsSchema.extend({ ...staticCoverImageSchema, ...headingSchema }),
  metaSchema: docsMetaSchema,
  satteriOptions: createSatteriOptions,
});

const aiIntegrationDocs = localMd({
  dir: "content/ai-integration",
  frontmatterSchema: baseDocsSchema.extend({ ...staticCoverImageSchema, ...headingSchema }),
  metaSchema: docsMetaSchema,
  satteriOptions: createSatteriOptions,
});

const updatesDocs = localMd({
  dir: "content/updates",
  frontmatterSchema: updatesFrontmatterSchema,
  metaSchema: docsMetaSchema,
  satteriOptions: createSatteriOptions,
});

// meta.json `layout: "tabs"`를 폴더 노드에 기록해 탭형 헤더와 사이드바가 함께 사용합니다.
function createTabbedFolderTransformer<S extends ContentStorage>(): PageTreeTransformer<S> {
  return {
    folder(node, _folderPath, metaPath) {
      if (!metaPath || !node.index) return node;
      const meta = this.storage.read(metaPath);
      const data =
        meta?.format === "meta"
          ? (meta.data as { layout?: string; description?: string; coverImage?: string })
          : undefined;
      if (data?.layout !== "tabs") return node;

      markTabbedFolder(node);
      const tabbed = node as TabbedFolderNode;
      if (data.description) tabbed.description = data.description;
      if (data.coverImage) tabbed.coverImage = data.coverImage;
      return node;
    },
  };
}

// Local Markdown는 커스텀 frontmatter를 `data.frontmatter`에 보관합니다.
function createFeaturedTransformer<S extends ContentStorage>(): PageTreeTransformer<S> {
  return {
    file(node, filePath) {
      if (!filePath) return node;
      const file = this.storage.read(filePath);
      if (
        file?.format === "page" &&
        (file.data as { frontmatter?: { featured?: boolean } }).frontmatter?.featured === true
      ) {
        markFeatured(node);
      }
      return node;
    },
  };
}

function createSourceLoader<TSource extends DynamicSource>(source: TSource, baseUrl: string) {
  return dynamicLoader(source, {
    baseUrl,
    icon: iconHandler,
    pageTree: { transformers: [createTabbedFolderTransformer(), createFeaturedTransformer()] },
  });
}

function registerDevWatcher(source: SatteriLocalMarkdown<z.ZodType, z.ZodType>): void {
  if (process.env.NODE_ENV !== "development") return;

  void watchWithDevServer(source).catch((error) => {
    console.error(`Failed to register Satteri dev watcher for ${source.dir}:`, error);
  });
}

const localSources = [
  docs,
  getStartedDocs,
  foundationsDocs,
  componentsDocs,
  patternsDocs,
  reactDocs,
  breezeDocs,
  lynxDocs,
  aiIntegrationDocs,
  updatesDocs,
] as const;

for (const source of localSources) registerDevWatcher(source);

const docsLoader = createSourceLoader(docs.dynamicSource<SatteriExports>(), "/docs");
const getStartedLoader = createSourceLoader(
  getStartedDocs.dynamicSource<SatteriExports>(),
  "/get-started",
);
const foundationsLoader = createSourceLoader(
  foundationsDocs.dynamicSource<SatteriExports>(),
  "/foundations",
);
const componentsLoader = createSourceLoader(
  componentsDocs.dynamicSource<SatteriExports>(),
  "/components",
);
const patternsLoader = createSourceLoader(
  patternsDocs.dynamicSource<SatteriExports>(),
  "/patterns",
);
const reactLoader = createSourceLoader(reactDocs.dynamicSource<SatteriExports>(), "/react");
const breezeLoader = createSourceLoader(breezeDocs.dynamicSource<SatteriExports>(), "/breeze");
const lynxLoader = createSourceLoader(lynxDocs.dynamicSource<SatteriExports>(), "/lynx");
const aiIntegrationLoader = createSourceLoader(
  aiIntegrationDocs.dynamicSource<SatteriExports>(),
  "/ai-integration",
);
const updatesLoader = createSourceLoader(updatesDocs.dynamicSource<SatteriExports>(), "/updates");

export const getDocsSource = docsLoader.get;
export const getGetStartedSource = getStartedLoader.get;
export const getFoundationsSource = foundationsLoader.get;
export const getComponentsSource = componentsLoader.get;
export const getPatternsSource = patternsLoader.get;
export const getReactSource = reactLoader.get;
export const getBreezeSource = breezeLoader.get;
export const getLynxSource = lynxLoader.get;
export const getAiIntegrationSource = aiIntegrationLoader.get;
export const getUpdatesSource = updatesLoader.get;
