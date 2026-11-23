import { readFileSync } from "node:fs";
import path from "node:path";

type Manifest = {
  name?: string;
  private?: boolean;
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
};

const readJson = (file: string) => JSON.parse(readFileSync(file, "utf8"));

/**
 * `packages/` 아래 공개 패키지 중 `changedFiles`가 속한 패키지와, 그 패키지에 런타임 의존하는 패키지를 디렉터리 이름순으로 고른다.
 * 의존하는 패키지도 함께 게시해야 그 snapshot이 바뀐 패키지의 snapshot을 가리킨다.
 */
export function selectSnapshotPackages(root: string, changedFiles: string[]) {
  const { workspaces = [] }: { workspaces?: string[] } = readJson(path.join(root, "package.json"));
  const packages = workspaces
    .filter((pattern) => pattern.startsWith("packages/"))
    .flatMap((pattern) => [...new Bun.Glob(`${pattern}/package.json`).scanSync({ cwd: root })])
    .map((file) => ({
      dir: path.dirname(file),
      manifest: readJson(path.join(root, file)) as Manifest,
    }))
    .filter(({ manifest }) => manifest.name && !manifest.private);

  const selected = new Set(
    packages
      .filter(({ dir }) => changedFiles.some((file) => file.startsWith(`${dir}/`)))
      .map(({ manifest }) => manifest.name),
  );
  for (let size = 0; size !== selected.size;) {
    size = selected.size;
    for (const { manifest } of packages) {
      const dependencies = {
        ...manifest.dependencies,
        ...manifest.peerDependencies,
        ...manifest.optionalDependencies,
      };
      if (Object.keys(dependencies).some((name) => selected.has(name))) selected.add(manifest.name);
    }
  }

  return packages
    .filter(({ manifest }) => selected.has(manifest.name))
    .map(({ dir }) => dir)
    .sort((a, b) => a.localeCompare(b));
}

if (import.meta.main) {
  const [baseSha, sourceSha] = process.argv.slice(2);
  if (!baseSha || !sourceSha)
    throw new Error("Usage: list-snapshot-packages.ts <base-sha> <source-sha>");
  const changedFiles = (
    await Bun.$`git diff --name-only -z --no-renames ${`${baseSha}...${sourceSha}`}`.text()
  )
    .split("\0")
    .filter(Boolean);
  console.log(selectSnapshotPackages(".", changedFiles).join("\n"));
}
