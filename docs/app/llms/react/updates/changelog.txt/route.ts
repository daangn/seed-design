import { baseUrl } from "@/app/metadata";
import {
  buildLookupFromSources,
  groupEntriesByVersion,
  renderVersionMarkdown,
} from "@/lib/changelog-llms";
import type { ChangelogSource } from "@/lib/parse-changelog";
import { loadChangelogSources, splitVersionSections } from "@/lib/parse-changelog";

export const revalidate = false;

const CHANGELOG_SOURCE_URL = "https://github.com/daangn/seed-design/tree/dev/packages";

async function buildBody(sources: ChangelogSource[]): Promise<string> {
  const { entries, lookup } = await buildLookupFromSources(sources);
  const sorted = [...sources].sort((a, b) => a.packageName.localeCompare(b.packageName));

  return sorted
    .map(({ packageName, raw }) => {
      const versions = splitVersionSections(raw);
      const versionGroups = groupEntriesByVersion(entries, packageName);

      const versionBlocks = versions
        .map(({ version }) => {
          const group = versionGroups.get(version);
          if (!group) return `## ${version}\n\n(no entries)`;
          return renderVersionMarkdown(packageName, version, group, lookup);
        })
        .join("\n\n");

      return `## ${packageName}\n\n${versionBlocks}`;
    })
    .join("\n\n---\n\n");
}

export async function GET() {
  const sources = await loadChangelogSources(process.cwd());
  const body = await buildBody(sources);

  const pageUrl = new URL("/react/updates/changelog", baseUrl).toString();

  return new Response(
    `# Changelog\nURL: ${pageUrl}\nSource: ${CHANGELOG_SOURCE_URL}\n\n최신 업데이트와 변경사항을 기록합니다.\n\n${body}`,
    {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
      },
    },
  );
}
