import { ChangelogViewer } from "@/components/changelog-viewer";
import { parseChangelog } from "@/lib/parse-changelog";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page";
import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";

function getChangelogRaw() {
  return readFileSync(join(process.cwd(), "content/react/updates/changelog.mdx"), "utf-8");
}

export default async function ChangelogPage() {
  const raw = getChangelogRaw();
  const entries = await parseChangelog(raw);

  const PINNED_PACKAGES = ["@seed-design/react", "@seed-design/css"];
  const allPackages = [...new Set(entries.flatMap((e) => e.packages.map((p) => p.name)))];
  const packages = [
    ...PINNED_PACKAGES.filter((p) => allPackages.includes(p)),
    ...allPackages.filter((p) => !PINNED_PACKAGES.includes(p)).sort(),
  ];

  return (
    <DocsPage>
      <DocsTitle>Changelog</DocsTitle>
      <DocsDescription>최신 업데이트와 변경사항을 기록합니다.</DocsDescription>
      <DocsBody className="prose-p:break-keep prose-p:text-pretty prose-headings:text-balance">
        <ChangelogViewer entries={entries} packages={packages} />
      </DocsBody>
    </DocsPage>
  );
}

export const metadata: Metadata = {
  title: "Changelog",
  description: "최신 업데이트와 변경사항을 기록합니다.",
};
