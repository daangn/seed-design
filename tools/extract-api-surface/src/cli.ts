import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import { extractSurface } from "./extract";
import { renderPackage, renderSurface } from "./render";

const USAGE = `Usage:
  bun extract-api-surface [--root <dir>] [--package <name>]... [--format text|json] [--out-dir <dir>]

공개 API 표면을 출력합니다.

  --root <dir>          추출할 모노레포 루트입니다. 기본값은 현재 디렉터리입니다.
  --package <name>      이 패키지만 추출합니다. 여러 번 줄 수 있습니다.
  --format text|json    출력 형식입니다. 기본값은 text입니다.
  --out-dir <dir>       text 표면을 패키지별 <dir>/<패키지 이름>.txt 파일로 씁니다. 디렉터리는
                        비어 있거나 없어야 합니다. 두 시점을 이렇게 쓰고 git diff --no-index로 비교합니다.`;

/** An error in how the CLI was invoked, reported together with the usage text. */
class UsageError extends Error {}

function run() {
  const { values, positionals } = parseArgs({
    args: Bun.argv.slice(2),
    allowPositionals: true,
    options: {
      root: { type: "string", default: "." },
      package: { type: "string", multiple: true },
      format: { type: "string", default: "text" },
      "out-dir": { type: "string" },
      help: { type: "boolean", short: "h" },
    },
  });

  if (values.help) {
    console.log(USAGE);

    return;
  }

  const [command] = positionals;
  if (command !== undefined) throw new UsageError(`지원하지 않는 명령입니다: ${command}`);
  if (values.format !== "text" && values.format !== "json")
    throw new UsageError(`지원하지 않는 형식입니다: ${values.format}`);

  const outDir = values["out-dir"];
  if (outDir !== undefined && values.format !== "text")
    throw new UsageError("--out-dir는 text 형식만 씁니다.");
  // A file left from an earlier run would diff as a package that still exists.
  if (outDir !== undefined && existsSync(outDir) && readdirSync(outDir).length > 0)
    throw new UsageError(`--out-dir가 비어 있지 않습니다: ${outDir}`);

  const surface = extractSurface(path.resolve(values.root), { packages: values.package });

  if (outDir === undefined) {
    console.log(
      values.format === "json" ? JSON.stringify(surface, null, 2) : renderSurface(surface),
    );

    return;
  }

  for (const pkg of surface) {
    const file = path.join(outDir, `${pkg.name}.txt`);
    mkdirSync(path.dirname(file), { recursive: true });
    writeFileSync(file, renderPackage(pkg));
  }
}

try {
  run();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  const isUsage =
    error instanceof UsageError ||
    (error instanceof Error && "code" in error && String(error.code).startsWith("ERR_PARSE_ARGS"));
  console.error(isUsage ? `${message}\n\n${USAGE}` : message);
  process.exitCode = 1;
}
