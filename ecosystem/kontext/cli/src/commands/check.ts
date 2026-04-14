import type { CAC } from "cac";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { buildGraph, checkCompleteness } from "@kontext/core";
import type { KontextGraph } from "@kontext/core";
import pc from "picocolors";
import { renderCheckResults } from "../utils/render.js";

export function checkCommand(cli: CAC) {
  cli
    .command("check", "Verify all affected paths exist")
    .option("--root <dir>", "Repository root directory", { default: process.cwd() })
    .option("--ci", "Exit with code 1 if any files are missing")
    .action((options: { root: string; ci?: boolean }) => {
      const rootDir = resolve(options.root);
      const graph = loadOrBuildGraph(rootDir);
      const results = checkCompleteness(graph);

      const hasMissing = results.some((r) => r.missing.length > 0);

      console.log(renderCheckResults(results));

      if (hasMissing) {
        console.log("");
        console.log(pc.yellow("Some affected files are missing."));
        if (options.ci) {
          process.exit(1);
        }
      } else {
        console.log("");
        console.log(pc.green("All affected files exist."));
      }
    });
}

function loadOrBuildGraph(rootDir: string): KontextGraph {
  const graphPath = resolve(rootDir, ".kontext", "graph.json");
  try {
    const raw = readFileSync(graphPath, "utf-8");
    return JSON.parse(raw) as KontextGraph;
  } catch {
    return buildGraph({ rootDir });
  }
}
