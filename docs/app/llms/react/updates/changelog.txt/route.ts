import { baseUrl } from "@/app/metadata";
import type { ChangelogSource } from "@/lib/parse-changelog";
import { loadChangelogSources } from "@/lib/parse-changelog";
import type { NextRequest } from "next/server";
import { gte, valid, coerce } from "semver";

export const dynamic = "force-dynamic";

const CHANGELOG_SOURCE_URL = "https://github.com/daangn/seed-design/tree/dev/packages";

/**
 * 패키지의 raw changelog에서 특정 버전 이상의 섹션만 필터링합니다.
 * `## {version}` 헤딩 기준으로 분리하고, from 버전 이상만 포함합니다.
 */
function filterVersionSections(raw: string, minVersion: string): string {
  const header = raw.match(/^# .+\n/)?.[0] ?? "";
  const body = raw.replace(/^# .+\n/, "");
  const sections = body.split(/(?=^## )/m).filter(Boolean);

  const parsed = valid(minVersion) ?? valid(coerce(minVersion));
  if (!parsed) return raw;

  const filtered = sections.filter((section) => {
    const versionMatch = section.match(/^## ([^\n]+)/);
    if (!versionMatch) return false;
    const version = versionMatch[1].trim();
    const parsedVersion = valid(version) ?? valid(coerce(version));
    if (!parsedVersion) return false;
    return gte(parsedVersion, parsed);
  });

  if (filtered.length === 0) return "";
  return (header + filtered.join("")).trimStart();
}

function buildBody(sources: ChangelogSource[], pkg?: string, version?: string): string {
  let filtered = sources.sort((a, b) => a.packageName.localeCompare(b.packageName));

  if (pkg) {
    filtered = filtered.filter((s) => s.packageName === pkg);
  }

  return filtered
    .map(({ packageName, raw }) => {
      let content = raw;
      if (version) {
        content = filterVersionSections(content, version);
        if (!content) return null;
      }
      const normalized = content.replace(/^# .+\n/, "").trimStart();
      return `## ${packageName}\n\n${normalized}`;
    })
    .filter(Boolean)
    .join("\n\n---\n\n");
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const pkg = searchParams.get("package") ?? undefined;
  const version = searchParams.get("version") ?? undefined;

  const sources = await loadChangelogSources(process.cwd());
  const body = buildBody(sources, pkg, version);

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
