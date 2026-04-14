import type { CAC } from "cac";
import { resolve, relative, isAbsolute } from "node:path";
import { findDeps } from "@kontext/core";
import { renderDepsJson, renderDepsTree } from "../utils/render.js";
import type { RootOption } from "../utils/graph.js";
import { loadOrBuildGraph } from "../utils/graph.js";

export function depsCommand(cli: CAC) {
  cli
    .command("deps <file>", "Show all files affected by changes to <file>")
    .option("--root <dir>", "Repository root directory", { default: process.cwd() })
    .option("--json", "Output as JSON")
    .action((file: string, options: RootOption & { json?: boolean }) => {
      const rootDir = resolve(options.root);
      const graph = loadOrBuildGraph(rootDir);

      const absFile = isAbsolute(file) ? file : resolve(rootDir, file);
      const relFile = relative(rootDir, absFile);

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
