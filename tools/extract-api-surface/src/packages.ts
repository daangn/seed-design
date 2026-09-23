import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

export interface PackageManifest {
  name?: string;
  private?: boolean;
  exports?: unknown;
  types?: string;
  typings?: string;
  main?: string;
  bin?: string | Record<string, string>;
  workspaces?: string[];
}

export interface PublicPackage {
  name: string;
  /** Absolute path to the package directory. */
  dir: string;
  manifest: PackageManifest;
}

export type Entrypoint =
  /** `file` is the absolute path of the source (or committed declaration) file. */
  | { kind: "types"; subpath: string; file: string }
  /** `targets` are the export-map targets relative to the package, expanded when wildcarded. */
  | { kind: "asset"; subpath: string; targets: string[] }
  | { kind: "unresolved"; subpath: string; target: string };

const BUILD_DIRS = ["lib", "dist"];
const SOURCE_EXTENSIONS = [".ts", ".tsx"];

export function readManifest(file: string): PackageManifest {
  return JSON.parse(readFileSync(file, "utf8"));
}

export function findPublicPackages(root: string) {
  const { workspaces = [] } = readManifest(path.join(root, "package.json"));

  return workspaces
    .flatMap((pattern) => [...new Bun.Glob(`${pattern}/package.json`).scanSync({ cwd: root })])
    .map((manifestPath) => {
      const manifest = readManifest(path.join(root, manifestPath));

      return {
        name: manifest.name ?? "",
        dir: path.join(root, path.dirname(manifestPath)),
        manifest,
      };
    })
    .filter((pkg): pkg is PublicPackage => !pkg.manifest.private && pkg.name !== "")
    .sort((a, b) => a.name.localeCompare(b.name));
}

export const binNames = (manifest: PackageManifest) =>
  typeof manifest.bin === "string"
    ? [manifest.name ?? ""]
    : Object.keys(manifest.bin ?? {}).sort((a, b) => a.localeCompare(b));

/**
 * Lists every subpath a consumer can import, resolved to the file that declares its types.
 * Declarations under a build directory are mapped back to `src/`, so the surface can be read
 * without building.
 */
export function resolveEntrypoints(pkg: PublicPackage, glob = globFiles): Entrypoint[] {
  const { exports, types, typings, main } = pkg.manifest;

  const exportMap: Record<string, unknown> =
    exports === undefined
      ? { ".": types ?? typings ?? main }
      : typeof exports === "string" ||
          !Object.keys(exports as object).some((key) => key.startsWith("."))
        ? { ".": exports }
        : (exports as Record<string, unknown>);

  return Object.entries(exportMap)
    .filter(
      ([subpath, value]) => subpath !== "./package.json" && value !== undefined && value !== null,
    )
    .flatMap(([subpath, value]) => resolveEntry(pkg.dir, subpath, value, glob))
    .sort((a, b) => a.subpath.localeCompare(b.subpath));
}

function resolveEntry(
  dir: string,
  subpath: string,
  value: unknown,
  glob: (dir: string, pattern: string) => string[],
): Entrypoint[] {
  const target = findCondition(value, "types") ?? firstTarget(value);
  if (!target) return [{ kind: "unresolved", subpath, target: JSON.stringify(value) }];

  if (!target.endsWith(".d.ts")) {
    const targets = target.includes("*") ? glob(dir, target) : [];

    return [{ kind: "asset", subpath, targets: targets.length > 0 ? targets : [target] }];
  }

  if (!subpath.includes("*")) {
    const file = sourceCandidates(target).find((candidate) =>
      existsSync(path.join(dir, candidate)),
    );

    return [
      file
        ? { kind: "types", subpath, file: path.join(dir, file) }
        : { kind: "unresolved", subpath, target },
    ];
  }

  const expanded = sourceCandidates(target).flatMap((candidate) =>
    glob(dir, candidate).map((file) => ({
      subpath: subpath.replace("*", captureWildcard(candidate, file)),
      file: path.join(dir, file),
    })),
  );
  if (expanded.length === 0) return [{ kind: "unresolved", subpath, target }];

  return [...new Map(expanded.map((entry) => [entry.subpath, entry])).values()].map((entry) => ({
    kind: "types",
    ...entry,
  }));
}

export function findCondition(value: unknown, condition: string): string | undefined {
  if (!value || typeof value !== "object") return;

  for (const [key, nested] of Object.entries(value)) {
    if (key === condition && typeof nested === "string") return nested;

    const found = findCondition(nested, condition);
    if (found) return found;
  }
}

function firstTarget(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return;

  for (const nested of Object.values(value)) {
    const found = firstTarget(nested);
    if (found) return found;
  }
}

/** `./lib/a/index.d.ts` → `src/a/index.ts`, …; a declaration outside build dirs is used as is. */
export function sourceCandidates(typesPath: string) {
  const relative = typesPath.replace(/^\.\//, "");
  const [head, ...rest] = relative.split("/");
  if (!head || !BUILD_DIRS.includes(head)) return [relative];

  const stem = ["src", ...rest].join("/").replace(/\.d\.ts$/, "");

  return [
    ...SOURCE_EXTENSIONS.map((extension) => `${stem}${extension}`),
    ...SOURCE_EXTENSIONS.map((extension) => `${stem}/index${extension}`),
  ];
}

function captureWildcard(pattern: string, file: string) {
  const [prefix = "", suffix = ""] = pattern.split("*");

  return file.slice(prefix.length, file.length - suffix.length);
}

function globFiles(dir: string, pattern: string) {
  const relative = pattern.replace(/^\.\//, "");

  return [...new Bun.Glob(relative).scanSync({ cwd: dir })]
    .filter((file) => !file.split("/").includes("node_modules"))
    .sort((a, b) => a.localeCompare(b));
}
