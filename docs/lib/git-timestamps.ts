import { readdir } from "node:fs/promises";
import path from "node:path";
import { type Commit, type Repository, RevwalkSort, openRepository } from "es-git";

const globalGitTimestamps = globalThis as typeof globalThis & {
  __seedDesignGitTimestampsCache?: Map<string, Promise<Map<string, Date>>>;
};
const gitTimestampsCache =
  globalGitTimestamps.__seedDesignGitTimestampsCache ??
  new Map<string, Promise<Map<string, Date>>>();
globalGitTimestamps.__seedDesignGitTimestampsCache = gitTimestampsCache;

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
    const repository = await openRepository(contentDir);
    const repositoryRoot = repository.workdir();
    if (!repositoryRoot) return timestamps;

    const contentPath = toGitPath(path.relative(repositoryRoot, contentDir));
    const targetPaths = new Set(
      (await readdir(contentDir, { recursive: true }))
        .filter((filePath) => filePath.endsWith(".md") || filePath.endsWith(".mdx"))
        .map((filePath) => toGitPath(path.join(contentPath, filePath))),
    );
    const revwalk = repository.revwalk().setSorting(RevwalkSort.Time).pushHead();

    for (let commitId = revwalk.next(); commitId; commitId = revwalk.next()) {
      const commit = repository.getCommit(commitId);
      const changedPaths = getChangedPaths(repository, commit, contentPath, targetPaths);
      const modifiedAt = new Date(commit.author().timestamp * 1000);

      for (const changedPath of changedPaths) {
        const absolutePath = path.resolve(repositoryRoot, changedPath);
        if (!timestamps.has(absolutePath)) timestamps.set(absolutePath, modifiedAt);
      }

      if (timestamps.size === targetPaths.size) break;
    }
  } catch {
    // Git 메타데이터가 없는 배포 환경에서는 수정일을 표시하지 않습니다.
  }

  return timestamps;
}

function getChangedPaths(
  repository: Repository,
  commit: Commit,
  contentPath: string,
  targetPaths: ReadonlySet<string>,
): Set<string> {
  const parentCommits = getParentCommits(repository, commit.id());
  const parentTrees =
    parentCommits.length > 0 ? parentCommits.map((parent) => parent.tree()) : [null];
  let changedInEveryParent: Set<string> | undefined;

  for (const parentTree of parentTrees) {
    const diff = repository.diffTreeToTree(parentTree, commit.tree(), {
      pathspecs: [contentPath],
      skipBinaryCheck: true,
    });
    const changedPaths = new Set<string>();

    for (const delta of diff.deltas()) {
      const oldPath = delta.oldFile().path();
      const newPath = delta.newFile().path();
      if (oldPath && targetPaths.has(oldPath)) changedPaths.add(oldPath);
      if (newPath && targetPaths.has(newPath)) changedPaths.add(newPath);
    }

    if (!changedInEveryParent) {
      changedInEveryParent = changedPaths;
    } else {
      changedInEveryParent = new Set(
        [...changedInEveryParent].filter((changedPath) => changedPaths.has(changedPath)),
      );
    }

    if (changedInEveryParent.size === 0) break;
  }

  return changedInEveryParent ?? new Set();
}

function getParentCommits(repository: Repository, commitId: string): Commit[] {
  const parents: Commit[] = [];

  for (let parentIndex = 1; ; parentIndex++) {
    try {
      parents.push(repository.getCommit(repository.revparseSingle(`${commitId}^${parentIndex}`)));
    } catch {
      return parents;
    }
  }
}

function toGitPath(filePath: string): string {
  return filePath.split(path.sep).join("/");
}
