import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { buildGraph } from "@kontext/core";
import type { KontextGraph } from "@kontext/core";

export interface RootOption {
  root: string;
}

export function loadOrBuildGraph(rootDir: string): KontextGraph {
  const graphPath = resolve(rootDir, ".kontext", "graph.json");
  try {
    const raw = readFileSync(graphPath, "utf-8");
    return JSON.parse(raw) as KontextGraph;
  } catch {
    return buildGraph({ rootDir });
  }
}
