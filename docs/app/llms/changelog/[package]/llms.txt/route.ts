import { baseUrl } from "@/app/metadata";
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
  return sources.map(({ packageName }) => ({ package: toSlug(packageName) }));
}

export async function GET(_request: Request, context: { params: Promise<{ package: string }> }) {
  const { package: slug } = await context.params;
  const packageName = toPackageName(slug);
  const sources = await getSources();
  const source = sources.find((s) => s.packageName === packageName);

  if (!source) notFound();

  const versions = splitVersionSections(source.raw);

  const versionList = versions
    .map(({ version }) => {
      const url = new URL(`/llms/changelog/${slug}/${version}.txt`, baseUrl);
      return `- [${version}](${url}) — changes since this version`;
    })
    .join("\n");

  const fullChangelog = versions
    .map(({ version, body }) => `## ${version}\n\n${body}`)
    .join("\n\n---\n\n");

  return new Response(
    `# ${packageName} Changelog

## Versions

${versionList}

---

${fullChangelog}
`,
    { headers: { "Content-Type": "text/markdown; charset=utf-8" } },
  );
}
