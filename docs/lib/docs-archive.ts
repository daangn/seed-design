// This value is embedded by Next.js. An unset value keeps the existing Pages build unchanged.
export const REACT_ARCHIVE_VERSION = process.env.NEXT_PUBLIC_REACT_ARCHIVE_VERSION ?? "";

export function createArchivePaths(version: string) {
  if (version && !/^v(?:[2-9]|[1-9]\d+)$/.test(version)) {
    throw new Error(`Invalid React archive version: ${version}. Use a major such as v2.`);
  }
  const prefix = version ? `/react/${version}` : "";
  const isLocal = (path: string) => path.startsWith("/") && !path.startsWith("//");
  const isScoped = (path: string) =>
    !!prefix &&
    (path === prefix ||
      ["/", "?", "#"].some((boundary) => path.startsWith(`${prefix}${boundary}`)));

  return {
    version,
    prefix,
    reactBase: prefix || "/react",
    // Public assets and Next chunks are copied here by the archive exporter.
    asset(path: string) {
      return prefix && isLocal(path) && !isScoped(path) ? `${prefix}/_assets${path}` : path;
    },
    endpoint(path: string) {
      return prefix && isLocal(path) && !isScoped(path) ? `${prefix}${path}` : path;
    },
    link(path: string) {
      if (!prefix || !isLocal(path) || isScoped(path)) return path;
      if (/^\/react(?:[/?#]|$)/.test(path)) return `${prefix}${path.slice(6)}`;
      if (/^\/(?:llms|__registry__|__docs__|api)(?:[/.?]|$)/.test(path)) {
        return `${prefix}${path}`;
      }
      return `https://seed-design.io${path}`;
    },
    contentSlug(slug: string[] = []) {
      return version && slug[0] === version ? slug.slice(1) : slug;
    },
    routeSlug(slug: string[] = []) {
      return version ? [version, ...slug] : slug;
    },
  };
}

export const archivePaths = createArchivePaths(REACT_ARCHIVE_VERSION);
