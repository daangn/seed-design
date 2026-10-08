import type { ChangelogLlmData, ChangelogLlmPackageData } from "./changelog-llms";
import { archivePaths } from "./docs-archive";
import { toSlug, toVersionSlug } from "./changelog-llms";
import type { ChangelogPlatform } from "./changelog-platform";

const CHANGELOG_SOURCE_URL = `https://github.com/daangn/seed-design/tree/${process.env.SEED_DOCS_SOURCE_REF ?? "dev"}/packages`;

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
      path: `llms/${data.platform}/updates/changelog.txt`,
      content: buildAllPackagesChangelog(data, baseUrl),
    },
  ];

  for (const packageData of data.packages.values()) {
    const slug = toSlug(packageData.packageName);

    files.push({
      path: `llms/${data.platform}/updates/changelog/${slug}/llms.txt`,
      content: buildPackageChangelog(packageData, slug, baseUrl, data.platform),
    });

    for (const [index, version] of packageData.versions.entries()) {
      files.push({
        path: `llms/${data.platform}/updates/changelog/${slug}/${toVersionSlug(version)}.txt`,
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
  const pageUrl = new URL(
    archivePaths.link(`/${data.platform}/updates/changelog`),
    baseUrl,
  ).toString();

  return `# Changelog\nURL: ${pageUrl}\nSource: ${CHANGELOG_SOURCE_URL}\n\n최신 업데이트와 변경사항을 기록합니다.\n\n${body}`;
}

export function buildPackageChangelog(
  packageData: ChangelogLlmPackageData,
  slug: string,
  baseUrl: URL,
  platform: ChangelogPlatform,
): string {
  const versionList = packageData.versions
    .map((version) => {
      const endpoint = `/llms/${platform}/updates/changelog/${slug}/${toVersionSlug(version)}.txt`;
      const url = new URL(
        platform === "react" ? archivePaths.endpoint(endpoint) : endpoint,
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
