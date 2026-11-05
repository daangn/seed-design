import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import nodePath from "node:path";
import { conditional, object } from "@optique/core/constructs";
import { message } from "@optique/core/message";
import { multiple, optional, withDefault } from "@optique/core/modifiers";
import { argument, option } from "@optique/core/primitives";
import { choice, string, type ValueParser } from "@optique/core/valueparser";
import { run } from "@optique/run";
import { path } from "@optique/run/valueparser";
import { extractSurface } from "./extract";
import { renderPackage, renderSurface } from "./render";

// A file left from an earlier run would diff as a package that still exists.
function emptyDirectory(): ValueParser<"sync", string> {
  const base = path({ metavar: "DIR", type: "directory" });

  return {
    ...base,
    parse(input) {
      const result = base.parse(input);
      if (!result.success || !existsSync(result.value)) return result;

      // `path()` checks `type` only when `mustExist` is set, which a missing directory can't be.
      if (!statSync(result.value).isDirectory())
        return { success: false, error: message`Not a directory: ${input}.` };
      if (readdirSync(result.value).length > 0)
        return { success: false, error: message`Directory is not empty: ${input}.` };

      return result;
    },
  };
}

// The `text` branch and the default branch accept the same options; hiding one copy keeps
// help from listing `--out-dir` twice.
const textOutput = (hidden?: "doc") =>
  object({
    outDir: optional(
      option("--out-dir", emptyDirectory(), {
        description: message`Write each package's text surface to <DIR>/<package name>.txt. The directory must be empty or not exist.`,
        hidden,
      }),
    ),
  });

const noPackages = message`Specify at least one package to extract.`;

// The empty command line fails in `object()` and one with only options fails in `multiple()`.
const parser = object(
  {
    root: withDefault(
      option("--root", path({ metavar: "DIR", type: "directory", mustExist: true }), {
        description: message`Root of the monorepo to extract from.`,
      }),
      ".",
    ),
    output: conditional(
      option("--format", choice(["text", "json"]), {
        description: message`Output format. Defaults to text.`,
      }),
      { text: textOutput("doc"), json: object({}) },
      textOutput(),
    ),
    packages: multiple(argument(string({ metavar: "PACKAGE" })), {
      min: 1,
      errors: { tooFew: noPackages },
    }),
  },
  { errors: { endOfInput: noPackages } },
);

const {
  root,
  output: [format, outputOptions],
  packages,
} = run(parser, {
  programName: "extract-api-surface",
  brief: message`Print the public API surface of the given workspace packages.`,
  help: { option: { names: ["-h", "--help"] } },
  showDefault: true,
  showChoices: true,
});

try {
  const surface = extractSurface(nodePath.resolve(root), packages);

  if (format === "json") console.log(JSON.stringify(surface, null, 2));
  else if (outputOptions.outDir === undefined) console.log(renderSurface(surface));
  else
    for (const pkg of surface) {
      const file = nodePath.join(outputOptions.outDir, `${pkg.name}.txt`);
      mkdirSync(nodePath.dirname(file), { recursive: true });
      writeFileSync(file, renderPackage(pkg));
    }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
