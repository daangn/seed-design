import { baseUrl } from "@/app/metadata";
import type { ChangelogSource } from "@/lib/parse-changelog";
import { loadChangelogSources } from "@/lib/parse-changelog";

export const revalidate = false;

const CHANGELOG_SOURCE_URL = "https://github.com/daangn/seed-design/tree/dev/packages";

function buildBody(sources: ChangelogSource[]): string {
  return sources
    .sort((a, b) => a.packageName.localeCompare(b.packageName))
    .map(({ packageName, raw }) => {
      const normalized = raw.replace(/^# .+\n/, "").trimStart();
      return `## ${packageName}\n\n${normalized}`;
    })
    .join("\n\n---\n\n");
}

export async function GET() {
  const sources = await loadChangelogSources(process.cwd());
  const body = buildBody(sources);

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
