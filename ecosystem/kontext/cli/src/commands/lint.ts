import type { CAC } from "cac";
import { resolve } from "node:path";
import { lint } from "@kontext/core";
import pc from "picocolors";
import { renderLintResults } from "../utils/render.js";

export function lintCommand(cli: CAC) {
  cli
    .command(
      "lint",
      "Discover undeclared relationships from git history, naming patterns, and imports",
    )
    .option("--root <dir>", "Repository root directory", { default: process.cwd() })
    .option("--commits <n>", "Number of commits to analyze", { default: 200 })
    .option("--threshold <n>", "Jaccard similarity threshold", { default: 0.7 })
    .option("--min-co <n>", "Minimum co-occurrences", { default: 3 })
    .option("--json", "Output as JSON")
    .option("--fix", "Auto-apply suggestions to kontext.yaml files")
    .action(
      (options: {
        root: string;
        commits: number;
        threshold: number;
        minCo: number;
        json?: boolean;
        fix?: boolean;
      }) => {
        const rootDir = resolve(options.root);

        if (!options.json) {
          console.log(pc.dim("Analyzing repository..."));
        }

        const result = lint({
          rootDir,
          commitCount: options.commits,
          jaccardThreshold: options.threshold,
          minCoOccurrences: options.minCo,
        });

        if (options.json) {
          console.log(JSON.stringify(result, null, 2));
          return;
        }

        console.log(renderLintResults(result));

        if (result.suggestions.length > 0 && !options.fix) {
          console.log("");
          console.log(pc.dim("Apply suggestions with: kontext lint --fix"));
        }

        if (options.fix && result.suggestions.length > 0) {
          console.log("");
          console.log(pc.yellow("--fix is not yet implemented. Coming soon."));
        }
      },
    );
}
