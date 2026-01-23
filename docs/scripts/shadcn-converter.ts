/**
 * @see https://ui.shadcn.com/docs/registry
 */
import type { RegistryItem, RegistryBaseItem, RegistryFontItem } from "shadcn/schema";

type ShadcnRegistryItem = Exclude<RegistryItem, RegistryBaseItem | RegistryFontItem>;

type ShadcnFile = NonNullable<ShadcnRegistryItem["files"]>[number];

type ShadcnRegistryIndexItem = Omit<ShadcnRegistryItem, "files"> & {
  files?: Array<{ path: string; type?: ShadcnFile["type"]; target?: string }>;
};

import type { GeneratedRegistryItem, GeneratedRegistry } from "../registry/schema.js";

const SHADCN_SCHEMA_URL = "https://ui.shadcn.com/schema/registry-item.json";
const SHADCN_REGISTRY_SCHEMA_URL = "https://ui.shadcn.com/schema.json";

export interface ConvertOptions {
  registryId: string;
  baseUrl: string;
}

/**
 * SEED GeneratedRegistryItem을 shadcn RegistryItem으로 변환
 */
export function convertToShadcnItem(
  item: GeneratedRegistryItem,
  options: ConvertOptions,
): ShadcnRegistryItem {
  return {
    $schema: SHADCN_SCHEMA_URL,
    name: item.id,
    type: determineItemType(options.registryId),
    description: item.description,
    dependencies: item.dependencies,
    registryDependencies: convertInnerDependencies(item.innerDependencies, options),
    files: item.snippets.map((s) => convertFile(s, options.registryId)),
    meta: buildMeta(item),
  };
}

/**
 * SEED GeneratedRegistry를 shadcn registry.json 형식으로 변환
 */
export function convertToShadcnRegistry(
  registries: GeneratedRegistry[],
  options: { name: string; homepage?: string; baseUrl: string },
): { $schema: string; name: string; homepage?: string; items: ShadcnRegistryIndexItem[] } {
  const items: ShadcnRegistryIndexItem[] = [];

  for (const registry of registries) {
    for (const item of registry.items) {
      items.push(
        convertToShadcnIndexItem(item, {
          registryId: registry.id,
          baseUrl: options.baseUrl,
        }),
      );
    }
  }

  return {
    $schema: SHADCN_REGISTRY_SCHEMA_URL,
    name: options.name,
    homepage: options.homepage,
    items: items.sort((a, b) => a.name.localeCompare(b.name)),
  };
}

/**
 * registry.json 용 인덱스 아이템 생성 (content 제외)
 */
function convertToShadcnIndexItem(
  item: GeneratedRegistry["items"][number],
  options: ConvertOptions,
): ShadcnRegistryIndexItem {
  return {
    name: item.id,
    type: determineItemType(options.registryId),
    description: item.description,
    dependencies: item.dependencies,
    registryDependencies: convertInnerDependencies(item.innerDependencies, options),
    files: item.snippets.map((s) => ({
      path: buildFilePath(s.path, options.registryId),
      type: determineFileType(s.path),
    })),
    meta: buildMetaFromIndexItem(item),
  };
}

/**
 * registry ID에 따른 shadcn item type 결정
 */
function determineItemType(registryId: string): ShadcnRegistryItem["type"] {
  const map: Record<string, ShadcnRegistryItem["type"]> = {
    ui: "registry:ui",
    lib: "registry:lib",
    breeze: "registry:component",
  };
  return map[registryId] || "registry:component";
}

/**
 * 파일 경로에 따른 shadcn file type 결정
 */
function determineFileType(filePath: string): ShadcnFile["type"] {
  if (filePath.endsWith(".css") || filePath.endsWith(".module.css")) {
    return "registry:file";
  }
  if (filePath.includes("hook") || filePath.startsWith("use-") || filePath.includes("/use-")) {
    return "registry:hook";
  }
  if (filePath.endsWith(".ts") && !filePath.endsWith(".tsx")) {
    return "registry:lib";
  }
  return "registry:component";
}

/**
 * 파일 경로 변환 (shadcn 형식)
 */
function buildFilePath(originalPath: string, registryId: string): string {
  // shadcn은 registry/ui/xxx.tsx 형식 사용
  return `registry/${registryId}/${originalPath}`;
}

/**
 * 파일 타겟 경로 생성 (설치 시 실제 경로)
 */
function buildTargetPath(originalPath: string): string {
  // seed-design/xxx.tsx 형식으로 설치
  return `seed-design/${originalPath}`;
}

/**
 * snippet을 shadcn file로 변환
 */
function convertFile(
  snippet: GeneratedRegistryItem["snippets"][number],
  registryId: string,
): ShadcnFile {
  const fileType = determineFileType(snippet.path);

  // registry:page와 registry:file은 target 필수
  if (fileType === "registry:page" || fileType === "registry:file") {
    return {
      path: buildFilePath(snippet.path, registryId),
      type: fileType,
      content: removeUseClient(snippet.content),
      target: buildTargetPath(snippet.path),
    };
  }

  return {
    path: buildFilePath(snippet.path, registryId),
    type: fileType,
    content: removeUseClient(snippet.content),
    target: buildTargetPath(snippet.path),
  };
}

/**
 * innerDependencies를 registryDependencies로 변환
 *
 * - 동일 registry 내 의존성: 이름만 (e.g., "loading-indicator")
 * - 다른 registry 의존성: 전체 URL (e.g., "https://seed-design.io/r/lib/manner-temp-level.json")
 */
function convertInnerDependencies(
  innerDeps: GeneratedRegistryItem["innerDependencies"],
  options: ConvertOptions,
): string[] | undefined {
  if (!innerDeps || innerDeps.length === 0) return undefined;

  const result: string[] = [];

  for (const { registryId, itemIds } of innerDeps) {
    for (const itemId of itemIds) {
      result.push(`@seed/${itemId}`);
    }
  }

  return result.length > 0 ? result : undefined;
}

/**
 * "use client" 지시문 제거
 * shadcn CLI가 rsc: true 설정 시 자동으로 추가함
 */
function removeUseClient(content: string): string {
  return content.replace(/^["']use client["'];?\s*\n?/m, "");
}

/**
 * meta 객체 생성 (deprecated, hideFromCLICatalog 등)
 */
function buildMeta(item: GeneratedRegistryItem): Record<string, unknown> | undefined {
  const meta: Record<string, unknown> = {};

  if (item.deprecated) {
    meta.deprecated = true;
  }
  if (item.hideFromCLICatalog) {
    meta.hideFromCLICatalog = true;
  }

  return Object.keys(meta).length > 0 ? meta : undefined;
}

/**
 * index item용 meta 객체 생성
 */
function buildMetaFromIndexItem(
  item: GeneratedRegistry["items"][number],
): Record<string, unknown> | undefined {
  const meta: Record<string, unknown> = {};

  if (item.deprecated) {
    meta.deprecated = true;
  }
  if (item.hideFromCLICatalog) {
    meta.hideFromCLICatalog = true;
  }

  return Object.keys(meta).length > 0 ? meta : undefined;
}
