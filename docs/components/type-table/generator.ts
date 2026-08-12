import { mkdirSync, readdirSync, readFileSync, unlinkSync } from "node:fs";
import { basename, relative, resolve } from "node:path";
import {
  createFileSystemGeneratorCache,
  createGenerator,
  generateHash,
  type Cache,
  type Generator,
} from "fumadocs-typescript";

const TYPE_TABLE_CACHE_SCHEMA = "seed-filtered-type-table-v1";
const DOCS_DIRECTORY =
  basename(process.cwd()) === "docs" ? process.cwd() : resolve(process.cwd(), "docs");
const TYPE_TABLE_CACHE_DIRECTORY = resolve(DOCS_DIRECTORY, ".next/cache/fumadocs-typescript");
const TYPE_TABLE_CACHE_COMPATIBILITY_FILES = [
  resolve(DOCS_DIRECTORY, "../bun.lock"),
  resolve(DOCS_DIRECTORY, "tsconfig.json"),
  resolve(DOCS_DIRECTORY, "source.config.ts"),
  resolve(DOCS_DIRECTORY, "components/type-table/generator.ts"),
];
const TYPE_TABLE_CACHE_DEPENDENCY_DIRECTORIES = [
  resolve(DOCS_DIRECTORY, "registry/react"),
  resolve(DOCS_DIRECTORY, "registry/lynx"),
  resolve(DOCS_DIRECTORY, "../packages/css"),
  resolve(DOCS_DIRECTORY, "../packages/react/src"),
  resolve(DOCS_DIRECTORY, "../packages/react-headless"),
  resolve(DOCS_DIRECTORY, "../packages/lynx-react/src"),
  resolve(DOCS_DIRECTORY, "../packages/stackflow/src"),
];
const TYPE_DEPENDENCY_FILE = /\.(?:[cm]?[jt]sx?|json)$/;

function collectTypeDependencyFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) return collectTypeDependencyFiles(path);
    return TYPE_DEPENDENCY_FILE.test(entry.name) ? [path] : [];
  });
}

const TYPE_TABLE_CACHE_DEPENDENCY_FILES = TYPE_TABLE_CACHE_DEPENDENCY_DIRECTORIES.flatMap(
  collectTypeDependencyFiles,
).sort();

export const typeTableCacheCompatibilityHash = generateHash(
  [
    TYPE_TABLE_CACHE_SCHEMA,
    ...[...TYPE_TABLE_CACHE_COMPATIBILITY_FILES, ...TYPE_TABLE_CACHE_DEPENDENCY_FILES].map(
      (file) => `${relative(DOCS_DIRECTORY, file)}\0${readFileSync(file, "utf8")}`,
    ),
  ].join("\0"),
);

export function createCompatibleTypeTableCache(
  directory: string,
  compatibilityHash = typeTableCacheCompatibilityHash,
): Cache {
  const fileSystemCache = createFileSystemGeneratorCache(directory);

  return {
    read(hash) {
      return fileSystemCache.read(`${compatibilityHash}-${hash}`);
    },
    async write(hash, value) {
      try {
        await fileSystemCache.write(`${compatibilityHash}-${hash}`, value);
      } catch {
        // A read-only or unavailable cache must not fail documentation generation.
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
    if (!file.endsWith(".json") || file.startsWith(`${typeTableCacheCompatibilityHash}-`)) continue;
    try {
      unlinkSync(resolve(resolvedDirectory, file));
    } catch {
      // Another Next.js worker may have removed the same stale cache file.
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
