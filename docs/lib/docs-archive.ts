// This value is embedded at build time (`astro.config.ts` define). An unset value keeps the existing Pages build unchanged.
const DOCS_ARCHIVE_CHANNEL = process.env.NEXT_PUBLIC_DOCS_ARCHIVE_CHANNEL ?? "";

export type ArchivePlatform = "react" | "lynx";

// A channel is `{platform}/{version}`. Only React keeps its retained v1.x minor channels.
export function parseArchiveChannel(channel: string) {
  const match = /^(react|lynx)\/(v(?:0|[1-9]\d*|1\.(?:0|[1-9]\d*)))$/.exec(channel);
  if (!match || (match[1] !== "react" && match[2].includes("."))) {
    throw new Error(
      `Invalid archive channel: ${channel}. Use a major channel such as react/v2 or lynx/v0, or retained react/v1.0 channels.`,
    );
  }
  return { platform: match[1] as ArchivePlatform, version: match[2] };
}

/** 경로가 archive 채널(`/react/v2/…`, `/lynx/v0`) 아래인가. 다른 빌드로 가는 이동을 가려내는 데 쓴다. */
export function isArchivePath(pathname: string): boolean {
  const [, platform, version] = pathname.split("/");
  if (!platform || !version) return false;
  try {
    parseArchiveChannel(`${platform}/${version}`);
    return true;
  } catch {
    return false;
  }
}

/** 경로가 `prefix`(archive 채널 접두사, 예: `/react/v2`) 아래인가. */
export function isUnderPrefix(prefix: string, pathname: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function createArchivePaths(channel: string) {
  const { platform, version } = channel
    ? parseArchiveChannel(channel)
    : { platform: undefined, version: "" };
  const prefix = channel ? `/${channel}` : "";
  const isLocal = (path: string) => path.startsWith("/") && !path.startsWith("//");
  const isScoped = (path: string) =>
    !!prefix &&
    (path === prefix ||
      ["/", "?", "#"].some((boundary) => path.startsWith(`${prefix}${boundary}`)));

  return {
    channel,
    platform,
    version,
    prefix,
    // Only the archived platform's docs route moves under the version; other platforms stay latest.
    routes(target: ArchivePlatform) {
      const archived = !!prefix && target === platform;
      return {
        base: archived ? prefix : `/${target}`,
        contentSlug(slug: string[] = []) {
          return archived && slug[0] === version ? slug.slice(1) : slug;
        },
        routeSlug(slug: string[] = []) {
          return archived ? [version, ...slug] : slug;
        },
      };
    },
    // Public assets and Astro chunks are copied here by the archive exporter.
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
      const platformPrefix = `/${platform}`;
      if (
        path === platformPrefix ||
        ["/", "?", "#"].some((boundary) => path.startsWith(`${platformPrefix}${boundary}`))
      ) {
        return `${prefix}${path.slice(platformPrefix.length)}`;
      }
      if (/^\/(?:llms|__registry__|__docs__|api)(?:[/.?]|$)/.test(path)) {
        return `${prefix}${path}`;
      }
      return `https://seed-design.io${path}`;
    },
  };
}

export const archivePaths = createArchivePaths(DOCS_ARCHIVE_CHANNEL);

// Repository-relative manifest whose version decides which archive channel a checkout may build.
export const ARCHIVE_SOURCE_PACKAGES = {
  react: "packages/react/package.json",
  lynx: "packages/lynx-react/package.json",
} as const satisfies Record<ArchivePlatform, string>;

export function assertArchiveSource(channel: string, packageVersion: string) {
  const { platform, version } = parseArchiveChannel(channel);
  const [major, minor] = version.slice(1).split(".");
  const [sourceMajor, sourceMinor] = packageVersion.split(".");
  // React 1.x의 기존 마이너 채널만 보존하고, 그 밖에는 메이저 전체를 보관한다.
  const retainedReactMinor = platform === "react" && major === "1" && minor === sourceMinor;
  if (major !== sourceMajor || (minor !== undefined && !retainedReactMinor)) {
    throw new Error(`Archive ${channel} cannot be built from ${platform} ${packageVersion}`);
  }
}
