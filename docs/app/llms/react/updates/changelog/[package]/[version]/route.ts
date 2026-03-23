import {
  buildLookupFromSources,
  groupEntriesByVersion,
  renderVersionMarkdown,
} from "@/lib/changelog-llms";
import { loadChangelogSources, splitVersionSections } from "@/lib/parse-changelog";
import { notFound } from "next/navigation";

export const revalidate = false;

const SCOPE = "@seed-design/";

function toSlug(packageName: string): string {
  return packageName.replace(SCOPE, "");
}

function toPackageName(slug: string): string {
  return `${SCOPE}${slug}`;
}

let sourcesCache: Awaited<ReturnType<typeof loadChangelogSources>> | null = null;

async function getSources() {
  if (!sourcesCache) {
    sourcesCache = await loadChangelogSources(process.cwd());
  }
  return sourcesCache;
}

export async function generateStaticParams() {
  const sources = await getSources();
  const params: Array<{ package: string; version: string }> = [];

  for (const source of sources) {
    const slug = toSlug(source.packageName);
    const versions = splitVersionSections(source.raw);
    for (const { version } of versions) {
      params.push({ package: slug, version: `${version}.txt` });
    }
  }

  return params;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ package: string; version: string }> },
) {
  const params = await context.params;
  const slug = params.package;
  const version = params.version.replace(/\.txt$/, "");

  const packageName = toPackageName(slug);
  const sources = await getSources();
  const source = sources.find((s) => s.packageName === packageName);

  if (!source) notFound();

  const versions = splitVersionSections(source.raw);
  const idx = versions.findIndex((v) => v.version === version);

  if (idx === -1) notFound();

  const { entries, lookup } = await buildLookupFromSources(sources);
  const versionGroups = groupEntriesByVersion(entries, packageName);

  // versions는 최신순이므로 0..idx가 해당 버전 포함 이후 전체
  const sinceVersions = versions.slice(0, idx + 1);

  const body = sinceVersions
    .map(({ version: v }) => {
      const group = versionGroups.get(v);
      if (!group) return `## ${v}\n\n(no entries)`;
      return renderVersionMarkdown(packageName, v, group, lookup);
    })
    .join("\n\n---\n\n");

  return new Response(
    `# ${packageName} — Changes since v${version}

${body}
`,
    { headers: { "Content-Type": "text/markdown; charset=utf-8" } },
  );
}
