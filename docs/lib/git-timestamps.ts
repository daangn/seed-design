import { mkdir, readFile, readdir, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { type Commit, type Repository, RevwalkSort, openRepository } from "es-git";

const manifestVersion = 1;
const defaultManifestPath = path.resolve(process.cwd(), ".cache/git-timestamps.json");

interface GitTimestampsManifest {
  version: typeof manifestVersion;
  timestamps: Record<string, number>;
}

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

  const pending = loadPreparedGitTimestamps(contentDir);
  gitTimestampsCache.set(contentDir, pending);
  return pending;
}

async function loadPreparedGitTimestamps(contentDir: string): Promise<Map<string, Date>> {
  if (process.env.SEED_USE_GIT_TIMESTAMPS_MANIFEST !== "1") {
    return loadGitTimestamps(contentDir);
  }

  try {
    return deserializeGitTimestampsManifest(
      await readFile(defaultManifestPath, "utf8"),
      contentDir,
    );
  } catch {
    return loadGitTimestamps(contentDir);
  }
}

/** Next 워커가 공유할 문서 수정일 매니페스트를 빌드 전에 한 번 생성합니다. */
export async function prepareMarkdownGitTimestampsManifest(
  contentDir: string,
  manifestPath = defaultManifestPath,
): Promise<number> {
  const resolvedContentDir = path.resolve(contentDir);
  const timestamps = await loadGitTimestamps(resolvedContentDir);
  const output = serializeGitTimestampsManifest(timestamps, resolvedContentDir);
  const temporaryPath = `${manifestPath}.${process.pid}.tmp`;

  await mkdir(path.dirname(manifestPath), { recursive: true });
  try {
    await writeFile(temporaryPath, output);
    await rename(temporaryPath, manifestPath);
  } finally {
    await unlink(temporaryPath).catch(() => undefined);
  }

  return timestamps.size;
}

export function serializeGitTimestampsManifest(
  timestamps: ReadonlyMap<string, Date>,
  contentDir: string,
): string {
  const entries = [...timestamps]
    .map(([filePath, modifiedAt]) => [
      toGitPath(path.relative(contentDir, filePath)),
      modifiedAt.getTime(),
    ])
    .sort(([pathA], [pathB]) => String(pathA).localeCompare(String(pathB)));
  const manifest: GitTimestampsManifest = {
    version: manifestVersion,
    timestamps: Object.fromEntries(entries),
  };

  return JSON.stringify(manifest);
}

export function deserializeGitTimestampsManifest(
  input: string,
  contentDir: string,
): Map<string, Date> {
  const manifest = JSON.parse(input) as Partial<GitTimestampsManifest>;
  if (manifest.version !== manifestVersion || !manifest.timestamps) {
    throw new Error("지원하지 않는 Git 타임스탬프 매니페스트입니다.");
  }

  const timestamps = new Map<string, Date>();
  for (const [filePath, timestamp] of Object.entries(manifest.timestamps)) {
    if (!Number.isFinite(timestamp)) {
      throw new Error(`잘못된 Git 타임스탬프입니다: ${filePath}`);
    }
    timestamps.set(path.resolve(contentDir, filePath), new Date(timestamp));
  }

  return timestamps;
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
