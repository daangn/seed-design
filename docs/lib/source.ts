import { type MetaEntry, type PageEntry, toFumadocsSource } from "@fumadocs/astro/source";
import { getCollection } from "astro:content";
import { type ContentStorage, loader, type PageTreeTransformer } from "fumadocs-core/source";
import { archivePaths } from "@/lib/docs-archive";
import { markFeatured } from "@/lib/featured";
import { isPageTreeIconName } from "@/lib/page-tree-icons";
import { markTabbedFolder, type TabbedFolderNode } from "@/lib/tabbed";

/**
 * page tree는 island props로 직렬화되므로 아이콘을 React 노드가 아니라 이름으로 남긴다.
 * `components/layout/docs-shell.tsx`가 브라우저에서 같은 이름으로 아이콘을 고른다.
 */
const iconHandler = (icon: string | undefined) =>
  icon && isPageTreeIconName(icon) ? icon : undefined;

// meta.json `layout: "tabs"`를 폴더 노드에 기록해 탭형 헤더와 사이드바가 함께 사용합니다.
function tabbedFolderTransformer<S extends ContentStorage>(): PageTreeTransformer<S> {
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

function featuredTransformer<S extends ContentStorage>(): PageTreeTransformer<S> {
  return {
    file(node, filePath) {
      if (!filePath) return node;
      const file = this.storage.read(filePath);
      if (file?.format === "page" && (file.data as { featured?: boolean }).featured === true) {
        markFeatured(node);
      }
      return node;
    },
  };
}

async function createSourceLoader<Page extends PageEntry, Meta extends MetaEntry>(
  pages: Promise<Page[]>,
  meta: Promise<Meta[]>,
  baseUrl: string,
) {
  // source를 첫 인자로 넘겨야 page·meta 타입이 options(transformer)보다 먼저 추론된다.
  return loader(toFumadocsSource(await pages, await meta), {
    baseUrl,
    icon: iconHandler,
    pageTree: { transformers: [tabbedFolderTransformer(), featuredTransformer()] },
  });
}

/** 컬렉션을 처음 쓸 때 한 번만 읽고, 이후 호출은 같은 loader를 돌려준다. */
function lazy<Source>(create: () => Promise<Source>) {
  let source: Promise<Source> | undefined;
  return () => (source ??= create());
}

// 컬렉션 이름은 `src/content.config.ts`와 같아야 한다.
export const getDocsSource = lazy(() =>
  createSourceLoader(getCollection("docs"), getCollection("docs-meta"), "/docs"),
);
export const getGetStartedSource = lazy(() =>
  createSourceLoader(
    getCollection("get-started"),
    getCollection("get-started-meta"),
    "/get-started",
  ),
);
export const getFoundationsSource = lazy(() =>
  createSourceLoader(
    getCollection("foundations"),
    getCollection("foundations-meta"),
    "/foundations",
  ),
);
export const getComponentsSource = lazy(() =>
  createSourceLoader(getCollection("components"), getCollection("components-meta"), "/components"),
);
export const getPatternsSource = lazy(() =>
  createSourceLoader(getCollection("patterns"), getCollection("patterns-meta"), "/patterns"),
);
export const getReactSource = lazy(() =>
  createSourceLoader(
    getCollection("react"),
    getCollection("react-meta"),
    archivePaths.routes("react").base,
  ),
);
export const getBreezeSource = lazy(() =>
  createSourceLoader(getCollection("breeze"), getCollection("breeze-meta"), "/breeze"),
);
export const getLynxSource = lazy(() =>
  createSourceLoader(
    getCollection("lynx"),
    getCollection("lynx-meta"),
    archivePaths.routes("lynx").base,
  ),
);
export const getAiIntegrationSource = lazy(() =>
  createSourceLoader(
    getCollection("ai-integration"),
    getCollection("ai-integration-meta"),
    "/ai-integration",
  ),
);
export const getUpdatesSource = lazy(() =>
  createSourceLoader(getCollection("updates"), getCollection("updates-meta"), "/updates"),
);
