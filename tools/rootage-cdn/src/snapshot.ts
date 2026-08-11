import { readFile, writeFile } from "node:fs/promises";

const SHA_PATTERN = /^[0-9a-f]{40}$/;
const PR_NUMBER_PATTERN = /^[1-9]\d*$/;

export const SNAPSHOT_VERSION_PATTERN = /^0\.0\.0-snapshot\.pr-([1-9]\d*)\.sha-([0-9a-f]{40})$/;

export function createRootageSnapshotVersion(prNumber: string, sourceSha: string): string {
  if (!PR_NUMBER_PATTERN.test(prNumber)) {
    throw new Error("Rootage snapshot PR 번호는 1 이상의 정수여야 합니다.");
  }
  if (!SHA_PATTERN.test(sourceSha)) {
    throw new Error("Rootage snapshot source SHA는 40자리 소문자 Git SHA여야 합니다.");
  }
  return `0.0.0-snapshot.pr-${prNumber}.sha-${sourceSha}`;
}

export function parseRootageSnapshotVersion(
  version: string,
): { prNumber: number; sourceSha: string } | null {
  const match = SNAPSHOT_VERSION_PATTERN.exec(version);
  if (!match) return null;
  return { prNumber: Number(match[1]), sourceSha: match[2]! };
}

export function hasRootageChanges(paths: Iterable<string>): boolean {
  return [...paths].some((path) => !path.includes("\\") && path.startsWith("packages/rootage/"));
}

interface PackageManifest {
  name?: unknown;
  version?: unknown;
  [key: string]: unknown;
}

export async function writeRootageSnapshotVersion(
  packageJsonPath: string,
  version: string,
): Promise<void> {
  if (!SNAPSHOT_VERSION_PATTERN.test(version)) {
    throw new Error("Rootage snapshot 버전 형식이 올바르지 않습니다.");
  }
  const manifest = JSON.parse(await readFile(packageJsonPath, "utf8")) as PackageManifest;
  if (manifest.name !== "@seed-design/rootage-artifacts") {
    throw new Error("Rootage snapshot package 이름이 올바르지 않습니다.");
  }
  if (typeof manifest.version !== "string") {
    throw new Error("Rootage snapshot package 버전이 문자열이 아닙니다.");
  }
  await writeFile(packageJsonPath, `${JSON.stringify({ ...manifest, version }, null, 2)}\n`);
}
