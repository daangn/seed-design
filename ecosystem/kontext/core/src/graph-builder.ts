import { existsSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { minimatch } from "minimatch";
import { parseKontextFile } from "./parser.js";
import { expandTemplate, hasTemplate, toKebabCase } from "./resolver.js";
import type { AffectedEntry, GraphEdge, GraphNode, KontextGraph } from "./types.js";

export interface BuildOptions {
  rootDir: string;
}

export function buildGraph(options: BuildOptions): KontextGraph {
  const { rootDir } = options;
  const kontextFiles = findKontextFiles(rootDir);
  const nodes = new Map<string, GraphNode>();
  const edges: GraphEdge[] = [];
  const packages: string[] = [];

  for (const kontextPath of kontextFiles) {
    const packageDir = dirname(kontextPath);
    const relPackageDir = relativeFromRoot(rootDir, packageDir);
    const relKontextPath = relativeFromRoot(rootDir, kontextPath);
    packages.push(relPackageDir);

    const config = parseKontextFile(kontextPath);
    const ignorePatterns = config.ignore ?? [];

    for (const relation of config.relations) {
      let watchedFiles = resolveWatchPattern(packageDir, relation.when);

      // ignore 필터
      if (ignorePatterns.length > 0) {
        watchedFiles = watchedFiles.filter((f) => {
          const rel = f.slice(packageDir.length + 1);
          return !ignorePatterns.some((p) => minimatch(rel, p));
        });
      }

      // exclude 필터
      if (relation.exclude?.length) {
        const excludes = relation.exclude;
        watchedFiles = watchedFiles.filter((f) => {
          const rel = f.slice(packageDir.length + 1);
          return !excludes.some((p) => minimatch(rel, p));
        });
      }

      for (const watchedFile of watchedFiles) {
        const relWatched = relativeFromRoot(rootDir, watchedFile);
        const relInPackage = watchedFile.slice(packageDir.length + 1);
        ensureNode(nodes, relWatched, relPackageDir, rootDir);

        // override 매칭: 이 파일에 해당하는 override가 있으면 그걸 사용
        let affectsToUse = relation.affects;
        if (relation.overrides?.length) {
          for (const override of relation.overrides) {
            if (minimatch(relInPackage, override.match)) {
              affectsToUse = override.affects;
              break;
            }
          }
        }

        const id = extractIdFromWatched(watchedFile);

        for (const entry of affectsToUse) {
          addEdgesForEntry(rootDir, nodes, edges, relWatched, entry, id, relKontextPath);
        }
      }
    }
  }

  return {
    nodes: Array.from(nodes.values()),
    edges,
    packages,
    builtAt: new Date().toISOString(),
  };
}

function addEdgesForEntry(
  rootDir: string,
  nodes: Map<string, GraphNode>,
  edges: GraphEdge[],
  source: string,
  entry: AffectedEntry,
  id: string | null,
  definedBy: string,
) {
  const pushEdge = (target: string) => {
    ensureNode(nodes, target, resolvePackageDir(target), rootDir);
    edges.push({
      source,
      target,
      reason: entry.reason,
      generated: entry.generated ?? false,
      command: entry.command,
      optional: entry.optional ?? false,
      definedBy,
    });
  };

  if (hasTemplate(entry.path) && id) {
    const expanded = expandTemplate(entry.path, id);
    const resolved = resolveGlobOrLiteral(rootDir, expanded);

    if (resolved.length > 0) {
      for (const rp of resolved) pushEdge(rp);
    } else {
      pushEdge(expanded);
    }
  } else {
    const resolved = resolveGlobOrLiteral(rootDir, entry.path);

    if (resolved.length > 0) {
      for (const rp of resolved) pushEdge(rp);
    } else {
      pushEdge(entry.path);
    }
  }
}

// --- 유틸리티 ---

function findKontextFiles(rootDir: string): string[] {
  const results: string[] = [];
  const queue = [rootDir];

  while (queue.length > 0) {
    const dir = queue.pop()!;
    const base = dir.split("/").pop() ?? "";
    if (["node_modules", ".git", "dist", "lib", "bin", ".kontext"].includes(base)) continue;

    try {
      const entries = readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) {
          queue.push(full);
        } else if (entry.name === "kontext.yaml") {
          results.push(full);
        }
      }
    } catch {
      // ignore
    }
  }

  return results;
}

function resolveWatchPattern(packageDir: string, pattern: string): string[] {
  const results: string[] = [];

  function walk(dir: string) {
    try {
      const entries = readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) {
          if (!["node_modules", ".git", "dist", "lib"].includes(entry.name)) {
            walk(full);
          }
        } else {
          const rel = full.slice(packageDir.length + 1);
          if (minimatch(rel, pattern)) {
            results.push(full);
          }
        }
      }
    } catch {
      // ignore
    }
  }

  walk(packageDir);
  return results;
}

function resolveGlobOrLiteral(rootDir: string, path: string): string[] {
  const absPath = resolve(rootDir, path);

  if (path.endsWith("/")) {
    return existsSync(absPath) ? [path] : [];
  }

  if (path.includes("*")) {
    const dir = resolve(rootDir, dirname(path));
    if (!existsSync(dir)) return [];

    const results: string[] = [];
    const pattern = path.split("/").pop() ?? "";
    try {
      for (const entry of readdirSync(dir)) {
        if (minimatch(entry, pattern)) {
          results.push(relativeFromRoot(rootDir, join(dir, entry)));
        }
      }
    } catch {
      // ignore
    }
    return results;
  }

  return existsSync(absPath) ? [path] : [];
}

function extractIdFromWatched(filePath: string): string | null {
  const name = filePath.split("/").pop() ?? "";
  const dotIdx = name.lastIndexOf(".");
  const base = dotIdx >= 0 ? name.slice(0, dotIdx) : name;
  if (!base || base === "index") return null;
  return toKebabCase(base);
}

function ensureNode(
  nodes: Map<string, GraphNode>,
  path: string,
  packageDir: string,
  rootDir: string,
) {
  if (!nodes.has(path)) {
    nodes.set(path, {
      id: path,
      packageDir,
      exists: existsSync(resolve(rootDir, path)),
    });
  }
}

function resolvePackageDir(relPath: string): string {
  const parts = relPath.split("/");
  if (["packages", "ecosystem", "docs", "tools"].includes(parts[0] ?? "")) {
    return parts.slice(0, 2).join("/");
  }
  return parts[0] ?? "";
}

function relativeFromRoot(rootDir: string, absPath: string): string {
  if (absPath.startsWith(rootDir)) {
    const rel = absPath.slice(rootDir.length);
    return rel.startsWith("/") ? rel.slice(1) : rel;
  }
  return absPath;
}
