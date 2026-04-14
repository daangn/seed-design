import type { CAC } from "cac";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { buildGraph, findDeps } from "@kontext/core";
import type { KontextGraph } from "@kontext/core";
import { renderDepsJson, renderDepsTree } from "../utils/render.js";

export function depsCommand(cli: CAC) {
  cli
    .command("deps <file>", "Show all files affected by changes to <file>")
    .option("--root <dir>", "Repository root directory", { default: process.cwd() })
    .option("--json", "Output as JSON")
    .action((file: string, options: { root: string; json?: boolean }) => {
      const rootDir = resolve(options.root);
      const graph = loadOrBuildGraph(rootDir);

      // 상대 경로로 변환
      const relFile = resolve(file).startsWith(rootDir)
        ? resolve(file).slice(rootDir.length + 1)
        : file;

      const deps = findDeps(graph, relFile);

      if (deps.length === 0) {
        console.log(`No relations found for ${relFile}`);
        console.log("Tip: Make sure the file matches a 'when' pattern in a kontext.yaml");
        return;
      }

      if (options.json) {
        console.log(renderDepsJson(deps));
      } else {
        console.log(renderDepsTree(relFile, deps));
      }
    });
}

function loadOrBuildGraph(rootDir: string): KontextGraph {
  const graphPath = resolve(rootDir, ".kontext", "graph.json");
  try {
    const raw = readFileSync(graphPath, "utf-8");
    return JSON.parse(raw) as KontextGraph;
  } catch {
    // 캐시가 없으면 즉시 빌드
    return buildGraph({ rootDir });
  }
}
