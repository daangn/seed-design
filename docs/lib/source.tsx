import { toFumadocsSource } from "@fumadocs/astro/source";
import { IconLockLine } from "@karrotmarket/react-monochrome-icon";
import { getCollection } from "astro:content";
import { type ContentStorage, loader, type PageTreeTransformer } from "fumadocs-core/source";
import type { ComponentType, SVGProps } from "react";
import type { ContentCollectionName } from "@/lib/content/satteri-options";
import { archivePaths } from "@/lib/docs-archive";
import { markFeatured } from "@/lib/featured";
import { markTabbedFolder, type TabbedFolderNode } from "@/lib/tabbed";

const iconMap: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  Lock: IconLockLine,
};

const iconHandler = (icon: string | undefined) => {
  if (!icon || !(icon in iconMap)) return undefined;

  const Icon = iconMap[icon];
  return <Icon />;
};

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

function createFeaturedTransformer<S extends ContentStorage>(): PageTreeTransformer<S> {
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

async function createSourceLoader<Name extends ContentCollectionName>(
  name: Name,
  baseUrl: string,
) {
  const [pages, meta] = await Promise.all([getCollection(name), getCollection(`${name}-meta`)]);

  return loader({
    source: toFumadocsSource(pages, meta),
    baseUrl,
    icon: iconHandler,
    pageTree: { transformers: [createTabbedFolderTransformer(), createFeaturedTransformer()] },
  });
}

/** 컬렉션을 처음 쓸 때 한 번만 읽고, 이후 호출은 같은 loader를 돌려준다. */
function lazySource<Name extends ContentCollectionName>(name: Name, baseUrl: string) {
  let source: ReturnType<typeof createSourceLoader<Name>> | undefined;
  return () => (source ??= createSourceLoader(name, baseUrl));
}

export const getDocsSource = lazySource("docs", "/docs");
export const getGetStartedSource = lazySource("get-started", "/get-started");
export const getFoundationsSource = lazySource("foundations", "/foundations");
export const getComponentsSource = lazySource("components", "/components");
export const getPatternsSource = lazySource("patterns", "/patterns");
export const getReactSource = lazySource("react", archivePaths.routes("react").base);
export const getBreezeSource = lazySource("breeze", "/breeze");
export const getLynxSource = lazySource("lynx", archivePaths.routes("lynx").base);
export const getAiIntegrationSource = lazySource("ai-integration", "/ai-integration");
export const getUpdatesSource = lazySource("updates", "/updates");
