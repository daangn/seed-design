import { baseUrl } from "@/app/metadata";
import { loadChangelogSources, splitVersionSections } from "@/lib/parse-changelog";

export const revalidate = false;

const SCOPE = "@seed-design/";

function toSlug(packageName: string): string {
  return packageName.replace(SCOPE, "");
}

export async function GET() {
  const sources = await loadChangelogSources(process.cwd());
  const sorted = sources.sort((a, b) => a.packageName.localeCompare(b.packageName));

  const rows = sorted.map(({ packageName, raw }) => {
    const versions = splitVersionSections(raw);
    const latest = versions[0]?.version ?? "-";
    const slug = toSlug(packageName);
    const url = new URL(`/llms/changelog/${slug}/llms.txt`, baseUrl);
    return `- [${packageName}](${url}) (latest: ${latest})`;
  });

  return new Response(
    `# SEED Design Changelog - Package Index

패키지별 변경 이력을 확인할 수 있습니다.
각 패키지 링크를 통해 버전별 상세 changelog에 접근할 수 있습니다.

## Packages

${rows.join("\n")}
`,
    { headers: { "Content-Type": "text/markdown; charset=utf-8" } },
  );
}
