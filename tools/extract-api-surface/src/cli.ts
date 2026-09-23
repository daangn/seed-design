import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
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
      if (!result.success) return result;

      if (existsSync(result.value) && readdirSync(result.value).length > 0)
        return { success: false, error: message`비어 있지 않은 디렉터리입니다: ${input}` };

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
        description: message`text 표면을 패키지별 <DIR>/<패키지 이름>.txt 파일로 씁니다. 두 시점을 이렇게 쓰고 git diff --no-index로 비교합니다.`,
        hidden,
      }),
    ),
  });

const noPackages = message`추출할 패키지를 하나 이상 지정해 주세요.`;

// The empty command line fails in `object()` and one with only options fails in `multiple()`.
const parser = object(
  {
    root: withDefault(
      option("--root", path({ metavar: "DIR", type: "directory", mustExist: true }), {
        description: message`추출할 모노레포 루트입니다.`,
      }),
      ".",
    ),
    output: conditional(
      option("--format", choice(["text", "json"]), {
        description: message`출력 형식입니다. 기본값은 text입니다.`,
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
  brief: message`지정한 workspace 패키지의 공개 API 표면을 출력합니다.`,
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
