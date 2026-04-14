import type { CAC } from "cac";
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { buildGraph } from "@kontext/core";
import pc from "picocolors";

export function buildCommand(cli: CAC) {
  cli
    .command("build", "Build the dependency graph from all kontext.yaml files")
    .option("--root <dir>", "Repository root directory", { default: process.cwd() })
    .action((options: { root: string }) => {
      const rootDir = resolve(options.root);

      console.log(pc.dim("Scanning for kontext.yaml files..."));
      const graph = buildGraph({ rootDir });

      const outDir = resolve(rootDir, ".kontext");
      mkdirSync(outDir, { recursive: true });

      const outPath = resolve(outDir, "graph.json");
      writeFileSync(outPath, JSON.stringify(graph, null, 2));

      console.log(
        `${pc.green("✓")} Graph built: ${pc.bold(String(graph.nodes.length))} nodes, ${pc.bold(String(graph.edges.length))} edges`,
      );
      console.log(`  ${pc.dim("Packages:")} ${graph.packages.join(", ")}`);
      console.log(`  ${pc.dim("Output:")} ${outPath}`);
    });
}
