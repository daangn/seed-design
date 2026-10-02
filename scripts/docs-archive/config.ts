export interface ArchiveDefinition {
  platform: string;
  version: string;
  origin: string;
  // Use a branch for normal operation, or a fixed SHA when pinning a rollback deployment.
  sourceBranch?: string;
  sourceSha?: string;
  probe: { document: string; registryItem: string };
}

export function archivePrefix(archive: Pick<ArchiveDefinition, "platform" | "version">) {
  if (
    !/^[a-z][a-z0-9-]*$/.test(archive.platform) ||
    !/^v(?:[1-9]\d*|1\.(?:0|[1-9]\d*))$/.test(archive.version)
  ) {
    throw new Error("Archive paths must use a platform and version channel, such as lynx/v1");
  }
  return `/${archive.platform}/${archive.version}`;
}

export function isArchivePath(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function archiveOrigin(value: string): URL {
  const url = new URL(value);
  if (
    url.protocol !== "https:" ||
    !url.hostname.endsWith(".pages.dev") ||
    url.port ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error("Archive origin must be a verified HTTPS Pages branch alias origin");
  }
  return url;
}

// Validate the entire registry before deploying the shared Worker, never just the newest entry.
export function archiveRoutes(archives: readonly ArchiveDefinition[]) {
  if (archives.length === 0) throw new Error("At least one archive must be registered");
  const prefixes = archives.map(archivePrefix);
  if (new Set(prefixes).size !== prefixes.length) throw new Error("Duplicate archive path");
  return prefixes.map((prefix) => `seed-design.io${prefix}*`);
}

export function validateArchive(archive: ArchiveDefinition) {
  const prefix = archivePrefix(archive);
  if (!archive.origin)
    throw new Error(`${prefix}: fill in the verified Pages origin in archives.json`);
  archiveOrigin(archive.origin);
  if (!archive.sourceBranch && !archive.sourceSha) {
    throw new Error(`${prefix}: supply sourceBranch, or sourceSha for a pinned deployment`);
  }
  if (archive.sourceSha && !/^[a-f0-9]{40}$/.test(archive.sourceSha)) {
    throw new Error(`${prefix}: sourceSha must contain 40 lowercase hex characters`);
  }
  if (archive.sourceBranch) {
    validateSourceBranch(archive.sourceBranch);
  }
  for (const value of [archive.probe.document, archive.probe.registryItem]) {
    if (!/^[a-z0-9-]+(?:\/[a-z0-9-]+)+$/.test(value)) {
      throw new Error(`${prefix}: probes must be relative document and registry paths`);
    }
  }
}

export function validateSourceBranch(branch: string) {
  if (
    !/^[a-zA-Z0-9][a-zA-Z0-9._/-]*$/.test(branch) ||
    branch.includes("..") ||
    branch
      .split("/")
      .some((part) => !part || part.startsWith(".") || part.endsWith(".") || part.endsWith(".lock"))
  ) {
    throw new Error("sourceBranch must be a valid, explicit release branch name");
  }
}
