import { execFile } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const gitTimestampsCache = new Map<string, Promise<Map<string, Date>>>();

/** 문서 디렉터리의 Git 이력을 한 번 읽어 파일별 마지막 수정일을 조회합니다. */
export async function getMarkdownPageLastModified(
  filePath: string | undefined,
): Promise<Date | undefined> {
  if (!filePath) return undefined;

  const contentDir = findContentDirectory(filePath);
  const timestamps = await getGitTimestamps(contentDir);
  return timestamps.get(path.resolve(filePath));
}

function findContentDirectory(filePath: string): string {
  let current = path.dirname(path.resolve(filePath));

  while (path.dirname(current) !== current) {
    if (path.basename(current) === "content") return current;
    current = path.dirname(current);
  }

  return path.dirname(path.resolve(filePath));
}

function getGitTimestamps(contentDir: string): Promise<Map<string, Date>> {
  const cached = gitTimestampsCache.get(contentDir);
  if (cached) return cached;

  const pending = loadGitTimestamps(contentDir);
  gitTimestampsCache.set(contentDir, pending);
  return pending;
}

async function loadGitTimestamps(contentDir: string): Promise<Map<string, Date>> {
  const timestamps = new Map<string, Date>();

  try {
    const { stdout } = await execFileAsync(
      "git",
      [
        "-c",
        "core.quotepath=off",
        "log",
        "--format=commit:%aI",
        "--relative",
        "--name-only",
        "--",
        ".",
      ],
      { cwd: contentDir, maxBuffer: 64 * 1024 * 1024 },
    );

    let modifiedAt: Date | undefined;
    for (const line of stdout.split("\n")) {
      if (line.startsWith("commit:")) {
        const parsed = new Date(line.slice("commit:".length));
        modifiedAt = Number.isNaN(parsed.getTime()) ? undefined : parsed;
        continue;
      }

      if (!line || !modifiedAt) continue;
      const absolutePath = path.resolve(contentDir, line);
      if (!timestamps.has(absolutePath)) timestamps.set(absolutePath, modifiedAt);
    }
  } catch {
    // Git 메타데이터가 없는 배포 환경에서는 수정일을 표시하지 않습니다.
  }

  return timestamps;
}
