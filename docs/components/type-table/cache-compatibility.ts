import { createHash } from "node:crypto";
import { type Dirent, readdirSync, readFileSync } from "node:fs";
import { basename, relative, resolve } from "node:path";

const TYPE_TABLE_CACHE_SCHEMA = "seed-filtered-type-table-v2";
const DOCS_DIRECTORY =
  basename(process.cwd()) === "docs" ? process.cwd() : resolve(process.cwd(), "docs");

// generator 설정과 전이 타입 의존성이 바뀐 결과까지 재사용하지 않도록 호환성 해시에 넣는다.
const TYPE_TABLE_CACHE_COMPATIBILITY_FILES = [
  resolve(DOCS_DIRECTORY, "../bun.lock"),
  resolve(DOCS_DIRECTORY, "package.json"),
  resolve(DOCS_DIRECTORY, "tsconfig.json"),
  resolve(DOCS_DIRECTORY, "app/source.tsx"),
  resolve(DOCS_DIRECTORY, "components/type-table/cache-compatibility.ts"),
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
const TYPE_DEPENDENCY_SKIP_DIRECTORIES = new Set([
  ".cache",
  ".next",
  ".turbo",
  "build",
  "coverage",
  "dist",
  "lib",
  "node_modules",
]);
const TYPE_DEPENDENCY_SKIP_FILES = new Set([".ultra.cache.json"]);

export function collectTypeDependencyFiles(directory: string): string[] {
  let entries: Dirent[];
  try {
    entries = readdirSync(directory, { withFileTypes: true });
  } catch {
    // 선택한 package가 이동하거나 제거되어도 문서 설정 모듈 자체는 계속 로드한다.
    return [];
  }

  return entries.flatMap((entry) => {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      return TYPE_DEPENDENCY_SKIP_DIRECTORIES.has(entry.name)
        ? []
        : collectTypeDependencyFiles(path);
    }
    if (TYPE_DEPENDENCY_SKIP_FILES.has(entry.name)) return [];
    return TYPE_DEPENDENCY_FILE.test(entry.name) ? [path] : [];
  });
}

const TYPE_TABLE_CACHE_DEPENDENCY_FILES = TYPE_TABLE_CACHE_DEPENDENCY_DIRECTORIES.flatMap(
  collectTypeDependencyFiles,
).sort();

export const typeTableCacheCompatibilityHash = createHash("sha256")
  .update(
    [
      TYPE_TABLE_CACHE_SCHEMA,
      ...[...TYPE_TABLE_CACHE_COMPATIBILITY_FILES, ...TYPE_TABLE_CACHE_DEPENDENCY_FILES].map(
        // 경로도 함께 hash해 파일 이동이나 이름 변경을 내용이 같은 경우에도 무효화한다.
        (file) => `${relative(DOCS_DIRECTORY, file)}\0${readFileSync(file, "utf8")}`,
      ),
    ].join("\0"),
  )
  .digest("hex");
