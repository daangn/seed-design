import {
  getChangelogLlmData,
  getSources,
  toPackageName,
  toSlug,
  toVersionSlug,
} from "@/lib/changelog-llms";
import { splitVersionSections } from "@/lib/parse-changelog";
import { notFound } from "next/navigation";

export const revalidate = false;

export async function generateStaticParams() {
  const sources = await getSources();
  const params: Array<{ package: string; version: string }> = [];

  for (const source of sources) {
    const slug = toSlug(source.packageName);
    const versions = splitVersionSections(source.raw);
    for (const { version } of versions) {
      params.push({ package: slug, version: `${toVersionSlug(version)}.txt` });
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
  const version = decodeURIComponent(params.version.replace(/\.txt$/, ""));

  const packageName = toPackageName(slug);
  const data = await getChangelogLlmData();
  const packageData = data.packages.get(packageName);

  if (!packageData) notFound();

  const idx = packageData.versionIndex.get(version);

  if (idx === undefined) notFound();

  // versions는 최신순이므로 0..idx가 해당 버전 포함 이후 전체
  const body = packageData.renderedBlocks.slice(0, idx + 1).join("\n\n---\n\n");

  return new Response(
    `# ${packageName} — Changes since ${version}

${body}
`,
    { headers: { "Content-Type": "text/markdown; charset=utf-8" } },
  );
}
