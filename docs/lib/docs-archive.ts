// This value is embedded by Next.js. An unset value keeps the existing Pages build unchanged.
export const REACT_ARCHIVE_VERSION = process.env.NEXT_PUBLIC_REACT_ARCHIVE_VERSION ?? "";

export function createArchivePaths(version: string) {
  if (version && !/^v(?:[1-9]\d*|1\.(?:0|[1-9]\d*))$/.test(version)) {
    throw new Error(
      `Invalid React archive version: ${version}. Use v2, or retained v1.0 channels.`,
    );
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
      const legacy = path.match(/^https:\/\/v1-([012])\.seed-design\.io\/react(?=[/?#]|$)(.*)$/);
      if (legacy) return `https://seed-design.io/react/v1.${legacy[1]}${legacy[2]}`;
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

export function assertReactArchiveSource(version: string, packageVersion: string) {
  createArchivePaths(version);
  const [major, minor] = version.slice(1).split(".");
  const [sourceMajor, sourceMinor] = packageVersion.split(".");
  // React 1.x의 기존 마이너 채널만 보존하고, v2부터는 메이저 전체를 보관한다.
  if (
    !version ||
    major !== sourceMajor ||
    (minor !== undefined && (major !== "1" || minor !== sourceMinor))
  ) {
    throw new Error(`Archive ${version} cannot be built from React ${packageVersion}`);
  }
}
