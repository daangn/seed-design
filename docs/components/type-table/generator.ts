import { mkdirSync, readdirSync, unlinkSync } from "node:fs";
import { basename, resolve } from "node:path";
import {
  createFileSystemGeneratorCache,
  createGenerator,
  type Cache,
  type Generator,
} from "fumadocs-typescript";
import { typeTableCacheCompatibilityHash } from "./cache-compatibility";

export {
  collectTypeDependencyFiles,
  typeTableCacheCompatibilityHash,
} from "./cache-compatibility";

const DOCS_DIRECTORY =
  basename(process.cwd()) === "docs" ? process.cwd() : resolve(process.cwd(), "docs");
// Next.js는 `.next/cache` 하위 파일을 빌드 뒤에도 유지하며, 문서 CI도 이 경로를 복원한다.
const TYPE_TABLE_CACHE_DIRECTORY = resolve(DOCS_DIRECTORY, ".next/cache/fumadocs-typescript");

export function createCompatibleTypeTableCache(
  directory: string,
  compatibilityHash = typeTableCacheCompatibilityHash,
): Cache {
  const fileSystemCache = createFileSystemGeneratorCache(directory);

  return {
    read(hash) {
      // upstream key를 그대로 보존하고 프로젝트 호환성 hash로 generation만 분리한다.
      return fileSystemCache.read(`${compatibilityHash}-${hash}`);
    },
    async write(hash, value) {
      try {
        await fileSystemCache.write(`${compatibilityHash}-${hash}`, value);
      } catch {
        // cache는 최적화일 뿐이므로 읽기 전용이거나 사용할 수 없어도 문서 생성은 계속한다.
      }
    },
  };
}

function removeIncompatibleTypeTableCacheFiles(directory: string) {
  const resolvedDirectory = resolve(directory);
  try {
    mkdirSync(resolvedDirectory, { recursive: true });
  } catch {
    return;
  }

  let files: string[];
  try {
    files = readdirSync(resolvedDirectory);
  } catch {
    return;
  }

  for (const file of files) {
    // 호환성 hash가 바뀔 때마다 이전 generation이 CI cache에 계속 쌓이지 않도록 정리한다.
    if (!file.endsWith(".json") || file.startsWith(`${typeTableCacheCompatibilityHash}-`)) continue;
    try {
      unlinkSync(resolve(resolvedDirectory, file));
    } catch {
      // 다른 Next.js worker가 같은 stale cache를 먼저 지운 경우는 정상적인 경쟁 상태다.
    }
  }
}

export function createFilteredTypeTableGenerator(
  cacheDirectory = TYPE_TABLE_CACHE_DIRECTORY,
): Generator {
  removeIncompatibleTypeTableCacheFiles(cacheDirectory);
  const baseGenerator = createGenerator({
    cache: createCompatibleTypeTableCache(cacheDirectory),
  });

  async function filteredGenerateDocumentation(
    ...args: Parameters<Generator["generateDocumentation"]>
  ): ReturnType<Generator["generateDocumentation"]> {
    const [file, name, options = {}] = args;

    const output = await baseGenerator.generateDocumentation(file, name, {
      ...options,
      transform(entry, type, symbol) {
        options.transform?.call(this, entry, type, symbol);
        const src = symbol.getDeclarations()?.[0]?.getSourceFile().getFilePath();
        if (src?.includes("node_modules")) {
          entry.tags.push({ name: "external", text: src ?? "" });
        }
      },
    });

    return output.map((item) => ({
      ...item,
      entries: item.entries
        .filter((e) => e.tags.every((t) => t.name !== "external"))
        .map((e) => ({
          ...e,
          // fumadocs-typescript's getSimpleForm resolves type aliases into their
          // full union members, making simplifiedType longer than type.
          // Use type (which preserves aliases via UseAliasDefinedOutsideCurrentScope)
          // for both collapsed and expanded views until upstream is fixed.
          // See: https://github.com/fuma-nama/fumadocs/packages/typescript/src/lib/get-simple-form.ts
          simplifiedType: e.type,
        })),
    }));
  }

  return {
    generateDocumentation: filteredGenerateDocumentation,
    generateTypeTable(props, options) {
      return baseGenerator.generateTypeTable.call(this, props, options);
    },
  };
}

/**
 * Generator that filters out types originating from node_modules.
 *
 * This is the only reason SEED forked the type-table plugin from fumadocs.
 * By wrapping generateDocumentation, we can use fumadocs' remarkAutoTypeTable
 * directly while still excluding external types (e.g. React internal props).
 *
 * generateTypeTable calls `this.generateDocumentation` internally,
 * so we need a proper object with method references (not spread copy)
 * for `this` binding to work correctly.
 */
export const filteredTypeTableGenerator = createFilteredTypeTableGenerator();
