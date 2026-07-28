import { baseUrl } from "@/app/metadata";
import {
  getChangelogLlmData,
  getSources,
  toPackageName,
  toSlug,
  toVersionSlug,
} from "@/lib/changelog-llms";
import { notFound } from "next/navigation";

export const revalidate = false;

export async function generateStaticParams() {
  const sources = await getSources();
  return sources.map(({ packageName }) => ({ package: toSlug(packageName) }));
}

export async function GET(_request: Request, context: { params: Promise<{ package: string }> }) {
  const { package: slug } = await context.params;
  const packageName = toPackageName(slug);
  const data = await getChangelogLlmData();
  const packageData = data.packages.get(packageName);

  if (!packageData) notFound();

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
