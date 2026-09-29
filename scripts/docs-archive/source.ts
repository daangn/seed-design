import { type ArchiveDefinition, validateArchive } from "./config";

// Resolve a reviewed branch through GitHub, never trust the SHA reported by Pages alone.
export async function resolveArchiveSource(
  archive: ArchiveDefinition,
  token?: string,
  fetcher: typeof fetch = fetch,
): Promise<ArchiveDefinition & { sourceSha: string }> {
  validateArchive(archive);
  const { sourceBranch: _, ...definition } = archive;
  if (archive.sourceSha) return { ...definition, sourceSha: archive.sourceSha };
  const response = await fetcher(
    `https://api.github.com/repos/daangn/seed-design/git/ref/heads/${encodeURIComponent(archive.sourceBranch!)}`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      redirect: "error",
      signal: AbortSignal.timeout(30_000),
    },
  );
  if (!response.ok) {
    await response.body?.cancel();
    throw new Error(
      `Cannot resolve source branch ${archive.sourceBranch}: GitHub ${response.status}`,
    );
  }
  const ref = await response.json();
  if (
    ref.ref !== `refs/heads/${archive.sourceBranch}` ||
    ref.object?.type !== "commit" ||
    !/^[a-f0-9]{40}$/.test(ref.object?.sha ?? "")
  ) {
    throw new Error(`Unexpected GitHub branch response for ${archive.sourceBranch}`);
  }
  return { ...definition, sourceSha: ref.object.sha };
}
