import { ChangelogViewer } from "@/components/changelog-viewer";
import { parseChangelog } from "@/lib/parse-changelog";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page";
import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Suspense } from "react";

const CHANGELOG_PATH = "content/react/updates/changelog.mdx";

function getChangelogRaw() {
  return readFileSync(join(process.cwd(), CHANGELOG_PATH), "utf-8");
}

export default async function ChangelogPage() {
  const raw = getChangelogRaw();
  const entries = await parseChangelog(raw);

  const packages = [...new Set(entries.flatMap((e) => e.packages.map((p) => p.name)))];

  return (
    <div className="changelog-page">
      <DocsPage>
        <DocsTitle>Changelog</DocsTitle>
        <DocsDescription>최신 업데이트와 변경사항을 기록합니다.</DocsDescription>
        <DocsBody className="pb-0 prose-p:break-keep prose-p:text-pretty prose-headings:text-balance">
          <Suspense>
            <ChangelogViewer entries={entries} packages={packages} />
          </Suspense>
        </DocsBody>
      </DocsPage>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Changelog",
  description: "최신 업데이트와 변경사항을 기록합니다.",
};
