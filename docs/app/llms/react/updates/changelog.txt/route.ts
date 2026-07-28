import { baseUrl } from "@/app/metadata";
import { getChangelogLlmData, type ChangelogLlmData } from "@/lib/changelog-llms";

export const revalidate = false;

const CHANGELOG_SOURCE_URL = "https://github.com/daangn/seed-design/tree/dev/packages";

function buildBody(data: ChangelogLlmData): string {
  const sorted = [...data.packages.values()].sort((a, b) =>
    a.packageName.localeCompare(b.packageName),
  );

  return sorted
    .map(({ packageName, renderedBlocks }) => `## ${packageName}\n\n${renderedBlocks.join("\n\n")}`)
    .join("\n\n---\n\n");
}

export async function GET() {
  const data = await getChangelogLlmData();
  const body = buildBody(data);

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
