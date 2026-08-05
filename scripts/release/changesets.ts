import { readFile } from "node:fs/promises";
import { parse } from "yaml";
import { isBumpType } from "./config";
import type { BumpType, ChangesetEntry, LaneName } from "./types";

const frontmatterPattern = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

export async function parseChangesetFile(file: string): Promise<ChangesetEntry> {
  const content = await readFile(file, "utf8");
  const match = content.match(frontmatterPattern);
  if (!match?.[1]) throw new Error(`${file}: Changeset frontmatter를 찾을 수 없습니다.`);

  const frontmatter = parse(match[1]);
  if (typeof frontmatter !== "object" || frontmatter === null || Array.isArray(frontmatter)) {
    throw new Error(`${file}: Changeset release 목록이 객체가 아닙니다.`);
  }

  const releases = Object.entries(frontmatter).map(([name, type]) => {
    if (typeof type !== "string" || !isBumpType(type)) {
      throw new Error(`${file}: ${name}의 bump '${String(type)}'를 지원하지 않습니다.`);
    }
    return { name, type };
  });
  if (releases.length === 0) throw new Error(`${file}: release 항목이 없습니다.`);

  return { file, releases };
}

export interface ChangesetValidation {
  warnings: string[];
  errors: string[];
  entries: ChangesetEntry[];
}

export async function validateChangesets(
  files: string[],
  lane: LaneName,
  expected: BumpType,
): Promise<ChangesetValidation> {
  const changesetFiles = files.filter((file) => {
    const normalized = file.replaceAll("\\", "/");
    return (
      /(^|\/)\.changeset\/[^/]+\.md$/.test(normalized) &&
      !normalized.endsWith("/.changeset/README.md")
    );
  });
  if (changesetFiles.length === 0) {
    return {
      entries: [],
      errors: [],
      warnings: [`${lane} 대상 PR에 changeset이 없습니다.`],
    };
  }

  const entries = await Promise.all(changesetFiles.map(parseChangesetFile));
  const errors = entries.flatMap((entry) =>
    entry.releases
      .filter((release) => release.type !== expected)
      .map(
        (release) =>
          `${entry.file}: ${release.name}은 ${lane} 레인에서 ${expected}여야 하지만 ${release.type}입니다.`,
      ),
  );

  return { entries, errors, warnings: [] };
}
