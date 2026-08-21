import type { ChangelogLlmData, ChangelogLlmPackageData } from "./changelog-llms";
import { toSlug, toVersionSlug } from "./changelog-llms";

const CHANGELOG_SOURCE_URL = "https://github.com/daangn/seed-design/tree/dev/packages";

export interface ChangelogLlmOutputFile {
  path: string;
  content: string;
}

export function buildChangelogLlmOutputFiles(
  data: ChangelogLlmData,
  baseUrl: URL,
): ChangelogLlmOutputFile[] {
  const files: ChangelogLlmOutputFile[] = [
    {
      path: "llms/react/updates/changelog.txt",
      content: buildAllPackagesChangelog(data, baseUrl),
    },
  ];

  for (const packageData of data.packages.values()) {
    const slug = toSlug(packageData.packageName);

    files.push({
      path: `llms/react/updates/changelog/${slug}/llms.txt`,
      content: buildPackageChangelog(packageData, slug, baseUrl),
    });

    for (const [index, version] of packageData.versions.entries()) {
      files.push({
        path: `llms/react/updates/changelog/${slug}/${toVersionSlug(version)}.txt`,
        content: buildVersionChangelog(packageData, version, index),
      });
    }
  }

  return files;
}

export function buildAllPackagesChangelog(data: ChangelogLlmData, baseUrl: URL): string {
  const sorted = [...data.packages.values()].sort((a, b) =>
    a.packageName.localeCompare(b.packageName),
  );
  const body = sorted
    .map(({ packageName, renderedBlocks }) => `## ${packageName}\n\n${renderedBlocks.join("\n\n")}`)
    .join("\n\n---\n\n");
  const pageUrl = new URL("/react/updates/changelog", baseUrl).toString();

  return `# Changelog\nURL: ${pageUrl}\nSource: ${CHANGELOG_SOURCE_URL}\n\n최신 업데이트와 변경사항을 기록합니다.\n\n${body}`;
}

export function buildPackageChangelog(
  packageData: ChangelogLlmPackageData,
  slug: string,
  baseUrl: URL,
): string {
  const versionList = packageData.versions
    .map((version) => {
      const url = new URL(
        `/llms/react/updates/changelog/${slug}/${toVersionSlug(version)}.txt`,
        baseUrl,
      );
      return `- [${version}](${url}) — changes since this version`;
    })
    .join("\n");
  const fullChangelog = packageData.renderedBlocks.join("\n\n---\n\n");

  return `# ${packageData.packageName} Changelog

## Versions

${versionList}

---

${fullChangelog}
`;
}

export function buildVersionChangelog(
  packageData: ChangelogLlmPackageData,
  version: string,
  versionIndex: number,
): string {
  const body = packageData.renderedBlocks.slice(0, versionIndex + 1).join("\n\n---\n\n");

  return `# ${packageData.packageName} — Changes since ${version}

${body}
`;
}
