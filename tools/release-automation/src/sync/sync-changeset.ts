import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { BumpType } from "../core/types";

const frontmatterPattern = /^(---\r?\n)([\s\S]*?)(\r?\n---(?:\r?\n|$))/;
const releaseLinePattern =
  /^(\s*(?:"(?:[^"\\]|\\.)*"|'[^']*'|[^#:\r\n][^:\r\n]*)\s*:\s*)(patch|minor|major)(\s*(?:#.*)?)$/;

export function normalizeChangesetBumps(content: string, targetBump: BumpType): string {
  const match = content.match(frontmatterPattern);
  if (!match?.[1] || match[2] === undefined || !match[3]) {
    throw new Error("Changeset frontmatter를 찾을 수 없습니다.");
  }

  let normalizedCount = 0;
  const normalizedFrontmatter = match[2]
    .split(/(?<=\n)/)
    .map((line) => {
      const lineEnding = line.endsWith("\r\n") ? "\r\n" : line.endsWith("\n") ? "\n" : "";
      const source = lineEnding ? line.slice(0, -lineEnding.length) : line;
      if (!source.trim() || source.trimStart().startsWith("#")) return line;
      const release = source.match(releaseLinePattern);
      if (!release?.[1] || release[3] === undefined) {
        throw new Error("Changeset frontmatter가 지원하는 line mapping 형식이 아닙니다.");
      }
      normalizedCount += 1;
      return `${release[1]}${targetBump}${release[3]}${lineEnding}`;
    })
    .join("");
  if (normalizedCount === 0) throw new Error("Changeset release 항목이 없습니다.");

  return `${match[1]}${normalizedFrontmatter}${match[3]}${content.slice(match[0].length)}`;
}

export async function normalizeChangesetsInDirectory(
  repositoryPath: string,
  targetBump: BumpType,
): Promise<string[]> {
  const files = Array.from(
    new Bun.Glob(".changeset/*.md").scanSync({
      cwd: repositoryPath,
      onlyFiles: true,
      dot: true,
    }),
  )
    .filter((file) => !file.endsWith("/.changeset/README.md") && file !== ".changeset/README.md")
    .sort();
  const changed: string[] = [];
  for (const file of files) {
    const path = join(repositoryPath, file);
    const content = await readFile(path, "utf8");
    const normalized = normalizeChangesetBumps(content, targetBump);
    if (normalized === content) continue;
    await writeFile(path, normalized);
    changed.push(file);
  }
  return changed;
}
