import { baseUrl } from "@/app/metadata";
import { loadChangelogSources } from "@/lib/parse-changelog";

export const revalidate = false;

const CHANGELOG_SOURCE_URL = "https://github.com/daangn/seed-design/tree/dev/packages";

export async function GET() {
  const sources = await loadChangelogSources(process.cwd());
  const sorted = sources.sort((a, b) => a.packageName.localeCompare(b.packageName));

  const body = sorted
    .map(({ packageName, raw }) => {
      const normalized = raw.replace(/^# .+\n/, "").trimStart();
      return `## ${packageName}\n\n${normalized}`;
    })
    .join("\n\n---\n\n");

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
