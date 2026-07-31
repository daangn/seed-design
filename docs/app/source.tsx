import { IconLockLine } from "@karrotmarket/react-monochrome-icon";
import {
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
} from "@/.source/server";
import {
  loader,
  type ContentStorage,
  type PageTreeTransformer,
  type StaticSource,
} from "fumadocs-core/source";
import type { ComponentType, SVGProps } from "react";
import { markTabbedFolder, type TabbedFolderNode } from "@/lib/tabbed";
import { markFeatured } from "@/lib/featured";

const iconMap: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  Lock: IconLockLine,
};

const iconHandler = (icon: string | undefined) => {
  if (!icon || !(icon in iconMap)) return undefined;

  const Icon = iconMap[icon];
  return <Icon />;
};

// meta.json `layout: "tabs"`(source.config.ts docsMetaSchema)를 폴더 노드에 스탬프한다.
// 빌더는 index/children/name이 모두 붙은 뒤 folder 훅을 호출하므로 인덱스 유무를 신뢰할
// 수 있고, 트리는 클라이언트로 직렬화되므로 사이드바/탭 스트립이 노드에서 바로 읽는다.
// (제네릭 팩토리: transformer의 `this` 컨텍스트가 소스별 storage 타입에 맞게 추론되도록)
function createTabbedFolderTransformer<S extends ContentStorage>(): PageTreeTransformer<S> {
  return {
    folder(node, _folderPath, metaPath) {
      if (!metaPath || !node.index) return node;
      const meta = this.storage.read(metaPath);
      const data =
        meta?.format === "meta"
          ? (meta.data as { layout?: string; description?: string; coverImage?: string })
          : undefined;
      if (data?.layout === "tabs") {
        // layout 마커 + 고정 헤더 데이터(description/coverImage)를 폴더 노드에 스탬프한다.
        // 트리는 클라이언트로 직렬화되므로 페이지(서버)·사이드바 카드(클라)가 같은 값을 읽는다.
        markTabbedFolder(node);
        const tabbed = node as TabbedFolderNode;
        if (data.description) tabbed.description = data.description;
        if (data.coverImage) tabbed.coverImage = data.coverImage;
        return node;
      }
      return node;
    },
  };
}

// frontmatter `featured: true`를 페이지 노드에 스탬프한다. page tree는 frontmatter를 들고
// 오지 않으므로 storage에서 다시 읽는다(async 컬렉션도 frontmatter는 동기 파싱되어 있다).
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

function createSource<TSrc extends StaticSource>(src: TSrc, baseUrl: string) {
  return loader(src, {
    baseUrl,
    icon: iconHandler,
    pageTree: { transformers: [createTabbedFolderTransformer(), createFeaturedTransformer()] },
  });
}

export const docsSource = createSource(docs.toFumadocsSource(), "/docs");
export const getStartedSource = createSource(getStartedDocs.toFumadocsSource(), "/get-started");
export const foundationsSource = createSource(foundationsDocs.toFumadocsSource(), "/foundations");
export const componentsSource = createSource(componentsDocs.toFumadocsSource(), "/components");
export const patternsSource = createSource(patternsDocs.toFumadocsSource(), "/patterns");
export const reactSource = createSource(reactDocs.toFumadocsSource(), "/react");
export const breezeSource = createSource(breezeDocs.toFumadocsSource(), "/breeze");
export const lynxSource = createSource(lynxDocs.toFumadocsSource(), "/lynx");
export const aiIntegrationSource = createSource(
  aiIntegrationDocs.toFumadocsSource(),
  "/ai-integration",
);
export const updatesSource = createSource(updatesDocs.toFumadocsSource(), "/updates");
