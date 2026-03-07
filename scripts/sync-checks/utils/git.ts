import { $ } from "bun";

/** PR에서 변경된 파일 목록 (base 브랜치 대비) */
export async function getChangedFiles(baseRef: string): Promise<string[]> {
  const mergeBase = await $`git merge-base ${baseRef} HEAD`.text();
  const diff = await $`git diff --name-only ${mergeBase.trim()} HEAD`.text();
  return diff
    .trim()
    .split("\n")
    .filter((line) => line.length > 0);
}

/** base 브랜치 대비 새로 추가된 디렉토리 목록 */
export async function getNewDirectories(baseRef: string): Promise<Set<string>> {
  const mergeBase = await $`git merge-base ${baseRef} HEAD`.text();
  const diff = await $`git diff --name-only --diff-filter=A ${mergeBase.trim()} HEAD`.text();

  const dirs = new Set<string>();
  for (const file of diff.trim().split("\n")) {
    if (file.length === 0) continue;
    const parts = file.split("/");
    // 파일의 부모 디렉토리들을 모두 추가
    for (let i = 1; i < parts.length; i++) {
      dirs.add(parts.slice(0, i).join("/"));
    }
  }
  return dirs;
}
