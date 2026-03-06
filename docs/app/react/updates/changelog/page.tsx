import { getLLMMarkdownUrl } from "@/app/_llms/config";
import { ChangelogViewer } from "@/components/changelog-viewer";
import { LLMOptions, ViewOptions } from "@/components/page-actions";
import { parseChangelog } from "@/lib/parse-changelog";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page";
import type { Metadata } from "next";
import { Suspense } from "react";

const CHANGELOG_SOURCE_URL = "https://github.com/daangn/seed-design/tree/dev/packages";

export default async function ChangelogPage() {
  const entries = await parseChangelog(process.cwd());

  const packages = [...new Set(entries.map((entry) => entry.package.name))];

  return (
    <div className="changelog-page">
      <DocsPage>
        <DocsTitle>Changelog</DocsTitle>
        <DocsDescription>최신 업데이트와 변경사항을 기록합니다.</DocsDescription>
        <div className="flex flex-row gap-2 items-center mb-3 justify-end">
          <LLMOptions markdownUrl={getLLMMarkdownUrl("react", ["updates", "changelog"])} />
          <ViewOptions
            markdownUrl={getLLMMarkdownUrl("react", ["updates", "changelog"])}
            githubUrl={CHANGELOG_SOURCE_URL}
          />
        </div>
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
