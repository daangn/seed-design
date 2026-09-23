import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import { buildComment } from "./comment";
import { diffSurfaces } from "./diff";
import { extractSurface, type PackageSurface } from "./extract";
import { renderSurface } from "./render";

const USAGE = `Usage:
  bun extract-api-surface [--root <dir>] [--package <name>]... [--format text|json]
  bun extract-api-surface compare <base.json> <head.json> [--base-label <label>] [--comment <file>]

공개 API 표면을 출력하거나(extract), --format json으로 저장한 두 표면을 비교합니다(compare).

  --root <dir>          추출할 모노레포 루트입니다. 기본값은 현재 디렉터리입니다.
  --package <name>      이 패키지만 추출합니다. 여러 번 줄 수 있습니다.
  --format text|json    출력 형식입니다. 기본값은 text입니다.
  --base-label <label>  코멘트에 표시할 base 이름입니다. 기본값은 base 파일 경로입니다.
  --comment <file>      PR 코멘트 본문을 파일로 씁니다. 변화가 없으면 빈 파일을 씁니다.

종료 코드: 0은 변화 없음, 1은 compare에서 변화 있음, 2는 오류입니다.`;

function run() {
  const { values, positionals } = parseArgs({
    args: Bun.argv.slice(2),
    allowPositionals: true,
    options: {
      root: { type: "string", default: "." },
      package: { type: "string", multiple: true },
      format: { type: "string", default: "text" },
      "base-label": { type: "string" },
      comment: { type: "string" },
      help: { type: "boolean", short: "h" },
    },
  });
  const [command, ...files] = positionals;

  if (values.help) {
    console.log(USAGE);

    return 0;
  }

  if (command === "compare") {
    const [basePath, headPath] = files;
    if (!basePath || !headPath) throw new Error("compare에는 두 표면 파일이 필요합니다.");

    const read = (file: string): PackageSurface[] => JSON.parse(readFileSync(file, "utf8"));
    const diffs = diffSurfaces(read(basePath), read(headPath));

    console.log(
      diffs.length === 0
        ? "공개 API 표면에 변화가 없습니다."
        : diffs
            .map((diff) => `# ${diff.name} (+${diff.added} -${diff.removed})\n${diff.patch}\n`)
            .join("\n"),
    );

    if (values.comment) {
      const body = buildComment(diffs, { baseLabel: values["base-label"] ?? basePath });
      writeFileSync(values.comment, body ?? "");
    }

    return diffs.length === 0 ? 0 : 1;
  }

  if (command !== undefined) throw new Error(`지원하지 않는 명령입니다: ${command}`);
  if (values.format !== "text" && values.format !== "json")
    throw new Error(`지원하지 않는 형식입니다: ${values.format}`);

  const surface = extractSurface(path.resolve(values.root), { packages: values.package });
  console.log(values.format === "json" ? JSON.stringify(surface, null, 2) : renderSurface(surface));

  return 0;
}

// Like `diff`: 1 means the surfaces differ, so failures must not exit with 1 as well.
try {
  process.exitCode = run();
} catch (error) {
  console.error(`${error instanceof Error ? error.message : String(error)}\n\n${USAGE}`);
  process.exitCode = 2;
}
