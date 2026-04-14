import type { CAC } from "cac";
import { resolve } from "node:path";
import { checkCompleteness } from "@kontext/core";
import pc from "picocolors";
import { renderCheckResults } from "../utils/render.js";
import type { RootOption } from "../utils/graph.js";
import { loadOrBuildGraph } from "../utils/graph.js";

export function checkCommand(cli: CAC) {
  cli
    .command("check", "Verify all affected paths exist")
    .option("--root <dir>", "Repository root directory", { default: process.cwd() })
    .option("--ci", "Exit with code 1 if any files are missing")
    .action((options: RootOption & { ci?: boolean }) => {
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
