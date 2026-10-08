export type ChangelogPlatform = "react" | "lynx";

export const CHANGELOG_PLATFORMS: readonly ChangelogPlatform[] = ["react", "lynx"];

export function getChangelogPlatform(packageName: string): ChangelogPlatform {
  return packageName.startsWith("@seed-design/lynx-") ||
    packageName === "@seed-design/rsbuild-plugin-lynx-icon"
    ? "lynx"
    : "react";
}
